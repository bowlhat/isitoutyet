import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
} from 'graphql';

// import DateType from './DateType';
import DateType from 'graphql-date';

const EmailType = new ObjectType({
  name: 'Email',
  fields: {
    id: { type: ID },
    sentto: { type: StringType },
    sentfrom: { type: StringType },
    subject: { type: StringType },
    received: { type: DateType },
    body: { type: StringType },
  },
});

export default EmailType;
