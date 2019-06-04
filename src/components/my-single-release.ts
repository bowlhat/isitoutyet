/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, property, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { PageViewElement } from './page-view-element';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the actions needed by this element.

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { Project } from '../reducers/projects';
import { Release } from '../reducers/releases';
import { Email } from '../reducers/emails';

import projects from '../reducers/projects';
import releases from '../reducers/releases';
store.addReducers({
    projects,
    releases,
});

class MySingleRelease extends connect(store)(PageViewElement) {
    @property({type: Object})
    private _release: Release = {};
    
    @property({type: Object})
    private _project: Project = {};
    
    static styles = [
        SharedStyles,
        css`
        code {
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
        }
        `
    ];
    
    protected render() {
        let releaseDate = 'Unknown',
            releaseTime = 'Unknown',
            emailDate = 'Unknown',
            emailTime = '',
            email: Email = {};
        
        
        if (this._release) {
            if (this._release.date) {
                const d: Date = this._release.date.toDate();
                releaseDate = d.toDateString();
                releaseTime = d.toTimeString();
            }
        }
        
        if (this._release && this._release.email) {
            email = this._release.email;
            if (email.received) {
                const d = email.received.toDate();
                emailDate = d.toDateString();
                emailTime = d.toTimeString();
            }
        }
        return html`
            <section>
                <nav>
                    <a href="/projects/${this._project.slug}">
                        &laquo; Back to ${this._project.name}
                    </a>
                </nav>
                <header>
                    <h2>
                        Release information for
                        <a href="${this._project.homepage}">${this._project.name}</a> ${this._release.version}
                        ${this._release.islts ? 'LTS' : ''} ${this._release.codename} ${this._release.beta}
                    </h2>
                </header>
            </section>
            
            <section>
                <article>
                    <p>Release date: ${releaseDate} ${releaseTime}</p>
                    <p>Email received: ${emailDate} ${emailTime}</p>
                    <p>Subject: ${email ? email.subject : ''}</p>
                    <p class="donate">Your donations keep us afloat. Please <a href="https://liberapay.com/diddledan/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a> to continued maintenance of this project.</p>
                    <code>
                        ${email && email.body ? email.body.split(/\r\n\r\n|\n\n|\r\r/).map(paragraph => {
                            paragraph = paragraph.trim();
                            return html`<p>
                                ${paragraph.match(/^([^\n\r]+(\r\n|\n|\r)\s*[-]+\s*)|(\s*[-]+\s*(\r\n|\n|\r).*)$/)
                                    ? paragraph.split(/\r\n|\n|\r/).map(line => html`${line}<br />`)
                                    : html`${paragraph}`}
                            </p>`
                        }) : 'No announcement text available'}
                    </code>
                </article>
            </section>
        `;
    }

    // This is called every time something is updated in the store.
    stateChanged(state: RootState) {
        if (state.projects) {
            this._project = state.projects.project;
        }
        if (state.releases) {
            this._release = state.releases.release;
        }
    }
}

window.customElements.define('my-single-release', MySingleRelease);
