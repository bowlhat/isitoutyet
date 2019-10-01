import * as sapper from '@sapper/app';

import { firebaseConfig } from './firebase-config'
let app = firebase.initializeApp(firebaseConfig)
window.db = app.firestore()
window.messaging = app.messaging();

sapper.start({
	target: document.querySelector('#sapper')
});