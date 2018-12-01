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
import releases from '../reducers/releases.js';
import { getAllReleases } from '../actions/releases.js';

store.addReducers({
  projects,
  releases,
});

let currentProjectId = '';

let acting = false;

store.subscribe(() => {
  if (!acting) {
    acting = true;

    const state       = store.getState();
    const {projectId} = state.app;
    
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
  render() {
    const {project, releases} = this;
    
    if (!project || !project.exists) {
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
        .releases {
          display: flex;
          flex-direction: column;
          align-items: center;
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
            Is <em><a href="${project.homepage}">${project.name}</a></em> out yet?
          </h2>
        </header>
      </section>

      <section>
        <article>
          <push-notification-button project="${project.slug}"></push-notification-button>
          ${project.logo && html`
            <div class="logo">
              <img src="${project.logo}" alt="${project.name} logo" />
            </div>
          `}
          <p>${project.description}</p>
          <ins class="adsbygoogle"
            style="display:block; text-align:center;"
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="ca-pub-8255474170399666"
            data-ad-slot="7713854559"></ins>
          <div class="releases">
            <h3>Known releases</h3>
            <ul class="list">
              ${releases && releases.map(release => html`
                <li>
                  <a href="/projects/${project.slug}/${release.id}">
                    ${project.name} ${release.version} ${release.codename}
                    ${release.islts ? 'LTS' : ''} ${release.beta}
                  </a>
                </li>
              `) || html`
                <li>
                  There are no known releases for ${project.name}
                </li>
              `}
            </ul>
          </div>
        </article>
      </section>
    `
  }

  static get properties() { return {
    project: Object,
    releases: Array,
  }}

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this.project  = state.projects.project;
    this.releases = state.releases.releases;
  }
}

window.customElements.define('my-single-project', MySingleProject);
