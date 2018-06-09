import * as functions from 'firebase-functions';
import express from 'express';

import {RegisterPushNotification} from './register';
import {UnRegisterPushNotification} from './unregister';
import {VapidKey} from './vapidKey';

const app = express();

app.get('/api/vapidPublicKey', VapidKey);
app.post('/api/project/:project/register', RegisterPushNotification);
app.post('/api/project/:project/unregister', UnRegisterPushNotification);

export const WebPushHandler = functions.https.onRequest(app);