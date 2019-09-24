import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/messaging";

import config from './firebase-config';

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const firestore = firebase.firestore();
let messaging;
if (process.browser === true) {
    messaging = firebase.messaging();
}

export { firebase, firestore, messaging };
