export const queries = {
    AllProjects: `
        query Projects {
            projects {
                id,
                slug,
                logo,
                name
            }
        }
    `,
    Project: `
        query Project($slug: String!) {
            project(where: { slug: $slug }) {
                id,
                name,
                slug,
                logo,
                description,
                homepage,
                releases(order:"reverse:date") {
                    id,
                    codename,
                    version,
                    islts,
                    beta,
                    date
                }
            }
        }
    `,
    Release: `
        query Release($project: String!, $release: String!) {
            project(where: { slug: $project }) {
                name,
                slug,
                logo,
                description,
                homepage,
                releases(where: { id: $release }) {
                    id,
                    codename,
                    version,
                    islts,
                    beta,
                    date,
                    email {
                        received,
                        subject,
                        body
                    }
                }
            }
        }
    `,
    PushSubscription: `
        query PushSubscription($project: String!, $subscription: String!) {
            project(id: $project) {
                pushSubscriptions(where: { subscription: $subscription }) {
                    id
                }
            }
        }
    `,
}