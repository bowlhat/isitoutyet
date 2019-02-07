import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { firestore } from '../firebase';
import { RootState } from '../store';
import { Release } from '../reducers/releases';
import { UPDATE_PAGE } from './app';
export const GET_ALL_RELEASES = 'GET_ALL_RELEASES';
export const GET_RELEASE = 'GET_RELEASE';

import {AppActionUpdatePage} from './app';
import { Email } from '../reducers/email';
export interface ReleasesActionGetAllReleases extends Action<'GET_ALL_RELEASES'> {releases: Release[]};
export interface ReleasesActionGetRelease extends Action<'GET_RELEASE'> {release: Release};
export type ReleasesAction = AppActionUpdatePage | ReleasesActionGetAllReleases | ReleasesActionGetRelease;

type ThunkResult = ThunkAction<void, RootState, undefined, ReleasesAction>;

export const getAllReleases: ActionCreator<ThunkResult> = (projectId) => async (dispatch) => {
    try {
        const projectDoc = firestore.collection('projects').doc(projectId);
        const projectSnapshot = await projectDoc.get();
        
        if (!projectSnapshot.exists) {
            throw new Error(`Project does not exist.`);
        }
    
        const snapshot = await projectDoc
            .collection('releases')
            .orderBy('date', 'desc')
            .get();

        const releases: Release[] = snapshot.docs.map((item: any) => { return {
            ...item.data(),
            id: item.id,
        }});

        dispatch({
            type: GET_ALL_RELEASES,
            releases
        });
    } catch (e) {
        console.log(`Error fetching all releases for project '${projectId}':`, e);
        await import('../components/my-view404');
        dispatch({
            type: UPDATE_PAGE,
            page: 'view404'
        });
    }
};

export const getRelease: ActionCreator<ThunkResult> = (projectId, releaseId) => async (dispatch) => {
    try {
        const projectDoc = firestore.collection('projects').doc(projectId);
        const projectSnapshot = await projectDoc.get();
        
        if (!projectSnapshot.exists) {
            throw new Error(`Project '${projectId}' does not exist.`);
        }

        const snapshot = await projectDoc
            .collection('releases')
            .doc(releaseId)
            .get();

        if (!snapshot.exists) {
            throw new Error(`Release does not exist.`);
        }

        const release = snapshot.data();
        const doc = await firestore.doc(release.email.path).get();

        const email: Email = doc.data();
        if (!email) {
            throw new Error(`No email data returned.`)
        }

        dispatch({
            type: GET_RELEASE,
            release: {
                ...snapshot.data(),
                id: snapshot.id,
                email,
                exists: true,
            }
        });
    } catch (e) {
        console.log(`Error fetching release with ID '${releaseId}':`, e);
        try {
            await import('../components/my-view404');
            dispatch({
                type: UPDATE_PAGE,
                page: 'view404'
            });
        } catch (e) {
            console.log(`Error returning 404 page:`, e);
        }
    }
};