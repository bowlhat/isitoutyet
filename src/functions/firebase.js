import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase || import('../firebase-config.js'));

const firestore = admin.firestore();

export {admin, functions, firestore};
