import { LitElement, html } from '@polymer/lit-element';
// import "@material/mwc-button/mwc-button.js";

import { ButtonSharedStyles } from './button-shared-styles';
import GraphClient from '../data/graphql';
import {messaging} from '../push-notifications';

const graphQLOptions = {
    url: '/api/graphql',
};
const client = new GraphClient(graphQLOptions);

const unavailNotifyText = 'Notifcations unavailable';
const notifyText        = 'Notify me!';
const stopNotifyText    = 'Stop notifying me';
const errorMsg          = 'An error occurred';

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
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
    _render({disabled, subscribed, twoButtonMode}) {
        return html`
            <style>
                :host {
                    text-align: center;
                    display: block;
                }
            </style>
            ${ButtonSharedStyles}
            ${(twoButtonMode === true) ? html`
                <button on-click="${e => this.subscribe(e)}" disabled?="${disabled}">${notifyText}</button>
                <button on-click="${e => this.unsubscribe(e)}" disabled?="${disabled}">${stopNotifyText}</button>
            ` : html`
                <button on-click="${e => this.clickHandler(e)}" disabled?="${disabled}">${subscribed ? stopNotifyText : notifyText}</button>            
            `}
        `;
    }
  
    static get properties() { return {
        disabled: Boolean,
        subscribed: Boolean,
        twoButtonMode: Boolean,
        project: {
            type: String,
            observer: '_projectChanged'
        }
    }};
  
    constructor() {
        super();
        this.buttonText = unavailNotifyText;
        if (localStorageActive) {
            this.twoButtonMode = false;
            this.subscribed = false;
        } else {
            this.twoButtonMode = true;
        }
    }

    _propertiesChanged(props, changedProps, prevProps) {
        if ('project' in changedProps) {
            if (localStorageActive) {
                props.subscribed = changedProps.subscribed = (
                    'subscribed' === localStorage.getItem(props.project));
            }
        }

        super._propertiesChanged(props, changedProps, prevProps);
    }
  
    subscribe() {
        return messaging.requestPermission()
        .then(() => messaging.getToken())
        .then(token => {
            if (token) {
                return fetch(`/api/project/${this.project}/register`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({token}),
                });
            }
            this.buttonText = unavailNotifyText;
        })
        .then(() => {
            this.subscribed = true;
            localStorage.setItem(this.project, 'subscribed');
        })
        .catch(e => {
            console.log('Error subscribing push notifications:', e);
        });
    }
  
    unsubscribe() {
        return messaging.getToken()
        .then(token => {
            if (token) {
                return fetch(`/api/project/${this.project}/unregister`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({token}),
                });
            }
        })
        .then(() => {
            this.subscribed = false;
            localStorage.setItem(this.project, false);
        })
        .catch(e => {
            console.log('Erorr unsubscribing push notifications:', e)
        });
    }
  
    clickHandler() {
        if (!this.subscribed) {
            return this.subscribe();
        }
        return this.unsubscribe();
    }
}

window.customElements.define('push-notification-button', PushNotificationButton);
