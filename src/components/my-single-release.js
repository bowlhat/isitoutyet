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

import { SharedStyles } from './shared-styles.js';
import { store } from '../store.js';
import { getProject } from '../actions/projects.js';
import { getRelease } from '../actions/releases.js';
import projects from '../reducers/projects.js';
import releases from '../reducers/releases.js';

store.addReducers({
  projects,
  releases,
});

let currentProjectId = '';
let currentReleaseId = '';

let acting = false;

store.subscribe(() => {
  if (!acting) {
    acting = true;

    const state = store.getState();

    const {projectId, releaseId} = state.app;
    
    if (projectId && currentProjectId !== projectId) {
      console.log('Single release: Fetch new project:', projectId);
      store.dispatch(getProject(projectId));
      currentProjectId = projectId;
    }

    if (releaseId && currentReleaseId !== releaseId) {
      console.log('Single release: Fetch new release:', projectId);
      store.dispatch(getRelease(projectId, releaseId));
      currentReleaseId = releaseId;
    }

    acting = false;
  }
});

class MySingleRelease extends connect(store)(PageViewElement) {
  render() {
    const {project, release} = this;
    
    if (!project || !release || !release.email) {
      return html`
        <my-view404></my-view404>
      `;
    }
    let releaseDate = 'Unknown',
        releaseTime = 'Unknown';
    if (release.date) {
      const d = release.date.toDate();
      releaseDate = d.toDateString();
      releaseTime = d.toTimeString();
    }
    
    let emailDate = 'Unknown',
        emailTime = '';
    
    const email = release.email;
    if (email.received) {
      const d = email.received.toDate();
      emailDate = d.toDateString();
      emailTime = d.toTimeString();
    }

    return html`
      ${SharedStyles}
      <section>
        <nav>
          <a href="/projects/${project.slug}">
            &laquo; Back to ${project.name}
          </a>
        </nav>
        <header>
          <h2>
            Release information for
            <a href="${project.homepage}">${project.name}</a> ${release.version}
            ${release.islts ? 'LTS' : ''} ${release.codename} ${release.beta}
          </h2>
        </header>
      </section>

      <section>
        <article>
          <p>Release date: ${releaseDate} ${releaseTime}</p>
          <p>Email received: ${emailDate} ${emailTime}</p>
          <p>Subject: ${email ? email.subject : ''}</p>
          <ins class="adsbygoogle"
            style="display:block; text-align:center;"
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="ca-pub-8255474170399666"
            data-ad-slot="9663987201"></ins>
          <pre>
            ${email ? email.body : 'No announcement text available'}
          </pre>
        </article>
      </section>
    `
  }

  static get properties() {
    return {
      release: Object,
      project: Object,
    }
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this.project = state.projects.project;
    this.release = state.releases.release;
  }
}

window.customElements.define('my-single-release', MySingleRelease);
