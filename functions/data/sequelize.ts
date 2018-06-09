// @flow
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as functions from 'firebase-functions';

import Sequelize, {Op, OperatorsAliases} from 'sequelize';

let postgresUrl = 'postgresql://dllewellyn:test@localhost/localhost';
const config = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'iioy',
  password: 'iioy',
  database: 'localhost',
}
if (functions.config().postgres) {
  config.host = `/cloudsql/${functions.config().postgres.instancename}`;
  config.username = functions.config().postgres.username;
  config.password = functions.config().postgres.password;
  config.database = functions.config().postgres.database;
}

const sequelize = new Sequelize({
  ...config,
  operatorsAliases: {...Op},
  define: {
    freezeTableName: true,
  },
  dialectOptions: {
    ssl: false,
  },
});

export default sequelize;
