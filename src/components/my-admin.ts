import { html, css, property } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { PageViewElement } from './page-view-element';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the actions needed by this element.
// import { getAllProjects } from '../actions/projects';
import { getLatestEmails } from '../actions/emails';
import user, { UserState } from '../reducers/user';
import emails, { EmailsList, Email } from '../reducers/emails';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

store.addReducers({
    emails,
    user,
});

class MyAdmin extends connect(store)(PageViewElement) {
    @property({type: Object})
    private _user: UserState = {
        user: undefined,
        role: '',
    };

    @property({type: Array})
    private _emails: EmailsList = {};

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

        return html`
        <section>
            <article>
                <h2>Latest Emails</h2>
                <div>
                    <ul>
                        ${Object.keys(this._emails).map((key: string) => {
                            const email: Email = this._emails[key];
                            const date: Date = email.received ? email.received.toDate() : new Date(0);
                            return html`
                            <li><a href="/admin/email/${key}">${email.subject}</a><br />${date.toLocaleDateString()} ${date.toTimeString()}</li>
                            `
                        })}
                    </ul>
                </div>
            </article>
        </section>
        `;
    }

    protected firstUpdated() {
        store.dispatch(getLatestEmails());
    }

    // This is called every time something is updated in the store.
    stateChanged(state: RootState) {
        const defaultUser = { user: undefined, role: '' };
        this._user = state.user ? state.user.currentUser || defaultUser : defaultUser;
        this._emails = state.emails ? state.emails.emails : {};
    }
}

window.customElements.define('my-admin', MyAdmin);
