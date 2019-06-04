import { Reducer } from 'redux';
import { Timestamp } from '@firebase/firestore-types';

import {
  GET_LATEST_EMAILS,
  GET_EMAIL,
} from '../actions/emails';
import { RootAction } from '../store';

export interface Email {
    received?: Timestamp;
    subject?: string;
    body?: string;
};
export interface EmailsState {
    emails: EmailsList;
    currentEmail: Email;
    error: string;
}
export interface EmailsList {
    [index:string]: Email;
}

const INITIAL_STATE: EmailsState = {
    emails: {},
    currentEmail: {},
    error: '',
};

const emails: Reducer<EmailsState, RootAction> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_LATEST_EMAILS:
            return {
                ...state,
                emails: action.emails
            };
        case GET_EMAIL:
            return {
                ...state,
                currentEmail: action.currentEmail
            };
        default:
            return state;
    }
};
  
export default emails;
  