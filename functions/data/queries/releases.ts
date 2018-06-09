import { GraphQLList as List } from 'graphql';

import { resolver, defaultListArgs } from 'graphql-sequelize';

import ReleaseType from '../types/ReleaseType';
import Release from '../models/Release';

const releases = {
  type: new List(ReleaseType),
  args: defaultListArgs(),
  resolve: resolver(Release),
};

export default releases;
