import GraphClient from '../data/graphql';
import {queries} from '../data/queries';

const graphQLOptions = {
    url: '/api/graphql',
};
const client = new GraphClient(graphQLOptions);

export const GET_ALL_PROJECTS = 'GET_ALL_PROJECTS';
export const GET_PROJECT = 'GET_PROJECT';

export const getAllProjects = () => (dispatch, getState) => {
    client.get(queries.AllProjects)
    .then(data => {
        dispatch({
            type: GET_ALL_PROJECTS,
            projects: data.projects
        });
    })
    .catch(() => {
        dispatch({
            type: GET_ALL_PROJECTS,
            projects: getState().projects || []
        });
    });
}

export const getProject = (projectSlug) => (dispatch, getState) => {
    client.get(queries.Project, { slug: projectSlug })
    .then(data => {
        dispatch({
            type: GET_PROJECT,
            project: {
                ...data.project,
                exists: true
            }
        });
    }).catch(() => {
        dispatch({
            type: GET_PROJECT,
            project: { exists: false }
        });
    });
}