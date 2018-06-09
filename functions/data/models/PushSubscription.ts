import Sequelize from 'sequelize';
import Model from '../sequelize';

const PushSubscription = Model.define('pushSubscription', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },

  subscription: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

export default PushSubscription;
