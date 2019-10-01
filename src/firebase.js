// import firebase from "firebase/app";
// import "firebase/firestore";
// import "firebase/messaging";

import {firebaseConfig} from './firebase-config';

// const firestore = firebase.firestore();
// let messaging;
// if (process.browser === true) {
//     messaging = firebase.messaging();
// }

// export { firebase, firestore, messaging };
export async function firestore() {
    if (process.browser) {
        return window.db
    } else {
        const firebase = await import('firebase')
        if (firebase.apps.length == 0) {
            let app = firebase.initializeApp(firebaseConfig)
            return app.firestore()
        } else {
            return firebase.apps[0].firestore()
        }
    }
}
export async function messaging() {
    if (process.browser) {
        return window.messaging
    } else {
        const firebase = await import('firebase')
        if (firebase.apps.length == 0) {
            let app = firebase.initializeApp(firebaseConfig)
            return app.messaging()
        } else {
            return firebase.apps[0].messaging()
        }
    }
}