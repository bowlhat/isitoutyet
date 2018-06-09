import { resolver, defaultArgs } from 'graphql-sequelize';

import PushSubscriptionType from '../types/PushSubscriptionType';
import PushSubscription from '../models/PushSubscription';

const subscription = {
  type: PushSubscriptionType,
  args: defaultArgs(PushSubscription),
  resolve: resolver(PushSubscription),
};

export default subscription;
