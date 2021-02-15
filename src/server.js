import * as functions from 'firebase-functions';

let server;
export * from './functions';

const dev = process.env.IIOY_DEV === 'true';
if (dev && process.env.NODE_ENV === 'development') {
	(function() {
		const sirv = require('sirv');
		const express = require('express');
		const compression = require('compression');
		const sapper = require('@sapper/server');

		const app = express() // You can also use Express
		app.use(compression({ threshold: 0 }))
		app.use(sirv('static', {dev}))
		app.use(sapper.middleware())
		app.listen(3000, err => {
			if (err) console.log('error', err);
		})
	}());
}
else {
	server = functions.runWith({
		timeoutSeconds: 5,
		memory: '128MB',
	}).https.onRequest(async (req, res) => {
		const sapper = await import('@sapper/server');
		req.baseUrl = '';
		return sapper.middleware()(req, res);
	});
}

export {server};
