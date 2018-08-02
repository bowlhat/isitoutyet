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
import webPush from 'web-push';
import * as functions from 'firebase-functions';

import sequelize from '../data/sequelize';
import { Project, Release, Email, ReleaseEmail, PushSubscription } from '../data/models';
import { abortEmail, acceptEmail } from './responders';
import { Request, Response } from 'firebase-functions';

// function formidablePromise (req) {
//   return new Promise<{fields: formidable.Fields, files: formidable.Files}>(function (resolve, reject) {
//     var form = new formidable.IncomingForm()
//     form.parse(req, function (err, fields, files) {
//       if (err) return reject(err)
//       resolve({ fields: fields, files: files })
//     })
//   })
// }

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

export const ReceiveHandler = async (request: Request, response: Response) => {
  const transactionId = uuid();
  console.log('function start');

  try {
    const match = CREDENTIALS_REGEXP.exec(request.headers.authorization || '');
    if (EMAIL_BASIC_AUTH && (!match || match[1] !== EMAIL_BASIC_AUTH)) {
      return abortEmail(transactionId, response)('Incorrect credentials');
    }
    console.log('auth accepted')
    
    const fields = request.body;
    const dateparts = (fields.headers.Date as string).split(' ');
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
    console.log('extracted date')

    const date = new Date(
      parseInt(dateparts[3], 10),
      months.indexOf(dateparts[2]),
      parseInt(dateparts[1], 10),
      timeparts[0],
      timeparts[1],
      timeparts[2],
    );
    console.log('parsed date')

    const project = await Project.findOne({
      where: { toaddress: fields.headers.To },
    });
    console.log('found project');

    const emailData = {
      sentto: fields.headers.To,
      sentfrom: fields.headers.From,
      subject: fields.headers.Subject,
      body: fields.plain,
    };
    console.log('extracted email data')

    if (project) {
      console.log('have project')
      const re = XRegExp(project['regex'], 'i');
      console.log('build XRegExp')
      if (re.test(fields['headers[Subject]'] as string)) {
        console.log('matched subject')
        const matches = XRegExp.exec(fields['headers[Subject]'] as string, re);

        const version = matches['version'] || '';
        const tmpcode = matches['codename2'] || '';
        const codename = matches['codename'] || tmpcode;
        const isLTS = matches['lts'] && matches['lts'].indexOf('LTS') > -1;
        const beta = matches['betatext'] || '';
        const rc = matches['rctext'] || '';

        const release = await Release.create(
          {
            email: emailData,
            date,
            version,
            codename,
            islts: isLTS,
            beta: `${beta} ${rc}`,
          },
          {
            include: [
              {
                association: ReleaseEmail,
              },
            ],
          },
        );
        project['addRelease'](release);
        let subscriptions = await PushSubscription.findAll({
          where: {
            projectId: project['id'],
          },
        });

        const text = `
          ${project['name']} ${release['version']}
          has just been released!
        `;

        const doNotification = () => {
          const sub = subscriptions.shift();
          if (sub === undefined) {
            return;
          }

          webPush
            .sendNotification(JSON.parse(sub['subscription']), text, {})
            .then(() => { setTimeout(doNotification, 0); })
            .catch(() => { setTimeout(doNotification, 0); });
        };
        setTimeout(doNotification, 0);
      }
    }

    console.log('creating email')
    // if we get here then we didn't match a project for the email.
    // let's save it anyway in case we get complaints about missing data
    Email.create({
      sentto: fields['headers[To]'],
      sentfrom: fields['headers[From]'],
      subject: fields['headers[Subject]'],
      received: new Date(),
      body: fields.plain,
    });
    console.log('finished')
    return acceptEmail(transactionId, response, fields)();
  } catch (e) {
    console.log(`error encountered: ${e}`)
    if (!response.headersSent) {
      return abortEmail(transactionId, response)(e);
    }
  }
};