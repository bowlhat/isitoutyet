/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, property, PropertyValues } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { connect } from 'pwa-helpers/connect-mixin';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from 'pwa-helpers/router';
import { updateMetadata } from 'pwa-helpers/metadata';

import { firebase } from '@firebase/app';
// import { User } from '@firebase/auth-types';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState
} from '../actions/app';
import user, { UserState } from '../reducers/user';

// The following line imports the type only - it will be removed by tsc so
// another import for app-drawer.js is required below.
import { AppDrawerElement } from '@polymer/app-layout/app-drawer/app-drawer';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-scroll-effects/effects/material';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import { menuIcon } from './my-icons';
import './snack-bar';

store.addReducers({
  user
});

class MyApp extends connect(store)(LitElement) {
  @property({type: String})
  appTitle = '';

  @property({type: String})
  private _page = '';

  @property({type: Boolean})
  private _drawerOpened = false;

  @property({type: Boolean})
  private _snackbarOpened = false;

  @property({type: Boolean})
  private _offline = false;

  @property({type: Object})
  private _user: UserState = {
    user: undefined,
    role: '',
  };

  static styles = css`
    :host {
      display: block;

      --app-drawer-width: 256px;

      --app-primary-color: #E91E63;
      --app-secondary-color: #293237;
      --app-dark-text-color: var(--app-secondary-color);
      --app-light-text-color: white;
      --app-section-even-color: #f7f7f7;
      --app-section-odd-color: white;

      --app-header-background-color: gray;
      --app-header-text-color: var(--app-light-text-color);
      --app-header-selected-color: var(--app-primary-color);

      --app-drawer-background-color: var(--app-secondary-color);
      --app-drawer-text-color: var(--app-light-text-color);
      --app-drawer-selected-color: #78909C;
    }

    app-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 240px;
      text-align: center;
      background-color: var(--app-header-background-color);
      color: var(--app-header-text-color);
      border-bottom: 1px solid #eee;
    }

    /*.toolbar-top {
      background-color: var(--app-header-background-color);
    }*/

    [main-title] {
      font-family: 'Pacifico';
      text-transform: lowercase;
      font-size: 30px;
      /* In the narrow layout, the toolbar is offset by the width of the
      drawer button, and the text looks not centered. Add a padding to
      match that button */
      padding-right: 44px;
    }

    .toolbar-list {
      display: none;
    }

    .toolbar-list > a {
      display: inline-block;
      color: var(--app-header-text-color);
      text-decoration: none;
      line-height: 30px;
      padding: 4px 24px;
    }

    .toolbar-list > a[selected] {
      color: var(--app-header-selected-color);
      border-bottom: 4px solid var(--app-header-selected-color);
    }

    .menu-btn {
      background: none;
      border: none;
      fill: var(--app-header-text-color);
      cursor: pointer;
      height: 44px;
      width: 44px;
    }

    .drawer-list {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 24px;
      background: var(--app-drawer-background-color);
      position: relative;
    }

    .drawer-list > a {
      display: block;
      text-decoration: none;
      color: var(--app-drawer-text-color);
      line-height: 40px;
      padding: 0 24px;
    }

    .drawer-list > a[selected] {
      color: var(--app-drawer-selected-color);
    }

    /* Workaround for IE11 displaying <main> as inline */
    main {
      display: block;
    }

    .main-content {
      padding-top: 240px;
      min-height: 100vh;
    }

    .page {
      display: none;
    }

    .page[active] {
      display: block;
    }

    footer {
      padding: 24px;
      background: var(--app-section-odd-color);
      color: var(--app-dark-text-color);
      text-align: center;
    }

    footer a {
      color: var(--app-dark-text-color);
    }

    .copyright-logo {
      background: url('images/bowlhat-logo.svg') center center no-repeat;
      background-size: 80px 48px;
      width: 190px;
      height: 50px;
      margin: 35px auto;
      text-indent: -9999px;
    }

    /* Wide layout: when the viewport width is bigger than 460px, layout
      changes to a wide layout */
    @media (min-width: 460px) {
      app-header {
        height: 500px;
      }

      .toolbar-list {
        display: block;
      }

      .menu-btn {
        display: none;
      }

      .main-content {
        padding-top: 507px;
      }

      /* The drawer button isn't shown in the wide layout, so we don't
      need to offset the title */
      [main-title] {
        padding-right: 0px;
      }

      .pi {
        font-size: 0.8rem;
        text-align: right;
      }
      .pi button {
        background: none;
        border: none;
      }
    }
  `;

  protected render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <custom-style>
        <style is="custom-style">
          app-header {
            --app-header-background-front-layer: {
              background-position: center center;
              background-image: url('images/header-bg-1600.jpg');
            };
            --app-header-background-rear-layer: {
              background-color: var(--app-header-background-color);
            };
          }
        </style>
      </custom-style>
      <!-- Header -->
      <app-header condenses reveals effects="material">
        <app-toolbar class="toolbar-top">
          <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
          <div main-title>${this.appTitle}</div>
        </app-toolbar>

        <!-- This gets hidden on a small screen-->
        <nav class="toolbar-list">
          <a ?selected="${this._page === 'about'}" href="/about">About</a>
          <a ?selected="${this._page === 'projects'}" href="/projects">Projects</a>
        </nav>
      </app-header>

      <!-- Drawer content -->
      <app-drawer
          .opened="${this._drawerOpened}"
          @opened-changed="${this._drawerOpenedChanged}">
        <nav class="drawer-list">
          <a ?selected="${this._page === 'about'}" href="/about">About</a>
          <a ?selected="${this._page === 'projects'}" href="/projects">Projects</a>
          <a ?selected="${this._page === 'privacy'}" href="/privacy">Privacy</a>
          <a ?selected="${this._page === 'terms'}" href="/terms">Terms</a>
        </nav>
      </app-drawer>

      <!-- Main content -->
      <main role="main" class="main-content">
        <my-about class="page" ?active="${this._page === 'about'}"></my-about>
        <my-projects class="page" ?active="${this._page === 'projects'}"></my-projects>
        <my-single-project class="page" ?active="${this._page === 'single-project'}"></my-single-project>
        <my-single-release class="page" ?active="${this._page === 'single-release'}"></my-single-release>
        <my-privacy class="page" ?active="${this._page === 'privacy'}"></my-privacy>
        <my-terms class="page" ?active="${this._page === 'terms'}"></my-terms>
        <my-admin class="page" ?active="${this._page === 'admin'}"></my-admin>
        <my-admin-single-email class="page" ?active="${this._page === 'admin-single-email'}"></my-admin-single-email>
        <my-view403 class="page" ?active="${this._page === 'view403'}"></my-view403>
        <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
      </main>

      <footer>
        <div>
          <p>
            <a href="/">Home</a>
            <span>|</span>
            <a href="/privacy">Privacy</a>
            <span>|</span>
            <a href="/terms">Terms</a>
            <span>|</span>
            ${this._user && this._user.user && ['owner', 'admin'].includes(this._user.role) ? html`
              <a href="/admin">Admin</a>
              <span>|</span>
            ` : ''}
            <span>© Daniel Llewellyn T/A Bowl Hat</span>
          </p>
          <p class="copyright-logo">Bowl Hat</p>
          <p class="pi"><button @click="${() => this._signIn()}">π</button></p>
        </div>
      </footer>

      <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.
      </snack-bar>
    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  protected firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`,
        () => store.dispatch(updateDrawerState(false)));
  }

  protected updated(changedProps: PropertyValues) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  private _menuButtonClicked() {
    store.dispatch(updateDrawerState(true));
  }

  private _drawerOpenedChanged(e: Event) {
    store.dispatch(updateDrawerState((e.target as AppDrawerElement).opened));
  }

  stateChanged(state: RootState) {
    this._page = state.app!.page;
    this._offline = state.app!.offline;
    this._snackbarOpened = state.app!.snackbarOpened;
    this._drawerOpened = state.app!.drawerOpened;
    this._user = state.user.currentUser || { user: undefined, roles: [] };
  }

  private _signIn() {
    if (firebase.auth) {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    }
  }

  // private _signOut() {
  //   if (firebase.auth) {
  //     firebase.auth().signOut();
  //   }
  // }

}

window.customElements.define('my-app', MyApp);
