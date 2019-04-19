/**
 * Copyright 2018 Daniel Llewellyn T/A Bowl Hat.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import XRegExp from 'xregexp';
import uuid from 'uuid/v4';
import { admin, functions, firestore } from '../firebase';
import { abortEmail, acceptEmail } from './responders';
import { Request, Response } from 'firebase-functions';
import { Fields } from './Fields';
import { extractDate } from './date';

const noHeaders: string = 'No email Headers present in message';

let EMAIL_BASIC_AUTH: string = '';
if (functions.config().emailhandler) {
  EMAIL_BASIC_AUTH = functions.config().emailhandler.basicauth || '';
}
const CREDENTIALS_REGEXP: RegExp = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;

let FCM_PRIVATE_KEY: string = '';
if (functions.config().webpush) {
  FCM_PRIVATE_KEY = functions.config().webpush.fcmprivatekey || '';
}

const projects = firestore.collection('projects');
const emails = firestore.collection('emails');

const ReceiveHandler = async (request: Request, response: Response) => {
  const transactionId: string = uuid();

  const match = CREDENTIALS_REGEXP.exec(request.headers.authorization || '');
  if (EMAIL_BASIC_AUTH && (!match || match[1] !== EMAIL_BASIC_AUTH)) {
    return abortEmail(transactionId, response)('Incorrect credentials');
  }
  
  const fields: Fields = request.body;

  if (!fields.headers) {
    return abortEmail(transactionId, response)(noHeaders);
  }

  let date: Date = new Date();
  if (fields.headers.Date) {
    date = extractDate(fields.headers.Date);
  }

  const emailUUID: string = uuid();
  const email = emails.doc(emailUUID)

  try {
    await email.set({
      sentto: fields.headers.To || '',
      sentfrom: fields.headers.From || '',
      received: new Date(),
      subject: fields.headers.Subject || '',
      body: fields.plain || '',
    })

    projects.where('toaddress', '==', fields.headers.To)
    .onSnapshot(async snapshot => {
      if (!fields.headers) {
        throw noHeaders;
      }

      for (const doc of snapshot.docs) {
        const project = doc.data();
        // const re: RegExp = XRegExp(project['regex'], 'i');
        // if (fields.headers.Subject && re.test(fields.headers.Subject)) {
        //   const matches: RegExpExecArray = XRegExp.exec(fields.headers.Subject, re);

        //   const version: string = matches['version'] || '';
        //   const tmpcode: string = matches['codename2'] || '';
        //   const codename: string = matches['codename'] || tmpcode;
        //   const islts: Boolean = !!(matches['lts'] && matches['lts'].indexOf('LTS') > -1);
        //   const beta: string = matches['betatext'] || '';
        //   const rc: string = matches['rctext'] || '';
        //   const preRelInfo: string =  `${beta} ${rc}`.trim();



        
        // TODO: do AI test

          const releaseUUID: string = uuid();

          const releases = doc.ref.collection('releases');
          
          try {
            await releases.doc(releaseUUID).set({
              date,
              // version,
              // islts,
              // codename,
              // beta: preRelInfo,
              email: email,
            })

            // const name: string = `${project['name']}${version && ` ${version}`}${codename && ` ${codename}`}${islts && ' LTS'}${preRelInfo && ` ${preRelInfo}`}`.trim();
            const name: string = project['name'];
            const body: string = `${name} has just been released!`;
            const icon: string = project['logo'];

            const response: string = await admin.messaging().send({
              topic: doc.id,
              notification: {
                title: 'Is it out yet? Yes it is!',
                body,
              },
              // android: {
              //   collapseKey: 'newRelease',
              //   notification: {
              //     clickAction: '',
              //     icon,
              //   },
              // },
              webpush: {
                notification: {
                  clickAction: `https://isitoutyet.info/project/${project['slug']}/${releaseUUID}`,
                  icon,
                },
              },
            });
            console.log('Receive email: Successfully sent push message:', response);
          } catch (e) {
            console.log('Receive Email: Error sending push message:', e);
          }
        // }
      };
    });
    acceptEmail(transactionId, response, fields)
  } catch (e) {
    console.log('Receive Email: Error encountered:', e);
    if (!response.headersSent) {
      abortEmail(transactionId, response)(e);
    }
  }
};

export { ReceiveHandler };