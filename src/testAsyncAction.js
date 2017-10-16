import { isEqual } from 'lodash';
import * as error from './error';

export function testAsyncAction(options = {}) {
  const { action, payload, mocks = {}, expected = {}, done } = options;
  const { state = {}, getters = {} } = mocks;
  const { commits = [], dispatches = [] } = expected;
  const totalExpectedCount = commits.length + dispatches.length;
  let commitCount = 0;
  let dispatchCount = 0;

  if (!done) {
    throw new Error(error.NO_DONE_CALLBACK);
  }
  if (!action) {
    done();
    throw new Error(error.NO_ACTION);
  }
  if (totalExpectedCount === 0) {
    done();
    throw new Error(error.NO_EXPECTATIONS);
  }

  const commit = (calledType, calledPayload) => {
    const { type: expectedType, payload: expectedPayload } = commits[commitCount];

    if (calledType !== expectedType) {
      done();
      throw new Error(error.INVALID_COMMIT_CALLED);
    }
    if (!expectedPayload && calledPayload) {
      done();
      throw new Error(error.COMMIT_PAYLOAD_NOT_EXPECTED);
    }
    if (expectedPayload && !isEqual(calledPayload, expectedPayload)) {
      done();
      throw new Error(error.INVALID_COMMIT_PAYLOAD);
    }

    commitCount += 1;

    if (commitCount + dispatchCount === totalExpectedCount) {
      done();
    }
  };

  const dispatch = (calledType, calledPayload) => {
    const { type: expectedType, payload: expectedPayload } = dispatches[dispatchCount];

    if (calledType !== expectedType) {
      done();
      throw new Error(error.INVALID_DISPATCH_CALLED);
    }
    if (!expectedPayload && calledPayload) {
      done();
      throw new Error(error.DISPATCH_PAYLOAD_NOT_EXPECTED);
    }
    if (expectedPayload && !isEqual(calledPayload, expectedPayload)) {
      done();
      throw new Error(error.INVALID_DISPATCH_PAYLOAD);
    }

    dispatchCount += 1;

    if (commitCount + dispatchCount === totalExpectedCount) {
      done();
    }
  };

  action({ state, getters, commit, dispatch }, payload);
}
