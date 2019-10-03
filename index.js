const dev = process.env.IIOY_DEV === 'true';

if (dev) {
    module.exports = require('./__sapper__/dev/server/server');
} else {
    module.exports = require('./__sapper__/build/server/server');
}
