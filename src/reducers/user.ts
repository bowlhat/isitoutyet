import { Reducer } from 'redux';
import { User } from '@firebase/auth-types';

import { SET_USER } from '../actions/user.js';
import { RootAction } from '../store';

export interface UserState {
  user?: User;
  role: string;
}

const INITIAL_STATE: UserState = {
    user: undefined,
    role: '',
};

const userReducer: Reducer<UserState, RootAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    default:
      return state;
  }
};

export default userReducer;
