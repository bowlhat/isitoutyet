// const merge = (...sources) => {
//     let target = {};
//     for (src of sources) {
//         for (key in src) {
//             target[key] = src[key];
//         }
//     }
//     return target;
// }

const minify = (query) => query.replace(/[\r\n]+[\t\s]+/g, ' ');

export default class GraphClient {
    constructor(options) {
        this.options = options;
    }

    get(query, variables) {
        return this.request(query, 'GET', JSON.stringify(variables));
    }

    post(query, variables) {
        return this.request(query, 'POST', variables);
    }

    request(query, method, variables) {
        query = minify(query);

        if (method === 'GET') {
            query = `${this.options.url}?query=${encodeURIComponent(query)}`;
            if (variables !== undefined) {
                query = `${query}&variables=${encodeURIComponent(variables)}`;
            }

            return fetch(query, {
                method,
            })
            .then(res => res.json())
            .then(json => json.data);
        }

        return fetch(this.options.url, {
            method,
            body: variables,
        })
        .then(res => res.json())
        .then(json => json.data);
    }
}