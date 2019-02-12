import { LitElement, property, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
// import "@material/mwc-button/mwc-button.js";

import { ButtonSharedStyles } from './button-shared-styles';
import {messaging} from '../push-notifications';
import { store, RootState } from '../store';
import { Project } from '../reducers/projects';
import projects from '../reducers/projects';
import {plusIcon, minusIcon} from './my-icons';

store.addReducers({
    projects,
});

const notifyText        = 'Notify me of new releases!';
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

class PushNotificationButton extends connect(store)(LitElement) {
    @property({type: Boolean})
    private disabled: boolean = false;

    @property({type: Boolean})
    private subscribed: boolean = false;

    @property({type: Boolean})
    private twoButtonMode: boolean = false;

    @property({type: String})
    public project: string = '';

    static styles = [
        ButtonSharedStyles,
        css`
            :host {
                text-align: center;
                display: block;
                margin-bottom: 1em;
            }
            button {
                font-size: 1.2rem;
            }
            button svg {
                vertical-align: bottom;
                width: 1.4rem;
                height: 1.4rem;
                margin-right: 0.4rem;
            }
        `
    ];
    
    protected render() {
        const {disabled, subscribed, twoButtonMode} = this;

        return html`
            ${(twoButtonMode === true) ? html`
                <button @click="${this.subscribe.bind(this)}" ?disabled="${disabled}">${notifyText}</button>
                <button @click="${this.unsubscribe.bind(this)}" ?disabled="${disabled}">${stopNotifyText}</button>
            ` : html`
                <button @click="${this.clickHandler.bind(this)}" ?disabled="${disabled}">${subscribed ? html`${minusIcon}${stopNotifyText}` : html`${plusIcon}${notifyText}`}</button>            
            `}
        `;
    }
  
    private async subscribe() {
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
            this.subscribed = true;
            localStorage.setItem(this.project, 'subscribed');
        }
        catch (e) {
            console.log('Error subscribing push notifications:', e);
        }
    }
  
    private async unsubscribe() {
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
  
    private clickHandler() {
        if (!this.subscribed) {
            return this.subscribe();
        }
        return this.unsubscribe();
    }

    // This is called every time something is updated in the store.
    stateChanged(state: RootState) {
        if (state.projects && state.projects.project) {
            const project: Project = state.projects.project;
            if (project.name) {
                this.project = project.name;
                this.disabled = false;
                this.subscribed = !!(localStorageActive && 'subscribed' === localStorage.getItem(this.project))
            } else {
                this.disabled = true;
            }
        }
    }
}

window.customElements.define('push-notification-button', PushNotificationButton);
