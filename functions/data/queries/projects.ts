import { GraphQLList as List } from 'graphql';

import { resolver, defaultListArgs } from 'graphql-sequelize';

import ProjectType from '../types/ProjectType';
import Project from '../models/Project';

const projects = {
  type: new List(ProjectType),
  args: defaultListArgs(),
  resolve: resolver(Project),
};

export default projects;
