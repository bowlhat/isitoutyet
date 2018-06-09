import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLList as List,
  GraphQLString as StringType,
} from 'graphql';

import { resolver, defaultListArgs } from 'graphql-sequelize';

import { Project, ProjectRelease, ProjectPush } from '../models';
import ReleaseType from './ReleaseType';
import PushSubscriptionType from './PushSubscriptionType';

const ProjectType = new ObjectType({
  name: 'Project',
  fields: {
    id: { type: ID },
    slug: { type: StringType },
    logo: { type: StringType },
    name: { type: StringType },
    description: { type: StringType },
    homepage: { type: StringType },
    releases: {
      type: new List(ReleaseType),
      args: defaultListArgs(),
      resolve: resolver(ProjectRelease),
    },
    pushSubscriptions: {
      type: new List(PushSubscriptionType),
      args: defaultListArgs(),
      resolve: resolver(ProjectPush),
    },
  },
});

export default ProjectType;
