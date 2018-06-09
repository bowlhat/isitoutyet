import GraphClient from '../data/graphql';
import {queries} from '../data/queries';

const graphQLOptions = {
    url: '/api/graphql',
};
const client = new GraphClient(graphQLOptions);

export const GET_RELEASE = 'GET_RELEASE';

export const getRelease = (projectSlug, releaseId) => (dispatch, getState) => {
    client.get(queries.Release, { project: projectSlug, release: releaseId })
    .then(data => {
        dispatch({
            type: GET_RELEASE,
            releases: data.project.releases,
        });
    }).catch((e) => {
        dispatch({
            type: GET_RELEASE,
            releases: getState().releases || []
        });
    });
}