import * as functions from 'firebase-functions';

import {admin} from '../firebase';

export const RegisterForPush = functions.https.onRequest(async (req, res) => {
    const project = req.query.project;
    if (!project) {
        return res.sendStatus(401);
    }

    const {token} = req.body;
    if (!token) {
        return res.sendStatus(403);
    }

    try {
        const response = await admin.messaging().subscribeToTopic(token, project);
        return res.sendStatus(200);
    } catch(e) {
        console.log(e);
        return res.sendStatus(500);
    }
});

export const UnregisterFromPush = functions.https.onRequest(async (req, res) => {
    const project = req.query.project;
    if (!project) {
        return res.sendStatus(401);
    }

    const {token} = req.body;
    if (!token) {
        return res.sendStatus(403);
    }

    try {
        const response = await admin.messaging().unsubscribeFromTopic(token, project);
        return res.sendStatus(200);
    } catch(e) {
        console.log(e);
        console.log(token);
        return res.sendStatus(500);
    }
});