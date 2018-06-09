/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import project from './queries/project';
import projects from './queries/projects';
import release from './queries/release';
// import releases from './queries/releases';
// import email from './queries/email';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      // email, // Access this through release item
      project,
      projects,
      release,
      // releases // No need for list of releases. Access through project/projects
    },
  }),
});

export default schema;
