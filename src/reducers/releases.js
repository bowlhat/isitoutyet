import {GET_RELEASE} from '../actions/releases.js';

const releases = (state = {releases: []}, action) => {
    switch (action.type) {
        case GET_RELEASE:
            return {
                ...state,
                releases: action.releases,
            };
        default:
            return state;
    }
}

export default releases;
