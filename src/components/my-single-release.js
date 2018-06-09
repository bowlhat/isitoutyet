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

import { connect } from 'pwa-helpers/connect-mixin.js';
import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';
import { store } from '../store.js';
import { getProject } from '../actions/projects.js';
import { getRelease } from '../actions/releases.js';
import app from '../reducers/app.js';
import projects from '../reducers/projects.js';
import releases from '../reducers/releases.js';

store.addReducers({
  app,
  projects,
  releases,
});

class MySingleRelease extends connect(store)(PageViewElement) {
  _render({_project, _release}) {
    if (!_project || !_release) {
      return;
    }
    const releaseDate = new Date(_release.date);

    return html`
      ${SharedStyles}
      <section>
        <nav>
          <a href="/projects/${_project.slug}">
            &laquo; Back to ${_project.name}
          </a>
        </nav>
        <header>
          <h2>
            Release information for
            <a href="${_project.homepage}">${_project.name}</a> ${_release.version}
            ${_release.islts && 'LTS'} ${_release.codename} ${_release.beta}
          </h2>
        </header>
      </section>

      <section>
        <article>
          <p>Release date: ${releaseDate.toDateString()} ${releaseDate.toTimeString()}</p>
          <p>Email received: ${_release.email.received || 'Unknown'}</p>
          <p>Subject: ${_release.email.subject}</p>
          <div>
            ${_release.email.body}
          </div>
        </article>
      </section>
    `
  }

  static get properties() { return {
    _release: Object,
    _project: Object,
    project: String,
    release: String,
  }}

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    if (this.project !== state.app.project) {
      this.project = state.app.project;
      store.dispatch(getProject(this.project));
    }
    if (this.release !== state.app.release) {
      this.release = state.app.release;
      store.dispatch(getRelease(this.project, this.release));
    }
    this._project = state.projects.project;
    this._release = state.releases.releases.length > 0 && state.releases.releases.shift();
  }
}

window.customElements.define('my-single-release', MySingleRelease);
