/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sequelize from '../sequelize';
// import User from './User';
// import UserLogin from './UserLogin';
// import UserClaim from './UserClaim';
// import UserProfile from './UserProfile';

import PushSubscription from './PushSubscription';
import Project from './Project';
import Release from './Release';
import Email from './Email';

// User.hasMany(UserLogin, {
//   foreignKey: 'userId',
//   as: 'logins',
//   onUpdate: 'cascade',
//   onDelete: 'cascade',
// });

// User.hasMany(UserClaim, {
//   foreignKey: 'userId',
//   as: 'claims',
//   onUpdate: 'cascade',
//   onDelete: 'cascade',
// });

// User.hasOne(UserProfile, {
//   foreignKey: 'userId',
//   as: 'profile',
//   onUpdate: 'cascade',
//   onDelete: 'cascade',
// });

const ProjectRelease = Project.hasMany(Release);
const ProjectPush = Project.hasMany(PushSubscription);
const ReleaseEmail = Release.hasOne(Email);

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export {
  // User,
  // UserLogin,
  // UserClaim,
  // UserProfile,
  Email,
  PushSubscription,
  Release,
  ReleaseEmail,
  Project,
  ProjectRelease,
  ProjectPush,
};
