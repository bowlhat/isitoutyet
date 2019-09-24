import * as functions from 'firebase-functions';

import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = express() // You can also use Express
	.use(compression({ threshold: 0 }))
	.use(sirv('static', { dev }))
	.use(sapper.middleware())
if (PORT) {
	app.listen(PORT, err => {
		if (err) console.log('error', err);
	})
}

export const server = functions.runWith({
	timeoutSeconds: 45,
	memory: '256MB',
}).https.onRequest(app);

export * from './functions';