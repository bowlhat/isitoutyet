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

// import * as formidable from 'formidable';
import XRegExp from 'xregexp';
import uuid from 'uuid/v4';
// import webPush from 'web-push';
import {admin, functions} from '../firebase';
import { Project, Release, Email, ReleaseEmail, PushSubscription } from '../data/models';
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

  Project.findOne({
    where: { toaddress: fields.headers['To'] },
  }).then(project => {
    const emailData = {
      sentto: fields.headers['To'],
      sentfrom: fields.headers['From'],
      received: new Date(),
      subject: fields.headers['Subject'],
      body: fields.plain,
    };

    if (project) {
      const re = XRegExp(project['regex'], 'i');
      if (re.test(fields.haders['Subject'] as string)) {
        const matches = XRegExp.exec(fields.headers['Subject'] as string, re);

        const version = matches['version'] || '';
        const tmpcode = matches['codename2'] || '';
        const codename = matches['codename'] || tmpcode;
        const isLTS = matches['lts'] && matches['lts'].indexOf('LTS') > -1;
        const beta = matches['betatext'] || '';
        const rc = matches['rctext'] || '';
        const preRelInfo =  `${beta} ${rc}`.trim();

        return Release.create(
          {
            email: emailData,
            date,
            version,
            codename,
            islts: isLTS,
            beta: preRelInfo,
          },
          {
            include: [
              {
                association: ReleaseEmail,
              },
            ],
          },
        ).then(release => {
          if (release) {
            project['addRelease'](release);

            const projectName = `
              ${project['name']
              }${version && ` ${version}`
              }${codename && ` ${codename}`
              }${isLTS && ' LTS'
              }${preRelInfo && ` ${preRelInfo}`
              }
            `.trim();

            const body = `${projectName} has just been released!`;
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
                  clickAction: `https://isitoutyet.info/project/${project['slug']}/${release['id']}`,
                  icon,
                },
              },
            }).then(response => {
              console.log('Receive email: Successfully sent push message:', response);
            }).catch(e => {
              console.log('Receive email: Error sending push message:', e);
            })
          }
        })
        .then(acceptEmail(transactionId, res, fields))
        .catch(e => {
          console.log('Receive email: Error saving release:', e);
          abortEmail(transactionId, res)(e);
        });
      }
    }

    // if we get here then we didn't match a project for the email.
    // let's save it anyway in case we get complaints about missing data
    Email.create(emailData)
    .then(acceptEmail(transactionId, res, fields));
  }).catch(e => {
    console.log(`Receive Email: Error encountered: `, e);
    if (!res.headersSent) {
      abortEmail(transactionId, res)(e);
    }
  });
};