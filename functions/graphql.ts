import * as functions from 'firebase-functions';
import express from 'express';
import expressGraphQL from 'express-graphql';

import models from './data/models';
import schema from './data/schema';

const app = express();

app.use(
    '/api/graphql',
    expressGraphQL(req => ({
        schema,
        graphiql: false,
        rootValue: { request: req },
        pretty: false,
    })),
);

export const graphQLHandler = functions.https.onRequest(app);