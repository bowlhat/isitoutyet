const withId = (transactionId: string) => (message: string) => `${transactionId}: ${message}`;
const log = (level: string) => console[level] || console.log; // eslint-disable-line no-console

export {log, withId};
