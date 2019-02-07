import {messaging} from './firebase';

messaging.usePublicVapidKey('BOa9ae5yjtELFjAZleIjNlbq55F5a1vKpTseJXK073AIanjq2QAznwuxSUDWU3fm4a4KM6GQ7hFiMiA9dSUmwN8');
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => messaging.useServiceWorker(registration));
}

messaging.onTokenRefresh(() => {
    messaging.getToken().then(() => {
        // sendPushTokenToServer(refreshedToken);
    }).catch((err: Error) => {
        console.log('Unable to refresh push notification token:', err);
    });
});

messaging.onMessage((payload: string) => {
    console.log('Message received:', payload);
});

export {messaging};
