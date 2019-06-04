import { html, css, property } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { PageViewElement } from './page-view-element';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the actions needed by this element.
// import { getAllProjects } from '../actions/projects';
import user, { UserState } from '../reducers/user';
import emails, { Email } from '../reducers/emails';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

store.addReducers({
    emails,
    user,
});

class MyAdminSingleEmail extends connect(store)(PageViewElement) {
    @property({type: Object})
    private _user: UserState = {
        user: undefined,
        role: '',
    };

    @property({type: Array})
    private _email: Email = {};

    static styles = [
        SharedStyles,
        css`
        h2 {
            font-size: 1.5rem;
        }
        `,
    ];

    protected render() {
        if (!this._user.user || !['owner', 'admin'].includes(this._user.role)) {
            return html`403 Forbidden`;
        }

        const date: Date = this._email.received ? this._email.received.toDate() : new Date(0);

        return html`
        <section>
            <article>
                <h2>${this._email.subject}</h2>
                <p>Received: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</p>
                <code>
                    ${this._email && this._email.body ? this._email.body.split(/\r\n\r\n|\n\n|\r\r/).map(paragraph => {
                        paragraph = paragraph.trim();
                        return html`<p>
                            ${paragraph.match(/^([^\n\r]+(\r\n|\n|\r)\s*[-]+\s*)|(\s*[-]+\s*(\r\n|\n|\r).*)$/)
                                ? paragraph.split(/\r\n|\n|\r/).map(line => html`${line}<br />`)
                                : html`${paragraph}`}
                        </p>`
                    }) : 'No email text available'}
                </code>
            </article>
        </section>
        `;
    }

    // This is called every time something is updated in the store.
    stateChanged(state: RootState) {
        const defaultUser = { user: undefined, role: 'anonymous' };
        this._user = state.user ? state.user.currentUser || defaultUser : defaultUser;
        this._email = state.emails ? state.emails.currentEmail || {} : {};
    }
}

window.customElements.define('my-admin-single-email', MyAdminSingleEmail);
