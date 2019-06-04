import firebase from '@firebase/app';
import { FirebaseFirestore } from '@firebase/firestore-types';
import { FirebaseMessaging } from '@firebase/messaging-types';
import { User } from '@firebase/auth-types';

import '@firebase/auth';
import '@firebase/firestore';
import '@firebase/messaging';

import { store } from './store';
import { setUser } from './actions/user';

const config = {
    apiKey: "AIzaSyA9TmyHbDvYCy9AJT3p-uh5D0xLPX8OHPI",
    authDomain: "iioy-191b9.firebaseapp.com",
    databaseURL: "https://iioy-191b9.firebaseio.com",
    projectId: "iioy-191b9",
    storageBucket: "iioy-191b9.appspot.com",
    messagingSenderId: "811381179583"
};
firebase.initializeApp(config);

if (firebase.auth) {
    firebase.auth().onAuthStateChanged((user: User | null) => store.dispatch(setUser(user)));
}

let firestore: FirebaseFirestore;
if (firebase.firestore) {
    firestore = firebase.firestore();
}
const messaging: FirebaseMessaging = firebase.messaging();

export {firestore, messaging};
