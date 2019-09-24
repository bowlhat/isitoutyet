import firebase from "firebase";

import config from '../../firebase-config';

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const firestore = firebase.firestore();

export async function get(req, res, next) {
    const snapshot = await firestore.collection('projects').get();

    res.setHeader('Content-Type', 'application/json');
    return res.end(
        JSON.stringify(snapshot.docs.map(item => ({
            ...item.data(),
            slug: item.id,
        })))
    );
}
