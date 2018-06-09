import * as functions from 'firebase-functions';
import express from 'express';

import {SpfHandler} from './spfHandler';
import {ReceiveHandler} from './receiveHandler';

const app = express();

app.post('/api/inbound-email-authorize', SpfHandler);
app.post('/api/inbound-email', ReceiveHandler);

export const EmailHandler = functions.https.onRequest(app);