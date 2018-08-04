// import GraphClient from '../data/graphql';
// import {queries} from '../data/queries';

// const graphQLOptions = {
//     url: '/api/graphql',
// };
// const client = new GraphClient(graphQLOptions);

import {firestore} from '../firebase';

export const GET_ALL_PROJECTS = 'GET_ALL_PROJECTS';
export const GET_PROJECT = 'GET_PROJECT';

export const getAllProjects = () => (dispatch, getState) => {
    firestore
        .collection('/projects')
        .get()
    .then(snapshot => {
        dispatch({
            type: GET_ALL_PROJECTS,
            projects: snapshot.docs.map(doc => {
                return {
                    name: doc.get('name'),
                    logo: doc.get('logo'),
                    slug: doc.id,
                }
            })
        });
    })
    .catch(e => {
        console.log('Error fetching all projects:', e);
        dispatch({
            type: GET_ALL_PROJECTS,
            projects: getState().projects || []
        });
    });
}

export const getProject = (projectId) => (dispatch, getState) => {
    firestore
        .collection('/projects')
        .doc(projectId)
        .get()
    .then(snapshot => {
        dispatch({
            type: GET_PROJECT,
            project: {
                ...snapshot.data(),
                slug: snapshot.id,
                exists: true
            }
        });
    }).catch(e => {
        console.log('Error fetching a project:', e);
        dispatch({
            type: GET_PROJECT,
            project: { exists: false }
        });
    });
}