/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

// if (process.env.BROWSER) {
//   throw new Error(
//     'Do not import `config.js` from inside the client-side code.',
//   );
// }

import * as functions from 'firebase-functions';

export default {
  // Node.js app
  port: process.env.PORT || 3000,

  // https://expressjs.com/en/guide/behind-proxies.html
  trustProxy: process.env.TRUST_PROXY || 'loopback',

  // Strist transport security
  strictTransportSecurity: process.env.STRICT_TRANSPORT_SECURITY,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
  },

  // Database
  databaseUrl: process.env.DATABASE_URL || 'sqlite:database.sqlite',

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
    applicationInsightsKey: process.env.APPLICATION_INSIGHTS_KEY,
  },

  // Authentication
  auth: {
    jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },

    // https://developers.facebook.com/
    facebook: {
      id: process.env.FACEBOOK_APP_ID || '186244551745631',
      secret:
        process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc',
    },

    // https://cloud.google.com/console/project
    google: {
      id:
        process.env.GOOGLE_CLIENT_ID ||
        '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
      secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
    },

    // https://apps.twitter.com/
    twitter: {
      key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
      secret:
        process.env.TWITTER_CONSUMER_SECRET ||
        'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
    },
  },

  webPush: {
    privateKey: functions.config().vapid ? functions.config().vapid.private_key : 'Dm92rAVXyVCdq8qEv9C5-ItDKC9NEAaHAbn5p6ZnyzY',
    publicKey: functions.config().vapid ? functions.config().vapid.public_key : 'BDcpUmAVHSCuC9B8xYGR8LE0fDYzXzGAXKAmHmuzPazWSup0Ow9ZVjrVY8zoyHpVKH3WWr0HFcEcgbRukTkQMm8',
  },
};
