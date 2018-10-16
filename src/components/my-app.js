/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState
} from '../actions/app.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-scroll-effects/effects/blend-background.js';
import '@polymer/app-layout/app-scroll-effects/effects/parallax-background.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { menuIcon } from './my-icons.js';
import './snack-bar.js';

import '../push-notifications.js';

class MyApp extends connect(store)(LitElement) {
  render() {
    const {appTitle, _page, _drawerOpened, _snackbarOpened, _offline} = this;
    // Anything that's related to rendering should be done in here.
    return html`
    <style>
      :host {
        --app-drawer-width: 256px;
        display: block;

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
        --app-header-background-front-layer: {
          background-position: center center;
          background-image: url(images/header-bg-1600.jpg);
        };
        --app-header-background-rear-layer: {
          background-color: gray;
        };
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

      app-drawer {
        z-index: 1;
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
        padding-top: 244px;
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
        background: url(https://bowlhat.net/wp-content/themes/bowlhat-freelance/images/logo.svg) center center no-repeat;
        background-size: 80px 48px;
        width: 190px;
        height: 50px;
        margin: 35px auto;
        text-indent: -9999px;
      }

      /* Wide layout: when the viewport width is bigger than 460px, layout
      changes to a wide layout. */
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
      }
    </style>

    <!-- Header -->
    <app-header condenses reveals effects="waterfall blend-background parallax-background">
      <app-toolbar class="toolbar-top">
        <button class="menu-btn" title="Menu" @click="${() => store.dispatch(updateDrawerState(true))}">${menuIcon}</button>
        <div main-title>${appTitle}</div>
      </app-toolbar>

      <!-- This gets hidden on a small screen-->
      <nav class="toolbar-list">
        <a ?selected="${_page === 'about'}" href="/about">About Us</a>
        <a ?selected="${_page === 'projects'}" href="/projects">Projects</a>
      </nav>
    </app-header>

    <!-- Drawer content -->
    <app-drawer .opened="${_drawerOpened}"
        @opened-changed="${e => store.dispatch(updateDrawerState(e.target.opened))}">
      <nav class="drawer-list">
        <a ?selected="${_page === 'about'}" href="/about">About Us</a>
        <a ?selected="${_page === 'projects'}" href="/projects">Projects</a>
        <a ?selected="${_page === 'privacy'}" href="/privacy">Privacy Information</a>
        <a ?selected="${_page === 'terms'}" href="/terms">Terms of Service</a>
      </nav>
    </app-drawer>

    <!-- Main content -->
    <main class="main-content">
      <my-about class="page" ?active="${_page === 'about'}"></my-about>
      <my-privacy class="page" ?active="${_page === 'privacy'}"></my-privacy>
      <my-terms class="page" ?active="${_page === 'terms'}"></my-terms>
      <my-projects class="page" ?active="${_page === 'projects'}"></my-projects>
      <my-single-project class="page" ?active="${_page === 'single-project'}"></my-single-project>
      <my-single-release class="page" ?active="${_page === 'single-release'}"></my-single-release>
      <my-view404 class="page" ?active="${_page === 'view404'}"></my-view404>
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
          <span>© Daniel Llewellyn T/A Bowl Hat</span>
        </p>
        <p class="copyright-logo">Bowl Hat</p>
      </div>
    </footer>

    <snack-bar ?active="${_snackbarOpened}">
        You are now ${_offline ? 'offline' : 'online'}.</snack-bar>
    `;
  }

  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _project: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean }
    }
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`,
        () => store.dispatch(updateDrawerState(false)));
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _stateChanged(state) {
    this._page = state.app.page;
    this._offline = state.app.offline;
    this._snackbarOpened = state.app.snackbarOpened;
    this._drawerOpened = state.app.drawerOpened;
    this._project = state.app.project;
  }
}

window.customElements.define('my-app', MyApp);
