import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { QueryDocumentSnapshot } from '@firebase/firestore-types';

import { firestore } from '../firebase';
import { RootState } from '../store';
import { EmailsList, Email } from '../reducers/emails';

export const GET_LATEST_EMAILS = 'GET_LATEST_EMAILS';
export const GET_EMAIL = 'GET_EMAIL';

import { AppActionUpdatePage, UPDATE_PAGE } from './app';

export interface EmailsActionGetLatestEmails extends Action<'GET_LATEST_EMAILS'> {emails: EmailsList};
export interface EmailsActionGetEmail extends Action<'GET_EMAIL'> {currentEmail: Email};
export type EmailsAction = AppActionUpdatePage | EmailsActionGetLatestEmails | EmailsActionGetEmail;

type ThunkResult = ThunkAction<void, RootState, undefined, EmailsAction>;

export const getLatestEmails: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        const snapshot = await firestore.collection(`emails`).orderBy(`received`, `desc`).limit(10).get();

        const emails: EmailsList = snapshot.docs.reduce((obj: EmailsList, item: QueryDocumentSnapshot) => {
            const email = item.data();
            if (email.slug) {
                obj[email.slug] = email;
            } else if (item.id) {
                obj[item.id] = email;
            }
            return obj
        }, {} as EmailsList);

        dispatch({
            type: GET_LATEST_EMAILS,
            emails
        });
    } catch (e) {
        console.log(`Error fetching latest emails:`, e);
    }
};

export const getEmail: ActionCreator<ThunkResult> = (emailId: string) => async (dispatch) => {
    try {
        const snapshot = await firestore
            .collection('emails')
            .doc(emailId)
            .get()

        if (!snapshot.exists) {
            throw new Error(`Email does not exist.`);
        }
    
        dispatch({
            type: GET_EMAIL,
            currentEmail: {
                ...snapshot.data(),
            }
        });
    } catch (e) {
        console.log(`Error fetching email '${emailId}':`, e);
        await import('../components/my-view404');
        dispatch({
            type: UPDATE_PAGE,
            page: 'view404'
        });
    }
};