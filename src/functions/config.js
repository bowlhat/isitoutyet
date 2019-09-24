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
  webPush: {
    privateKey: functions.config().vapid ? functions.config().vapid.private_key : 'Dm92rAVXyVCdq8qEv9C5-ItDKC9NEAaHAbn5p6ZnyzY',
    publicKey: functions.config().vapid ? functions.config().vapid.public_key : 'BDcpUmAVHSCuC9B8xYGR8LE0fDYzXzGAXKAmHmuzPazWSup0Ow9ZVjrVY8zoyHpVKH3WWr0HFcEcgbRukTkQMm8',
  },
};
