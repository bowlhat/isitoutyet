import * as functions from 'firebase-functions';
import webPush from 'web-push';
import config from '../config';

let privateKey = 'Dm92rAVXyVCdq8qEv9C5-ItDKC9NEAaHAbn5p6ZnyzY';
let publicKey = 'BDcpUmAVHSCuC9B8xYGR8LE0fDYzXzGAXKAmHmuzPazWSup0Ow9ZVjrVY8zoyHpVKH3WWr0HFcEcgbRukTkQMm8';
if (functions.config().vapid) {
  privateKey = functions.config().vapid.private_key;
  publicKey = functions.config().vapid.public_key;
}

if (config.webPush.publicKey && config.webPush.privateKey) {
  webPush.setVapidDetails(
    'https://isitoutyet.info/',
    publicKey,
    privateKey,
  );
}

export const VapidKey = (req, res) => {
  res.send(publicKey);
}
