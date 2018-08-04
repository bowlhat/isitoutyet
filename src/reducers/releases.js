import {GET_RELEASE, GET_ALL_RELEASES} from '../actions/releases.js';

const releases = (state = {release: {}, releases: []}, action) => {
    switch (action.type) {
        case GET_ALL_RELEASES:
            return {
                ...state,
                releases: action.releases,
            };
        case GET_RELEASE:
            return {
                ...state,
                release: action.release,
            };
        default:
            return state;
    }
}

export default releases;
