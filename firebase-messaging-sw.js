importScripts('/__/firebase/5.6.0/firebase-app.js');
importScripts('/__/firebase/5.6.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    var notificationTitle = payload.notification.title;
    var notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon || '/images/manifest/application/android-chrome-512x512.png'
    };
  
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
