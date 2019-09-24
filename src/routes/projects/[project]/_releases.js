import {getProject} from './_project.js';

import firebase from "firebase";

import config from '../../../firebase-config';

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const firestore = firebase.firestore();

/**
 * 
 * @param {string} slug 
 * @returns {firebase.firestore.Query}
 */
export function getReleasesFor(slug) {
    return getProject(slug)
        .collection('releases')
        .orderBy('date', 'desc')
}

/**
 * 
 * @param {string} id 
 * @returns {firebase.firestore.DocumentReference}
 */
export function getReleaseFor(slug, id) {
    return getProject(slug)
        .collection('releases')
        .doc(id);
}