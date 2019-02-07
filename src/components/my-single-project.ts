/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css, property } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { PageViewElement } from './page-view-element';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the elements needed by this element.
import './projects-project';

// These are the actions needed by this element.
import { getProject } from '../actions/projects';
import { getAllReleases } from '../actions/releases';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { Project } from '../reducers/projects';
import { Release } from '../reducers/releases';

import projects from '../reducers/projects';
import releases from '../reducers/releases';
store.addReducers({
  projects,
  releases,
});

let currentProjectId = '';

let acting = false;

store.subscribe(() => {
  if (!acting) {
    acting = true;

    const state: RootState = store.getState();
    const projectId = state.app!.projectId;
    
    if (projectId && currentProjectId !== projectId) {
      console.log('Single project: Fetch new project:', projectId);
      store.dispatch(getProject(projectId));
      store.dispatch(getAllReleases(projectId));
      currentProjectId = projectId;
    }

    acting = false;
  }
});

class MySingleProject extends connect(store)(PageViewElement) {
  @property({type: Array})
  private _releases: Release[] = [];

  @property({type: Object})
  private _project: Project = {};

  static styles = [
    SharedStyles,
    css`
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
      .releases {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `
  ];

  protected render() {
      return html`
        <section>
            <nav>
                <a href="/projects">
                &laquo; Back to all projects
                </a>
            </nav>
            <header>
                <h2>
                Is <em><a href="${this._project.homepage}">${this._project.name}</a></em> out yet?
                </h2>
            </header>
        </section>

        <section>
            <article>
                <push-notification-button project="${this._project.slug}"></push-notification-button>
                ${this._project.logo && html`
                  <div class="logo">
                      <img src="${this._project.logo}" alt="${this._project.name} logo" />
                  </div>
                `}
                <p>${this._project.description}</p>
                <h3>Known releases</h3>
                <ul class="list">
                    ${this._releases.map(release => html`
                      <li>
                          <a href="/projects/${this._project.slug}/${release.id}">
                          ${this._project.name} ${release.version} ${release.codename}
                          ${release.islts ? 'LTS' : ''} ${release.beta}
                          </a>
                      </li>
                    `)}
                </ul>
            </article>
        </section>
      `;
  }

  // This is called every time something is updated in the store.
  stateChanged(state: RootState) {
    if (state.releases) {
      this._releases = state.releases.releases;
    }
    if (state.projects) {
      this._project = state.projects.project;
    }
  }
}

window.customElements.define('my-single-project', MySingleProject);
