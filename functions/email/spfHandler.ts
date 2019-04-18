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

import uuid from 'uuid/v4';
import * as functions from 'firebase-functions';
import { Request, Response } from 'firebase-functions';

import { abortEmail, rejectEmail, authorizeEmail } from './responders';
import { Fields } from './Fields';

let EMAIL_BASIC_AUTH = '';
if (functions.config().emailhandler) {
  EMAIL_BASIC_AUTH = functions.config().emailhandler.basicauth || '';
}
const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;

export const SpfHandler = (request: Request, response: Response) => {
  const transactionId = uuid();

  const fields: Fields = request.body;

  const match = CREDENTIALS_REGEXP.exec(request.headers.authorization || '');
  if (EMAIL_BASIC_AUTH && (!match || match[1] !== EMAIL_BASIC_AUTH)) {
    return abortEmail(transactionId, response)('Incorrect credentials');
  }

  if (!fields.spf || !fields.spf.result || !fields.spf.domain) {
    return abortEmail(transactionId, response)('SPF Error');
  }

  const spfResult = fields.spf.result || 'temperror';
  const spfDomain = fields.spf.domain || '';

  if (spfResult === 'temperror' || spfResult === 'permerror') {
    return abortEmail(transactionId, response)(
      new Error(`SPF Error for '${spfDomain}': ${spfResult}`),
    );
  }

  if (spfResult === 'fail') {
    return rejectEmail(transactionId, response, fields)();
  }

  if (
    spfResult === 'softfail' ||
    spfResult === 'neutral' ||
    spfResult === 'none'
  ) {
    // maybe check for spam?
  }

  return authorizeEmail(transactionId, response, fields)();
};