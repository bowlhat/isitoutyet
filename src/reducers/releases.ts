/**
@license
Copyright (c) 2018 The Polymer Release Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Reducer } from 'redux';
import {
  GET_ALL_RELEASES,
  GET_RELEASE,
} from '../actions/releases';
import { RootAction } from '../store';

import {Email} from './email';

export interface ReleasesState {
  releases: Release[];
  release: Release;
  error: string;
}

export interface Release {
  beta?: string;
  codename?: string;
  date?: firebase.firestore.Timestamp;
  email?: Email;
  id?: string;
  islts?: boolean;
  version?: string;
}

const INITIAL_STATE: ReleasesState = {
  releases: [],
  release: {},
  error: ''
};

const releases: Reducer<ReleasesState, RootAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_RELEASES:
      return {
        ...state,
        releases: action.releases
      };
    case GET_RELEASE:
      return {
        ...state,
        release: action.release
      }
    default:
      return state;
  }
};

export default releases;
