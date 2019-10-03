import * as functions from 'firebase-functions';

export * from './talkies';
export * from './email';
export * from './push';

export const PopulateEmulatorDb = functions.https.onRequest(async (req, res) => {
    if (process.env.IIOY_DEV === 'true') {
        let {firebaseFirestore} = await import('../firebase')
        let populateEmulatorDb = await import('./populate-emulator-db');
        populateEmulatorDb.default(await firebaseFirestore());
        return res.sendStatus(200)
    }
    return res.sendStatus(403)
})
