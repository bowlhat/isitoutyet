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
import * as functions from 'firebase-functions';

export const ReceiveHandler = async (request, response) => {
  const XRegExp = await import('xregexp');
  const uuid = await import('uuid/v4');
  const {abortEmail, acceptEmail} = await import('./responders');
  
  const {firebaseFirestore} = await import('../../firebase');
  const firestore = firebaseFirestore();

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
  
  const noHeaders = 'No eMail Headers present message';
  
  let EMAIL_BASIC_AUTH = '';
  if (functions.config().emailhandler) {
    EMAIL_BASIC_AUTH = functions.config().emailhandler.basicauth || '';
  }
  const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;
  
  const projects = firestore.collection('projects');
  const emails = firestore.collection('emails');
  
  const transactionId = uuid();

  const match = CREDENTIALS_REGEXP.exec(request.headers.authorization || '');
  if (EMAIL_BASIC_AUTH && (!match || match[1] !== EMAIL_BASIC_AUTH)) {
    return abortEmail(transactionId, response)('Incorrect credentials');
  }
  
  const fields = request.body;

  if (!fields.headers) {
    return abortEmail(transactionId, response)(noHeaders);
  }

  let date = new Date();
  if (fields.headers.Date) {
    const dateparts = (fields.headers.Date).split(' ');
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

    date = new Date(
      parseInt(dateparts[3], 10),
      months.indexOf(dateparts[2]),
      parseInt(dateparts[1], 10),
      timeparts[0],
      timeparts[1],
      timeparts[2],
    );
  }

  const emailUUID = uuid();
  const email = emails.doc(emailUUID)
  try {
    await email.set({
      sentto: fields.headers.To || '',
      sentfrom: fields.headers.From || '',
      received: new Date(),
      subject: fields.headers.Subject || '',
      body: fields.plain || '',
    })

    if (!fields.headers) {
      throw noHeaders;
    }
    projects.where('toaddress', '==', fields.headers.To)
    .onSnapshot(async snapshot => {
      if (!fields.headers) {
        throw noHeaders;
      }
      for (const doc of snapshot.docs) {
        const project = doc.data();
        const re = XRegExp(project['regex'], 'i');
        if (fields.headers.Subject && re.test(fields.headers.Subject)) {
          const matches = XRegExp.exec(fields.headers.Subject, re);
  
          const version = matches['version'] || '';
          const tmpcode = matches['codename2'] || '';
          const codename = matches['codename'] || tmpcode;
          const islts = !!(matches['lts'] && matches['lts'].indexOf('LTS') > -1);
          const beta = matches['betatext'] || '';
          const rc = matches['rctext'] || '';
          const preRelInfo =  `${beta} ${rc}`.trim();

          const releaseUUID = uuid();

          const releases = doc.ref.collection('releases');

          await releases
          await releases.doc(releaseUUID).set({
            date,
            version,
            islts,
            codename,
            beta: preRelInfo,
            email: email,
          });
        }
      }
    });

    acceptEmail(transactionId, response, fields)
  } catch(e) {
    console.log('Receive Email: Error encountered:', e);
    if (!response.headersSent) {
      abortEmail(transactionId, response)(e);
    }
  };
};