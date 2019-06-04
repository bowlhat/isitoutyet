import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { firestore } from '../firebase';
import { RootState } from '../store';
import { Email } from '../reducers/emails';
import { Release } from '../reducers/releases';

export const GET_ALL_RELEASES = 'GET_ALL_RELEASES';
export const GET_RELEASE = 'GET_RELEASE';

export interface ReleasesActionGetAllReleases extends Action<'GET_ALL_RELEASES'> {releases: Release[]};
export interface ReleasesActionGetRelease extends Action<'GET_RELEASE'> {release: Release};
export type ReleasesAction = ReleasesActionGetAllReleases | ReleasesActionGetRelease;

type ThunkResult = ThunkAction<void, RootState, undefined, ReleasesAction>;

export const getAllReleases: ActionCreator<ThunkResult> = (projectId: string) => async (dispatch) => {
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
    }
};

export const getRelease: ActionCreator<ThunkResult> = (projectId: string, releaseId: string) => async (dispatch) => {
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
        if (!release) {
            throw new Error(`Release data cannot be loaded.`);
        }

        const doc = await firestore.doc(release.email.path).get();
        if (!doc) {
            throw new Error(`Release email document cannot be loaded.`);
        }
        
        const email: Email = <Email> doc.data();
        if (!email) {
            throw new Error(`Release email data cannot be loaded.`)
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
    }
};