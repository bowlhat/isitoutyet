import { GraphQLObjectType as ObjectType, GraphQLID as ID } from 'graphql';

const PushSubscriptionType = new ObjectType({
  name: 'PushSubscription',
  fields: {
    id: { type: ID },
  },
});

export default PushSubscriptionType;
