const withId = (transactionId) => (message) => `${transactionId}: ${message}`;
const log = (level) => console[level] || console.log; // eslint-disable-line no-console

export {log, withId};
