import * as functions from 'firebase-functions';

import {SpfHandler} from './spfHandler';
import {ReceiveHandler} from './receiveHandler';

export const EmailReceiveHandler = functions
    .runWith({timeoutSeconds: 5, memory: '128MB'})
    .https.onRequest(ReceiveHandler);
export const EmailSPFHandler = functions
    .runWith({timeoutSeconds: 5, memory: '128MB'})
    .https.onRequest(SpfHandler);
