import * as functions from 'firebase-functions';

export const RegisterForPush = functions
    .runWith({timeoutSeconds: 5, memory: '128MB'})
    .https
    .onRequest(async (req, res) => {
        const {firebase} = await import('../../firebase');
        const admin = firebase();

        const project = req.query.project;
        if (!project) {
            return res.sendStatus(401);
        }

        const {token} = req.body;
        if (!token) {
            return res.sendStatus(403);
        }

        try {
            const response = await admin.messaging().subscribeToTopic(token, project);
            return res.sendStatus(200);
        } catch(e) {
            console.log(e);
            return res.sendStatus(500);
        }
    });

export const UnregisterFromPush = functions
    .runWith({timeoutSeconds: 5, memory: '128MB'})
    .https
    .onRequest(async (req, res) => {
        const {firebase} = await import('../../firebase');
        const admin = firebase();

        const project = req.query.project;
        if (!project) {
            return res.sendStatus(401);
        }

        const {token} = req.body;
        if (!token) {
            return res.sendStatus(403);
        }

        try {
            const response = await admin.messaging().unsubscribeFromTopic(token, project);
            return res.sendStatus(200);
        } catch(e) {
            console.log(e);
            console.log(token);
            return res.sendStatus(500);
        }
    });

export const SendReleaseMessage = functions
    .runWith({timeoutSeconds: 10, memory: '128MB'})
    .firestore
    .document('projects/{project}/releases/{releaseId}')
    .onCreate(async snapshot => {
        const {firebase} = await import('../../firebase');
        const admin = firebase();
    
        const projectSnapshot = await snapshot.ref.parent.parent.get();
        const project = projectSnapshot.data();
        const release = snapshot.data();

        let name = project.name +
            (release.version ? ' ' + release.version : '') + 
            (release.codename ? ' ' + release.codename : '') +
            (release.islts ? ' LTS' : '') +
            (release.beta ? ' ' + release.beta : '');
        name = name.trim();

        const icon = project.logo;
        const payload = {
            topic: projectSnapshot.id,
            notification: {
                title: 'Is it out yet? Yes it is!',
                body: `${name} has just been released!`,
            },
            android: {
              collapseKey: 'newRelease',
              notification: {
            //     clickAction: '',
                icon,
              },
            },
            webpush: {
                notification: {
                    clickAction: `https://isitoutyet.info/project/${projectSnapshot.id}/${snapshot.id}`,
                    icon,
                },
            },
        };

        console.log(`Sending push message for '${name}' to channel '${projectSnapshot.id}'`);
        return admin.messaging().send(payload);
    });