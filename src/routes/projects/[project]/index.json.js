import {getProject} from './_project.js';
import { getReleasesFor } from './_releases.js';

export async function get(req, res, next) {
    const project = await getProject(req.params.project).get();
    const releases = await getReleasesFor(req.params.project).get();

    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
        project: {
            ...project.data(),
            slug: project.id,
        },
        releases: releases.docs.map(release => {
            const data = release.data();
            return {
                ...data,
                email: data.email.id,
                id: release.id,
            }
        })
    }));
}
