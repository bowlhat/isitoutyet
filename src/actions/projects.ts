import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { firestore } from '../firebase';
import { RootState } from '../store';
import { ProjectsList, Project } from '../reducers/projects';
export const GET_ALL_PROJECTS = 'GET_ALL_PROJECTS';
export const GET_PROJECT = 'GET_PROJECT';

export interface ProjectsActionGetAllProjects extends Action<'GET_ALL_PROJECTS'> {projects: ProjectsList};
export interface ProjectsActionGetProject extends Action<'GET_PROJECT'> {project: Project};
export type ProjectsAction = ProjectsActionGetAllProjects | ProjectsActionGetProject;

type ThunkResult = ThunkAction<void, RootState, undefined, ProjectsAction>;

export const getAllProjects: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        const snapshot = await firestore.collection('projects').get();

        const projects: ProjectsList = snapshot.docs.reduce((obj: ProjectsList, item: any) => {
            const project = item.data();
            if (project.slug) {
                obj[project.slug] = project;
            } else if (item.id) {
                obj[item.id] = project;
            }
            return obj
        }, {} as ProjectsList);

        dispatch({
            type: GET_ALL_PROJECTS,
            projects
        });
    } catch (e) {
        console.log(`Error fetching all projects:`, e);
    }
};

export const getProject: ActionCreator<ThunkResult> = (projectId: string) => async (dispatch) => {
    try {
        const snapshot = await firestore
            .collection('projects')
            .doc(projectId)
            .get()

        if (!snapshot.exists) {
            throw new Error(`Project does not exist.`);
        }
    
        dispatch({
            type: GET_PROJECT,
            project: {
                ...snapshot.data(),
                slug: snapshot.id,
                exists: true,
            }
        });
    } catch (e) {
        console.log(`Error fetching project '${projectId}':`, e);
    }
};