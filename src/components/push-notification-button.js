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
    _render() {
        return html`
            <style>
                :host {
                    text-align: center;
                    display: block;
                }
            </style>
            ${ButtonSharedStyles}
            ${(this.twoButtonMode === true) ? html`
                <button on-click="subscribe" disabled?="${this.disabled}">${notifyText}</button>
                <button on-click="unsubscribe" disabled?="${this.disabled}">${stopNotifyText}</button>
            ` : html`
                <button on-click="clickHandler" disabled?="${this.disabled}">${this.buttonText}</button>            
            `}
        `;
    }
  
    static get properties() { return {
        disabled: Boolean,
        subscribed: Boolean,
        buttonText: String,
        project: {
            type: String,
            observer: '_projectChanged'
        }
    }};
  
    constructor() {
        super();
        if (localStorageActive) {
            this.twoButtonMode = false;
        } else {
            this.subscribed = false;
            this.twoButtonMode = true;
        }
        this.messaging = window.firebaseMessaging;
    }

    _projectChanged(newProject) {
        if (!localstorageActive) {
            return;
        }
        this.subscribed = ('subscribed' === localStorage.getItem(newProject));
    }
  
    subscribe() {
        return messaging.requestPermission()
        .then(messaging.getToken)
        .then(token => {
            if (token) {
                return fetch(`/api/project/${this.project}/register`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: token,
                });
            }
            this.buttonText = unavailNotifyText;
        })
        .then(() => {
            this.buttonText = stopNotifyText;
            this.subscribed = true;
            localStorage.setItem(this.project, 'subscribed');
        })
        .catch(e => {
            console.log('Error subscribing push notifications:', e);
            this.buttonText = errorMsg;
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
                    body: JSON.stringify({
                        subscription,
                    }),
                });
            }
        })
        .then(() => {
            this.buttonText = notifyText;
            this.subscribed = false;
            localStorage.setItem(this.project, false);
        })
        .catch(e => {
            console.log('Erorr unsubscribing push notifications:', e)
            this.buttonText = errorMsg;
        })
    }
  
    clickHandler() {
        if (!this.subscribed) {
            return this.subscribe();
        }
        return this.unsubscribe();
    }
}

window.customElements.define('push-notification-button', PushNotificationButton);
