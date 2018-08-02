import * as functions from 'firebase-functions';
import {DialogFlow} from './dialogflow';
import {versionForProject} from './common';

export const DialogflowHandler = functions.https.onRequest(DialogFlow);

export const TalkieAPIHandler = functions.https.onRequest((req, res) => {
    let project = req.query.project || '';
    let version = req.query.version || '';

    project = project.trim();
    version = version.trim();

    return versionForProject(project, version)
        .then(reply => res.send(reply))
        .catch(() => res.status(500).send('error'));
});