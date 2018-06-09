import * as functions from 'firebase-functions';
import * as prpl from 'prpl-server';
import express from 'express';
import * as rendertron from 'rendertron-middleware';

const app = express();

app.use(rendertron.makeMiddleware({
  proxyUrl: 'https://render-tron.appspot.com/render',
  injectShadyDom: true,
}));

app.get('/*', prpl.makeHandler('./build', require('./build/polymer.json')));

export const PrplHandler = functions.https.onRequest(app);