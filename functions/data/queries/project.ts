import { resolver, defaultArgs } from 'graphql-sequelize';

import ProjectType from '../types/ProjectType';
import Project from '../models/Project';

const project = {
  type: ProjectType,
  args: defaultArgs(Project),
  resolve: resolver(Project),
};

export default project;
