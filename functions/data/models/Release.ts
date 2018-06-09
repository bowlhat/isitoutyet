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

const Release = Model.define('release', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },

  // project: {
  //   type: DataType.UUID
  // },
  //
  // email: {
  //   type: DataType.UUID,
  // },

  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },

  version: {
    type: Sequelize.STRING(50),
    defaultValue: '',
  },

  islts: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },

  codename: {
    type: Sequelize.STRING(255),
    defaultValue: '',
  },

  beta: {
    type: Sequelize.STRING(255),
    defaultValue: '',
  },
});

export default Release;
