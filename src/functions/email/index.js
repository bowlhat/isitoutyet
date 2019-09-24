import * as functions from 'firebase-functions';

import {SpfHandler} from './spfHandler';
import {ReceiveHandler} from './receiveHandler';

export const EmailReceiveHandler = functions.https.onRequest(ReceiveHandler);
export const EmailSPFHandler = functions.https.onRequest(SpfHandler);