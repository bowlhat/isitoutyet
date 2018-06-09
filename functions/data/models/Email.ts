/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Sequelize from 'sequelize';
import Model from '../sequelize';

const Email = Model.define('email', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },

  sentto: {
    type: Sequelize.STRING(255),
  },

  sentfrom: {
    type: Sequelize.STRING(255),
  },

  subject: {
    type: Sequelize.STRING(255),
  },

  received: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },

  body: {
    type: Sequelize.TEXT,
  },
});

export default Email;
