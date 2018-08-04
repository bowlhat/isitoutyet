// import GraphClient from '../data/graphql';
// import {queries} from '../data/queries';

// const graphQLOptions = {
//     url: '/api/graphql',
// };
// const client = new GraphClient(graphQLOptions);

import {firestore} from '../firebase';

export const GET_ALL_RELEASES = 'GET_ALL_RELEASES';
export const GET_RELEASE = 'GET_RELEASE';

export const getAllReleases = (projectId) => (dispatch, getState) => {
    firestore
        .collection('projects')
        .doc(projectId)
        .collection('releases')
        .orderBy('date', 'desc')
        .get()
    .then(snapshot => {
        dispatch({
            type: GET_ALL_RELEASES,
            releases: snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id,
                };
            })
        });
    }).catch(e => {
        console.log('Error fetching all releases:', e);
        dispatch({
            type: GET_ALL_RELEASES,
            releases: []
        });
    });
}

export const getRelease = (projectId, releaseId) => (dispatch, getState) => {
    firestore
        .collection('projects')
        .doc(projectId)
        .collection('releases')
        .doc(releaseId)
        .get()
    .then(snapshot => {
        const release = snapshot.data();
        return Promise.resolve()
        .then(() => {
            if (release.email) {
                return firestore.doc(release.email.path).get();
            }
            return null;
        })
        .then(doc => {
            let email = {};
            if (doc) {
                email = doc.data();
            }

            dispatch({
                type: GET_RELEASE,
                release: {
                    ...release,
                    id: snapshot.id,
                    email,
                },
            });
        });
    }).catch(e => {
        console.log('Error fetching release:', e);
        dispatch({
            type: GET_RELEASE,
            release: null
        });
    });
}