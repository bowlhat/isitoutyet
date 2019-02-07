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

// These are the actions needed by this element.
import { getAllProjects } from '../actions/projects';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import projects, { ProjectsList, Project } from '../reducers/projects';

store.addReducers({
  projects
});

class MyProjects extends connect(store)(PageViewElement) {
  @property({type: Object})
  private _projects: ProjectsList = {};
  
  static styles = [
    SharedStyles,
    css`
    h2 {
      font-size: 1.5rem;
    }
    section > article {
      display: grid;
      grid-gap: 1rem;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
    div.project {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    `,
  ];
  
  protected render() {
    return html`
    <section>
      <article>
        ${Object.keys(this._projects).map((key) => {
          const item: Project = this._projects[key];
          return html`
          <div class="project">
            <h2>
              <a href="/projects/${key}">${item.name}</a>
            </h2>
            ${item.logo && html`
              <a href="/projects/${key}">
                <img src="${item.logo}" alt="${item.name} logo" />
              </a>
            `}
          </div>
          `
        })}
      </article>
    </section>
    `;
  }
  
  protected firstUpdated() {
    store.dispatch(getAllProjects());
  }
  
  // This is called every time something is updated in the store.
  stateChanged(state: RootState) {
    if (state.projects) {
      this._projects = state.projects.projects;
    }
  }
}

window.customElements.define('my-projects', MyProjects);
