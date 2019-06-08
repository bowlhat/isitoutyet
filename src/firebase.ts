// import firebase from '@firebase/app';
import { FirebaseFirestore } from '@firebase/firestore-types';
import { FirebaseMessaging } from '@firebase/messaging-types';
import { User, FirebaseAuth } from '@firebase/auth-types';

// import '@firebase/auth';
// import '@firebase/firestore';
// import '@firebase/messaging';

declare global {
    interface Window {
        firebase: any;
    }
}

import { store } from './store';
import { setUser } from './actions/user';

const firebase = window.firebase;
const config = {
    apiKey: "AIzaSyA9TmyHbDvYCy9AJT3p-uh5D0xLPX8OHPI",
    authDomain: "iioy-191b9.firebaseapp.com",
    databaseURL: "https://iioy-191b9.firebaseio.com",
    projectId: "iioy-191b9",
    storageBucket: "iioy-191b9.appspot.com",
    messagingSenderId: "811381179583"
};
firebase.initializeApp(config);

let auth: FirebaseAuth;
if (firebase.auth) {
    auth = firebase.auth();
    auth.onAuthStateChanged((user: User | null) => store.dispatch(setUser(user)));
}

let firestore: FirebaseFirestore;
if (firebase.firestore) {
    firestore = firebase.firestore();
}
const messaging: FirebaseMessaging = firebase.messaging();

export { firebase, firestore, messaging, auth };
