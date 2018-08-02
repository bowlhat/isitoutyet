/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';

import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import './push-notification-button.js';
import { SharedStyles } from './shared-styles.js';
import { store } from '../store.js';
import { getProject } from '../actions/projects.js';
import projects from '../reducers/projects.js';

store.addReducers({
  projects
});

class MySingleProject extends connect(store)(PageViewElement) {
  _render({project, _project}) {
    if (!_project.exists) {
      return html`
        <my-view404></my-view404>
      `;
    }

    return html`
      ${SharedStyles}
      <style>
        header {
          display: grid;
          grid-auto-rows: 1fr;
          align-items: center;
        }
        header button {
          height: 3em;
        }
        .list {
          list-style: none;
          padding: 0;
        }
        .list li {
          margin: 18px 0;
        }
        .logo {
          text-align: center;
        }
      </style>

      <section>
        <nav>
          <a href="/projects">
            &laquo; Back to all projects
          </a>
        </nav>
        <header>
          <h2>
            Is <em><a href="${_project.homepage}">${_project.name}</a></em> out yet?
          </h2>
        </header>
      </section>

      <section>
        <article>
          <push-notification-button project="${project}"></push-notification-button>
          ${_project.logo && html`
            <div class="logo">
              <img src="${_project.logo}" alt="${_project.name} logo" />
            </div>
          `}
          <p>${_project.description}</p>
          <h3>Known releases</h3>
          <ul class="list">
            ${_project.releases && _project.releases.map(release => html`
              <li>
                <a href="/projects/${_project.slug}/${release.id}">
                  ${_project.name} ${release.version} ${release.codename}
                  ${release.islts && ' LTS '} ${release.beta}
                </a>
              </li>
            `) || html`
              <li>
                There are no known releases for ${_project.name}
              </li>
            `}
          </ul>
        </article>
      </section>
    `
  }

  static get properties() { return {
    project: String,
    _project: Object
  }}

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    if (this.project !== state.app.project) {
      this.project = state.app.project
      store.dispatch(getProject(state.app.project));
    }
    this._project = state.projects.project;
  }
}

window.customElements.define('my-single-project', MySingleProject);
