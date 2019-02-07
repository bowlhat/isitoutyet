/// <reference types="firebase" />

declare global {
    interface Window {
        firebase: any;
    }
}

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

const firestore = firebase.firestore();
const messaging = firebase.messaging();

export {firestore, messaging};
