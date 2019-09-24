import firebase from "firebase";

import config from '../../../firebase-config';

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const firestore = firebase.firestore();

/**
 * 
 * @param {string} slug 
 * @returns {firebase.firestore.DocumentReference}
 */
export function getProject(slug) {
    return firestore
        .collection('projects')
        .doc(slug)
}