import {getReleaseFor} from './_releases.js';
import { getProject } from './_project.js';

export async function get(req, res, next) {
    const project = await getProject(req.params.project).get();
    const release = await getReleaseFor(
        req.params.project,
        req.params.release
    ).get();

    const data = release.data();
    const email = (await data.email.get()).data();

    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
        project: {
            ...project.data(),
            slug: project.id,
        },
        release: {
            ...data,
            date: data.date.toDate(),
            email: {
                ...email,
                received: email.received ? email.received.toDate() : data.date.toDate(),
            },
        },
    }));
}
