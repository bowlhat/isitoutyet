/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';
export const UPDATE_RELEASE = 'UPDATE_RELEASE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? 'projects' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));

  // Close the drawer - in case the *path* change came from a link in the drawer.
  dispatch(updateDrawerState(false));
};

const loadPage = (page) => async (dispatch) => {
  // If the page is invalid, set to 404. The is also a good spot to check
  // other location things like sub-path or query params.
  const parts = page.split('/');
  if (parts[0] === 'projects') {
    if (parts[1] === undefined) {
      page = 'projects';
    } else {
      dispatch(updateProject(parts[1]));
      if (parts[2] === undefined) {
        page = 'single-project';
      } else {
        dispatch(updateRelease(parts[2]));
        page = 'single-release';
      }
    }
  } else {
  // } else if (['projects'].indexOf(page) === -1) {
    switch (page) {
      case 'about':
      case 'terms':
      case 'privacy':
        break;
      default:
        page = 'view404';
    }
  }

  dispatch(updatePage(page));

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
    case 'about':
      await import('../components/my-about.js');
      break;
    case 'terms':
      await import('../components/my-terms.js');
      break;
    case 'privacy':
      await import('../components/my-privacy.js');
      break;
    // case 'view1':
    //   import('../components/my-view1.js').then((module) => {
    //     // Put code in here that you want to run every time when
    //     // navigating to view1 after my-view1.js is loaded.
    //   });
    //   break;
    // case 'view2':
    //   import('../components/my-view2.js');
    //   break;
    // case 'view3':
    //   import('../components/my-view3.js');
    default:
      page = 'view404';
      import('../components/my-view404.js');
  }

  dispatch(updatePage(page));
};

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};

const updateProject = (projectId) => {
  return {
    type: UPDATE_PROJECT,
    projectId
  };
}

const updateRelease = (releaseId) => {
  return {
    type: UPDATE_RELEASE,
    releaseId
  };
}

let snackbarTimer;

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  window.clearTimeout(snackbarTimer);
  snackbarTimer = window.setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline) => (dispatch, getState) => {
  // Show the snackbar only if offline status changes.
  if (offline !== getState().app.offline) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateDrawerState = (opened) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  };
};
