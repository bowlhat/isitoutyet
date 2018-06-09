import * as functions from 'firebase-functions';
import express from 'express';

import {Alexa} from './alexa';
import {DialogFlow} from './dialogflow';

const app = express();

Alexa(app);
app.post('/api/talkies/latest-version', DialogFlow); // old endpoint
app.post('/api/talkies/dialogflow', DialogFlow);

export const TalkieHandler = functions.https.onRequest(app);