const messaging = firebase.messaging();
window.firebaseMessaging = messaging;

messaging.usePublicVapidKey('BOa9ae5yjtELFjAZleIjNlbq55F5a1vKpTseJXK073AIanjq2QAznwuxSUDWU3fm4a4KM6GQ7hFiMiA9dSUmwN8');
messaging.onTokenRefresh(() => {
    messaging.getToken().then(refreshedToken => {
        // sendPushTokenToServer(refreshedToken);
    }).catch(err => {
        console.log('Unable to refresh push notification token.');
    });
});

messaging.onMessage(payload => {
    console.log('Message received. ', payload);
});

export {messaging};
