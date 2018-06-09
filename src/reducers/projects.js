import {GET_ALL_PROJECTS, GET_PROJECT} from '../actions/projects.js';

const projects = (state = {projects: []}, action) => {
    switch (action.type) {
        case GET_ALL_PROJECTS:
            return {
                ...state,
                projects: action.projects
            };
        case GET_PROJECT:
            return {
                ...state,
                project: action.project
            };
        default:
            return state;
    }
}

export default projects;
