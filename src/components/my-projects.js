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
import { connect } from 'pwa-helpers/connect-mixin.js';

import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';
import { store } from '../store.js';
import { getAllProjects } from '../actions/projects.js';
import projects from '../reducers/projects.js';

store.addReducers({
  projects
});

class MyProjects extends connect(store)(PageViewElement) {
  _render({_projects}) {
    return html`
      ${SharedStyles}
      <section>
        ${_projects.map(project => {
          return html`
          <article>
            <h2>
              <a href="/projects/${project.slug}">${project.name}</a>
            </h2>
            ${project.logo && html`
            <a href="/projects/${project.slug}">
              <img
                src="${project.logo}"
                alt="${project.name} logo"
              />
            </a>
            `}
          </article>
          `
        })}
      </section>
    `
  }

  static get properties() { return {
    _projects: Array
  }}

  _firstRendered() {
    store.dispatch(getAllProjects());
  }

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    this._projects = state.projects.projects;
  }
}

window.customElements.define('my-projects', MyProjects);
