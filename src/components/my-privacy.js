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
import { SharedStyles } from './shared-styles.js';
import { PageViewElement } from './page-view-element.js';

class MyPrivacy extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      
      <section>
        <nav>
          <a href="/projects">
            &laquo; Back to all projects
          </a>
        </nav>
        <header>
          <h2>Privacy information</h2>
        </header>
      </section>
      
      <section>
        <h3>Effective Dates</h3>
        <p>
          This policy covers from 1st May 2018 until superceded by a new document with a
          later date shown in this paragraph.
        </p>
      </section>

      <section>
        <h3>What we collect and why</h3>
        <p>
          We use cookies and tracking technology from Google to track usage of this site
          via Google Analytics. This enables us to see which pages people like to visit
          and the type of information they prefer. Google's privacy policy applies in
          addition to this policy.
        </p>
      </section>
      
      <section>
        <h3>Who we share your data with</h3>
        <p>
          We share your data with Google Analytics who may track your usage of other sites
          and tie your usage of this site to usage of those other sites.
        </p>      
        <p>
          If we are requested by law enforcement agencies we will provide the minimum
          information we are required, and have readily available, to satisfy the request.
        </p>
      </section>
      
      <section>
        <h3>How long we save your data</h3>
        <p>
          We have configured Google Analytics to retain data for the minimum duration they
          allow. That means Google Analytics will retain on our behalf usage data for
          fourteen (14) months after which it must be deleted.
        </p>
      </section>

      <section>
        <h3>Changes</h3>
        <p>
          We may change this privacy policy to cover new or changed data collection and
          retention. We will post the revised policy on this page with the date of
          publication clearly visible.
        </p>
      </section>

      <section>
        <h3>Contact</h3>
        <p>
          Do you have questions or concerns about our service or your privacy? Please
          contact us via email to <a href="mailto:support@bowlhat.net">support@bowlhat.net</a>.
        </p>
      </section>
    `;
  }
}

window.customElements.define('my-privacy', MyPrivacy);
