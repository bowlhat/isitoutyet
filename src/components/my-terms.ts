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

class MyTerms extends PageViewElement {
  static styles = SharedStyles;

  protected render() {
    return html`
      <section>
        <header>
          <nav>
            <a href="/projects">
              &laquo; Back to all projects
            </a>
          </nav>
          <h2>Terms of service</h2>
        </header>
      </section>

      <section>
        <h3>Effective Dates</h3>
        <p>
          These terms cover from 1st May 2018 until superceded by a new document with a
          later date shown in this paragraph.
        </p>
      </section>

      <section>
        <h3>Use of the service</h3>
        <p>
          You may only use this service for legal purposes. We may restrict or prevent
          you from continuing to use the service if we deem that you are using it in an
          abnormal or excessive way.
        </p>
      </section>
      
      <section>
        <h3>Warrarnties</h3>
        <p>
          This service is provided on an as-is basis, with no warranty or guarantee as to
          the correctness or fitness for purpose of any information contained within, or
          provided by, the service. While we aim to maintain availability of the service,
          we cannot guarantee the service will remain operational or defect-free.
        </p>
      </section>
      
      <section>
        <h3>Liability</h3>
        <p>
          We shall not in any event be liable for economic loss (including loss of profit
          or goodwill) or any indirect or consequential loss or damage incurred through
          your use of, or reliance on, this service.
        </p>
      </section>
      
      <section>
        <h3>Exercising these terms</h3>
        <p>
          Any failure or delay on our part in exercising or enforcing any rights conferred
          by these terms and conditions shall not be deemed to be a waiver thereof or
          operate so as to bar the exercise or enforcement of such rights at any time.
        </p>
      </section>
      
      <section>
        <h3>Changes</h3>
        <p>
          We may change these terms to cover new or changed services. We will post the
          revised terms on this page with the date of publication clearly visible.
        </p>
      </section>
      
      <section>
        <h3>Contact</h3>
        <p>
          Do you have questions or concerns about our service or your privacy? Please
          contact us via email to
          <a href="mailto:support+privacy@bowlhat.net">support+privacy@bowlhat.net</a>.
        </p>
      </section>
    `;
  }
}

window.customElements.define('my-terms', MyTerms);
