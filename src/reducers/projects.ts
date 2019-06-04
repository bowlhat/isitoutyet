/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Reducer } from 'redux';

import {
  GET_ALL_PROJECTS,
  GET_PROJECT,
} from '../actions/projects';
import { RootAction } from '../store';

export interface ProjectsState {
  projects: ProjectsList;
  project: Project;
  error: string;
}
export interface ProjectsList {
  [index:string]: Project;
}
export interface Project {
  id?: string;
  description?: string;
  exists?: boolean;
  homepage?: string;
  name?: string;
  slug?: string;
  logo?: string;
}

const INITIAL_STATE: ProjectsState = {
  projects: {},
  project: {},
  error: ''
};

const projects: Reducer<ProjectsState, RootAction> = (state = INITIAL_STATE, action) => {
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
};

export default projects;
