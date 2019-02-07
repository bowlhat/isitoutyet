import { LitElement, html, css } from 'lit-element';
// import "@material/mwc-button/mwc-button.js";

import { ButtonSharedStyles } from './button-shared-styles';
import {messaging} from '../push-notifications';

const unavailNotifyText = 'Notifcations unavailable';
const notifyText        = 'Notify me!';
const stopNotifyText    = 'Stop notifying me';
// const errorMsg          = 'An error occurred';

function storageAvailable(type: string) {
    var storage: Storage = (window as any)[type],
        x = '__storage_test__';
    try {
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}
const localStorageActive = storageAvailable('localStorage');

class PushNotificationButton extends LitElement {
    disabled: boolean
    subscribed: boolean
    twoButtonMode: boolean
    buttonText: string
    project: string

    static get styles() {
        return [
            ButtonSharedStyles,
            css`
                :host {
                    text-align: center;
                    display: block;
                }
            `
        ];
    }
    
    render() {
        const {disabled, subscribed, twoButtonMode} = this;

        return html`
            ${(twoButtonMode === true) ? html`
                <button @click="${this.subscribe.bind(this)}" ?disabled="${disabled}">${notifyText}</button>
                <button @click="${this.unsubscribe.bind(this)}" ?disabled="${disabled}">${stopNotifyText}</button>
            ` : html`
                <button @click="${this.clickHandler.bind(this)}" ?disabled="${disabled}">${subscribed ? stopNotifyText : notifyText}</button>            
            `}
        `;
    }
  
    static get properties() {
        return {
            disabled: { type: Boolean },
            subscribed: { type: Boolean },
            twoButtonMode: { type: Boolean },
            project: {
                type: String,
                observer: '_projectChanged'
            },
            active: { type: Boolean },
        };
    }
  
    constructor() {
        super();
        this.buttonText = unavailNotifyText;
        if (localStorageActive) {
            this.twoButtonMode = false;
        } else {
            this.twoButtonMode = true;
        }
        this.subscribed = false;
        this.disabled = false;
        this.project = '';
    }

    update(changedProps: Map<string, string | boolean>) {
        if (changedProps.has('project')) {
            const projectName = changedProps.get('project');
            if (typeof projectName === 'string' && projectName) {
                this.subscribed = !!('subscribed' === localStorage.getItem(projectName))
            }
        }
        super.update(changedProps);
    }
  
    async subscribe() {
        try {
            await messaging.requestPermission();
            const token = await messaging.getToken();
            if (token) {
                fetch(`/api/project/${this.project}/register`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
            }
            this.buttonText = unavailNotifyText;
            this.subscribed = true;
            localStorage.setItem(this.project, 'subscribed');
        }
        catch (e) {
            console.log('Error subscribing push notifications:', e);
        }
    }
  
    async unsubscribe() {
        try {
            const token = await messaging.getToken();
            if (token) {
                fetch(`/api/project/${this.project}/unregister`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
            }
            this.subscribed = false;
            localStorage.setItem(this.project, '');
        }
        catch (e) {
            console.log('Erorr unsubscribing push notifications:', e);
        }
    }
  
    clickHandler() {
        if (!this.subscribed) {
            return this.subscribe();
        }
        return this.unsubscribe();
    }
}

window.customElements.define('push-notification-button', PushNotificationButton);
