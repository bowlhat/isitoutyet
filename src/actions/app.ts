/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store.js';
import { getEmail } from './emails.js';
import { getAllProjects, getProject } from './projects.js';
import { getAllReleases, getRelease } from './releases.js';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export interface AppActionUpdatePage extends Action<'UPDATE_PAGE'> {page: string};
export interface AppActionUpdateOffline extends Action<'UPDATE_OFFLINE'> {offline: boolean};
export interface AppActionUpdateDrawerState extends Action<'UPDATE_DRAWER_STATE'> {opened: boolean};
export interface AppActionOpenSnackbar extends Action<'OPEN_SNACKBAR'> {};
export interface AppActionCloseSnackbar extends Action<'CLOSE_SNACKBAR'> {};

export interface AppActionUpdateProject extends Action<'UPDATE_PROJECT'> {projectId: string};
export interface AppActionUpdateRelease extends Action<'UPDATE_RELEASE'> {releaseId: string};

export type AppAction = AppActionUpdatePage | AppActionUpdateOffline | AppActionUpdateDrawerState | AppActionOpenSnackbar | AppActionCloseSnackbar | AppActionUpdateProject | AppActionUpdateRelease;

type ThunkResult = ThunkAction<void, RootState, undefined, AppAction>;

export const navigate: ActionCreator<ThunkResult> = (path: string) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? 'projects' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));

  // Close the drawer - in case the *path* change came from a link in the drawer.
  dispatch(updateDrawerState(false));
};

const loadPage: ActionCreator<ThunkResult> = (page: string) => async (dispatch, getState) => {
  // If the page is invalid, set to 404. The is also a good spot to check
  // other location things like sub-path or query params.
  const state = getState();
  const parts = page.split('/');
  if (parts[0] === 'projects') {
    if (parts[1] === undefined) {
      dispatch(getAllProjects());
      page = 'projects';
    } else {
      dispatch(getProject(parts[1]));
      if (parts[2] === undefined) {
        dispatch(getAllReleases(parts[1]));
        page = 'single-project';
      } else {
        dispatch(getRelease(parts[1], parts[2]));
        page = 'single-release';
      }
    }
  } else if (parts[0] === 'admin') {
    if (!state.currentUser || !['owner', 'admin'].includes(state.currentUser.role)) {
      page = 'view403';
    } else if (parts[1] === undefined) {
      page = 'admin';
    } else {
      if (parts[1] === 'email' && parts[2] !== undefined) {
        console.log(`loading email:`, parts[2]);
        dispatch(getEmail(parts[2]));
        page = 'admin-single-email';
      } else {
        page = 'view404';
      }
    }
  } else {
    switch (page) {
      case 'about':
      case 'terms':
      case 'privacy':
        break;
      default:
        page = 'view404';
    }
  }

  switch(page) {
    case 'projects':
      await import('../components/my-projects.js');
      break;
    case 'single-project':
      await import('../components/my-single-project.js');
      break;
    case 'single-release':
      await import('../components/my-single-release.js');
      break;
    case 'admin':
      await import('../components/my-admin.js');
      break;
    case 'admin-single-email':
      await import('../components/my-admin-single-email.js');
      break;
    case 'about':
      await import('../components/my-about.js');
      break;
    case 'terms':
      await import('../components/my-terms.js');
      break;
    case 'privacy':
      await import('../components/my-privacy.js');
      break;
    case 'view403':
      await import('../components/my-view403.js');
      break
    case 'view404':
    default:
      import('../components/my-view404.js');
  }

  dispatch(updatePage(page));
};

const updatePage: ActionCreator<AppActionUpdatePage> = (page: string) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};

let snackbarTimer: number;

export const showSnackbar: ActionCreator<ThunkResult> = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  window.clearTimeout(snackbarTimer);
  snackbarTimer = window.setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline: ActionCreator<ThunkResult> = (offline: boolean) => (dispatch, getState) => {
  // Show the snackbar only if offline status changes.
  if (offline !== getState().app!.offline) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateDrawerState: ActionCreator<AppActionUpdateDrawerState> = (opened: boolean) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  };
};
