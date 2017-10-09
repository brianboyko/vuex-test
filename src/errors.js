export default class VuexTestError extends Error {
  constructor(done, ...args) {
    super(...args);
    done();
  }
};

export const NO_EXPECTATIONS = 'No expected commits or dispatches provided.';
export const NO_DONE_CALLBACK = 'No done callback provided.';
export const COMMIT_PAYLOAD_NOT_EXPECTED = 'Commit was called with payload, but no payload was expected.';
export const INVALID_COMMIT_CALLED = 'An invalid commit was called or a commit was called out of order.';
export const INVALID_COMMIT_PAYLOAD = 'A commit was called with an invalid payload.';