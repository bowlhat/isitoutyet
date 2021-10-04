import * as sapper from '@sapper/app';
import {firebaseMessaging} from './firebase.js';

const dev = process.env.NODE_ENV === 'development'

if (process.env.NODE_ENV === 'development') {
	db.settings({host: 'localhost:8081', ssl: false});
}
let messaging = firebaseMessaging();
messaging.usePublicVapidKey('BOa9ae5yjtELFjAZleIjNlbq55F5a1vKpTseJXK073AIanjq2QAznwuxSUDWU3fm4a4KM6GQ7hFiMiA9dSUmwN8');
messaging.onTokenRefresh(() => {
    messaging.getToken().then((token) => {
		console.log('[firebase-messaging] Token refreshed.');
		if (token) {
			fetch(`/api/push/update-registration`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			});
		}
    }).catch((err) => {
		console.log('[firebase-messaging] Unable to retrieve refreshed token ', err);
    });
});

sapper.start({
	target: document.querySelector('#sapper')
});