import { resolver, defaultArgs } from 'graphql-sequelize';

import EmailType from '../types/EmailType';
import Email from '../models/Email';

const email = {
  type: EmailType,
  args: defaultArgs(Email),
  resolve: resolver(Email),
};

export default email;
