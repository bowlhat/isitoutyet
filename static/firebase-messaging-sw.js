try {
    importScripts('https://www.gstatic.com/firebasejs/6.6.0/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/6.6.0/firebase-messaging.js');

    firebase.initializeApp({
        'messagingSenderId': '811381179583'
    });

    const messaging = firebase.messaging();
    messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[firebase-messaging] Received background message ', payload);
        var notificationTitle = payload.notification.title;
        var notificationOptions = {
            body: payload.notification.body,
            icon: payload.notification.icon || '/images/manifest/application/android-chrome-512x512.png'
        };
    
        return self.registration.showNotification(notificationTitle,
            notificationOptions);
    });
} catch(e) {}