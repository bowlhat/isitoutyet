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

import { withId, log } from './logger';

const extractFields = (fields) => {
  let to = '';
  let from = '';
  let subject = '';
  let spf = '';

  const subjectUndef = '[Subject not defined]';

  if (fields.headers) {
    to = fields.headers.To || '';
    from = fields.headers.From || '';
    subject = fields.headers.Subject || '';
  } else {
    to = fields.to || fields['headers[To]'] || fields['envelope[to]'] || '';
    from = fields.from || fields['headers[From]'] || fields['envelope[from]'] || '';
    subject = fields['headers[Subject]'] || subjectUndef;
  }
  if (fields.spf) {
    spf = fields.spf.result || '';
  } else {
    spf = fields['spf[result]'] || '';
  }

  return { to, from, subject, spf };
};

const abortEmail = (transactionId, response) => {
  const message = ((err instanceof Error) ? err.message : err) || 'Unknown Error';
  log('error')(withId(transactionId)(message));
  response
    .status(500)
    .send(
      `Error processing your email. If you need support, quote transaction ID '${transactionId}' when contacting us.`,
    );
};

const rejectEmail = (transactionId, response, fields) => {
  const { to, from, subject } = extractFields(fields);

  return () => {
    const message = `Reject email from: '${from}' to: '${to}' with subject: '${subject}'`;
    log('info')(withId(transactionId)(message));
    response
      .status(403)
      .send(
        `Error: You are not authorized. If you need support, quote transaction ID '${transactionId}' when contacting us.`,
      );
  };
};

const acceptEmail = (transactionId, response, fields) => {
  const { to, from, subject } = extractFields(fields);

  return () => {
    const message = `Accept email from: '${from}' to: '${to}' with subject: '${subject}'`;
    log('info')(withId(transactionId)(message));
    response
      .status(200)
      .send(`Successfully delivered email. Transaction ID: '${transactionId}'`);
  };
};

const authorizeEmail = (transactionId, response, fields) => {
  const { to, from, spf } = extractFields(fields);

  return () => {
    const message = `Authorize email from: '${from}' to: '${to}' with SPF status: '${spf}'`;
    log('info')(withId(transactionId)(message));
    response
      .status(200)
      .send(
        `Email authorized for delivery. Transaction ID: '${transactionId}'`,
      );
  };
};

export { abortEmail, rejectEmail, acceptEmail, authorizeEmail };
