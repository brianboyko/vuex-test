import VuexTestError, * as error from './error';
import { isEqual } from 'lodash';

function testAsyncAction(options) {
  const { action, payload, done,  mocks = {}, expected = {} } = options;
  const { state = {}, getters = {} } = mocks;
  const { commits = [], dispatches = [] } = expected;
  const totalExpectedCount = commits.length;
  let commitCount = 0;

  if (!done) {
    throw new VuexTestError(done, error.NO_DONE_CALLBACK);
  }
  if (totalExpectedCount === 0) {
    throw new VuexTestError(done, error.NO_EXPECTATIONS);
  }

  const commit = (calledType, calledPayload) => {
    const { type: expectedType, payload: expectedPayload } = commits[commitCount];

    if (calledType !== expectedType) {
      throw new VuexTestError(done, error.INVALID_COMMIT_CALLED);
    }
    if (!expectedPayload && calledPayload) {
      throw new VuexTestError(done, error.COMMIT_PAYLOAD_NOT_EXPECTED);
    }
    if (expectedPayload && !isEqual(calledPayload, expectedPayload)) {
      throw new VuexTestError(done, error.INVALID_COMMIT_PAYLOAD);
    }

    commitCount += 1;

    if (commitCount === totalExpectedCount) {
      done();
    }
  };

  action({ commit }, payload);
}

export { testAsyncAction};
