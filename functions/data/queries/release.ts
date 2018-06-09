import { resolver, defaultArgs } from 'graphql-sequelize';

import ReleaseType from '../types/ReleaseType';
import Release from '../models/Release';

const release = {
  type: ReleaseType,
  args: defaultArgs(Release),
  resolve: resolver(Release),
};

export default release;
