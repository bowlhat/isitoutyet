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

const Project = Model.define(
  'project',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    slug: {
      type: Sequelize.STRING(128),
      defaultValue: '',
      unique: true,
    },

    name: {
      type: Sequelize.STRING(255),
      defaultValue: '',
    },

    homepage: {
      type: Sequelize.STRING(255),
      defaultValue: '',
    },

    logo: {
      type: Sequelize.STRING(255),
      defaultValue: '',
      validate: { isUrl: true },
    },

    description: {
      type: Sequelize.TEXT,
      defaultValue: '',
    },

    toaddress: {
      type: Sequelize.STRING(255),
      defaultValue: '',
      validate: { isEmail: true },
    },

    regex: {
      type: Sequelize.TEXT,
      defaultValue: '',
    },
  },
  {
    indexes: [{ fields: ['slug'] }],
  },
);

export default Project;
