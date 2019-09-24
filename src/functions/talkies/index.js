import * as functions from 'firebase-functions';
import {DialogFlow} from './dialogflow';
import {versionForProject} from './common';

export const DialogflowHandler = functions.https.onRequest(DialogFlow);

export const TalkieAPIHandler = functions.https.onRequest(async (req, res) => {
    let project = req.query.project || '';
    let version = req.query.version || '';

    project = project.trim();
    version = version.trim();

    try {
        const reply = await versionForProject(project, version);
        return res.send(reply);
    }
    catch (e) {
        return res.status(500).send('error');
    }
});