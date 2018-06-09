import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
} from 'graphql';

import { resolver } from 'graphql-sequelize';
import DateType from 'graphql-date';

import { Release, ReleaseEmail } from '../models';
import EmailType from './EmailType';

const ReleaseType = new ObjectType({
  name: 'Release',
  fields: {
    id: { type: ID },
    version: { type: StringType },
    codename: { type: StringType },
    beta: { type: StringType },
    islts: { type: BooleanType },
    date: { type: DateType },
    email: {
      type: EmailType,
      resolve: resolver(ReleaseEmail),
    },
  },
});

export default ReleaseType;
