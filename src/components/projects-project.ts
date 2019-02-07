/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, property } from 'lit-element';

// This element is *not* connected to the Redux store.
class ProjectsProject extends LitElement {
  @property({type: String})
  slug = '';

  @property({type: String})
  name = ''

  @property({type: String})
  logo = ''

  protected render() {
    return html`
      <div class="project">
        <h2>
          <a href="/projects/${this.slug}">${this.name}</a>
        </h2>
        ${this.logo && html`
        <a href="/projects/${this.slug}">
          <img
            src="${this.logo}"
            alt="${this.name} logo"
          />
        </a>
        `}
      </div>
    `;
  }
}

window.customElements.define('projects-project', ProjectsProject);
