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
import {admin, functions, firestore} from '../firebase';
import { abortEmail, acceptEmail } from './responders';
import { Request, Response } from 'firebase-functions';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

let EMAIL_BASIC_AUTH = '';
if (functions.config().emailhandler) {
  EMAIL_BASIC_AUTH = functions.config().emailhandler.basicauth || '';
}
const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;

let FCM_PRIVATE_KEY = '';
if (functions.config().webpush) {
  FCM_PRIVATE_KEY = functions.config().webpush.fcmprivatekey || '';
}

const projects = firestore.collection('projects');
const emails = firestore.collection('emails');

export const ReceiveHandler = (req: Request, res: Response) => {
  const transactionId = uuid();

  const match = CREDENTIALS_REGEXP.exec(req.headers.authorization || '');
  if (EMAIL_BASIC_AUTH && (!match || match[1] !== EMAIL_BASIC_AUTH)) {
    return abortEmail(transactionId, res)('Incorrect credentials');
  }
  
  const fields = req.body;
  const dateparts = (fields.headers['Date'] as string).split(' ');
  const timeparts = dateparts[4].split(':').map(part => parseInt(part, 10));

  if (dateparts[5]) {
    const offsetDirection = dateparts[5].substr(0, 1);
    let offsetHours = parseInt(dateparts[5].substr(1, 2), 10);
    let offsetMinutes = parseInt(dateparts[5].substr(3, 2), 10);
    if (offsetDirection === '+') {
      offsetHours = -offsetHours;
      offsetMinutes = -offsetMinutes;
    }
    timeparts[0] += offsetHours;
    timeparts[1] += offsetMinutes;
  }

  const date = new Date(
    parseInt(dateparts[3], 10),
    months.indexOf(dateparts[2]),
    parseInt(dateparts[1], 10),
    timeparts[0],
    timeparts[1],
    timeparts[2],
  );

  const emailUUID = uuid();
  emails.doc(emailUUID).set({
    sentto: fields.headers['To'],
    sentfrom: fields.headers['From'],
    received: new Date(),
    subject: fields.headers['Subject'],
    body: fields.plain,
  })
  .then(() => {
    projects.where('toaddress', '==', fields.headers['To'])
    .onSnapshot(snapshot => {
      for (const doc of snapshot.docs) {
        const project = doc.data();
        const re = XRegExp(project['regex'], 'i');
        if (re.test(fields.haders['Subject'] as string)) {
          const matches = XRegExp.exec(fields.headers['Subject'] as string, re);
  
          const version = matches['version'] || '';
          const tmpcode = matches['codename2'] || '';
          const codename = matches['codename'] || tmpcode;
          const islts = matches['lts'] && matches['lts'].indexOf('LTS') > -1;
          const beta = matches['betatext'] || '';
          const rc = matches['rctext'] || '';
          const preRelInfo =  `${beta} ${rc}`.trim();

          const releaseUUID = uuid();

          return projects.doc(project.ref).collection('releases').doc(releaseUUID).set({
            date,
            version,
            islts,
            codename,
            beta: preRelInfo,
            email: emails.doc(emailUUID),
          }).then(() => {
            const name = `
              ${project['name']
              }${version && ` ${version}`
              }${codename && ` ${codename}`
              }${islts && ' LTS'
              }${preRelInfo && ` ${preRelInfo}`
              }
            `.trim();

            const body = `${name} has just been released!`;
            const icon = project['logo'];

            admin.messaging().send({
              topic: project['slug'],
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
            }).then(response => {
              console.log('Receive email: Successfully sent push message:', response);
            }).catch(e => {
              console.log('Receive email: Error sending push message:', e);
            });
          });
        }
      }
    });
  })
  .then(acceptEmail(transactionId, res, fields))
  .catch(e => {
    console.log('Receive Email: Error encountered:', e);
    if (!res.headersSent) {
      abortEmail(transactionId, res)(e);
    }
  });
};