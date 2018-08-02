import { LitElement, html } from '@polymer/lit-element';
// import "@material/mwc-button/mwc-button.js";

import { ButtonSharedStyles } from './button-shared-styles.js';

import GraphClient from '../data/graphql';
import {queries} from '../data/queries';

const graphQLOptions = {
    url: '/api/graphql',
};
const client = new GraphClient(graphQLOptions);

let vapidKey = '';
const notifyText = 'Notify me!';
const stopNotifyText = 'Stop notifying me';
const errorMsg = 'An error occurred';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; i += 1) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function getPushSubscription() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        return navigator.serviceWorker.ready.then(
            registration => registration.pushManager.getSubscription());
    }
    return Promise.reject();
}

fetch('/api/vapidPublicKey', {
    method: 'GET',
})
.then(res => res.text())
.then(key => {
    vapidKey = urlBase64ToUint8Array(key)
})

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
            <button on-click="${() => this.clickHandler()}" disabled?="${this.disabled}">${this.buttonText}</button>
        `;
    }
  
    static get properties() { return {
        disabled: Boolean,
        subscribed: Boolean,
        buttonText: String,
        project: String,
    }};

    constructor() {
        super();
        this.disabled = true;
        this.subscribed = false;
        this.buttonText = 'Notifcations unavailable';
    }
  
    _firstRendered() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            this.disabled = false;
            this.buttonText = notifyText;

            getPushSubscription().then(subscription => {
                if (subscription) {
                    client.get(queries.PushSubscription, { project: this.project, subscription: JSON.stringify(subscription) })
                    .then(data => {
                        if (this.disabled) {
                            this.disabled = false;
                        }

                        if (
                            data && data.project &&
                            data.project.pushSubscriptions &&
                            data.project.pushSubscriptions.length > 0
                        ) {
                            this.subscribed = true;
                            this.buttonText = stopNotifyText;
                        }
                    });
                }
            })
            .catch(() => {
                this.buttonText = errorMsg;
            });
        }
    }
  
    subscribe() {
        navigator.serviceWorker.ready
        .then(registration => registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidKey,
        }))
        .then(subscription => fetch(`/api/project/${this.project}/register`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscription,
            }),
        }))
        .then(() => {
            this.buttonText = stopNotifyText;
            this.subscribed = true;
        })
        .catch((e) => {
            this.buttonText = errorMsg;
        });
    }
  
    unsubscribe() {
        getPushSubscription()
        .then(subscription => fetch(`/api/project/${this.project}/unregister`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscription,
            }),
        }))
        .then(() => {
            this.buttonText = notifyText;
            this.subscribed = false;
        })
        .catch((e) => {
            this.buttonText = errorMsg;
        })
    }
  
    clickHandler() {
        getPushSubscription()
        .then(subscription => {
            if (!subscription || !this.subscribed) {
                return this.subscribe();
            }
            return this.unsubscribe();
        });
    }
}

window.customElements.define('push-notification-button', PushNotificationButton);
