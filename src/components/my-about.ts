/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

class MyAbout extends PageViewElement {
  static styles = SharedStyles;

  protected render() {
    return html`
      <section>
        <nav>
          <a href="/projects">
            &laquo; Back to all projects
          </a>
        </nav>
        <header>
          <h2>About Us</h2>
        </header>
      </section>

      <section>
        <p>
          Is your favourite project's latest version out yet? We aim to answer the age old
          question of "Is it out yet?" We will keep track of release announcements and
          collect them all into a single place. We also allow you to subscribe your web
          browser or mobile device to receive an immediate notification message when we
          become aware of a new release for your tracked projects.
        </p>
        <p class="donate">
          Please consider donating to the project to ensure it remains available. If you
          want to help, please <a href="https://liberapay.com/diddledan/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a>.
        </p>
      </section>
    `;
  }
}

window.customElements.define('my-about', MyAbout);