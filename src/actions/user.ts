import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { User } from '@firebase/auth-types';

import { firestore } from '../firebase';
import { RootState } from '../store';
import { UserState } from '../reducers/user';

export const SET_USER = 'SET_USER';

export interface UserActionSetUser extends Action<'SET_USER'> {currentUser: UserState};
export type UserAction = UserActionSetUser;

type ThunkResult = ThunkAction<void, RootState, undefined, UserAction>;

export const setUser: ActionCreator<ThunkResult> = (user: User) => async (dispatch) => {
    try {
        const userDoc = await firestore.collection('/users').doc(user.uid).get();
        let role: string = 'anonymous';
        if (userDoc.exists) {
            role = userDoc.get('role') || 'user';
        }
        dispatch({ type: SET_USER, currentUser: { user, role } });
    } catch(e) {
        console.log(`Could not load authorisation`, e);
    }
};
