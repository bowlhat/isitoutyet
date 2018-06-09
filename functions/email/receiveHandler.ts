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

import formidable from 'formidable';
import XRegExp from 'xregexp';
import uuid from 'uuid/v4';
import webPush from 'web-push';

import { Project, Release, Email, ReleaseEmail, PushSubscription } from '../data/models';
import { abortEmail, acceptEmail } from './responders';

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

const EMAIL_BASIC_AUTH = process.env.EMAIL_BASIC_AUTH || '';
const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;

export const ReceiveHandler = (request, response) => {
  const transactionId = uuid();
  const form = new formidable.IncomingForm();

  form.parse(request, async (err, fields) => {
    if (err) {
      return abortEmail(transactionId, response)(err);
    }

    const match = CREDENTIALS_REGEXP.exec(request.headers.authorization);
    if (
      process.env.NODE_ENV === 'development' ||
      !match ||
      match[1] !== EMAIL_BASIC_AUTH
    ) {
      return abortEmail(transactionId, response)('Incorrect credentials');
    }

    acceptEmail(transactionId, response, fields)();

    try {
      const dateparts = (fields['headers[Date]'] as string).split(' ');
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

      const project = await Project.findOne({
        where: { toaddress: fields['headers[To]'] },
      });

      const emailData = {
        sentto: fields['headers[To]'],
        sentfrom: fields['headers[From]'],
        subject: fields['headers[Subject]'],
        body: fields.plain,
      };

      if (project) {
        const re = XRegExp(project['regex'], 'i');

        if (re.test(fields['headers[Subject]'] as string)) {
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
          acceptEmail(transactionId, response, fields)();
          const subscriptions = await PushSubscription.findAll({
            where: {
              projectId: project['id'],
            },
          });

          const text = `${project['name']} ${
            release['version']
          } has just been released!`;

          const doNotification = () => {
            const sub = subscriptions.shift();
            if (sub === undefined) {
              return;
            }

            webPush
              .sendNotification(JSON.parse(sub['subscription']), text, {})
              .then(doNotification)
              .catch(doNotification);
          };
        }
      }

      // if we get here then we didn't match a project for the email.
      // let's save it anyway in case we get complaints about missing data
      Email.create({
        sentto: fields['headers[To]'],
        sentfrom: fields['headers[From]'],
        subject: fields['headers[Subject]'],
        received: new Date(),
        body: fields.plain,
      });
      return null;
    } catch (e) {
      return abortEmail(transactionId, response)(e);
    }
  });
};