import { testAsyncAction } from '../src/testAsyncAction';
import { asyncAction } from './support';
import * as error from '../src/error';

describe('testAsyncAction', () => {
  describe('when done is not provided', () => {
    const expected = {
      commits: [
        { type: 'test' },
      ],
    };
    const action = asyncAction(({ commit }) => {
      commit('test');
    });

    it('throws NO_DONE_CALLBACK', () => {
      expect(() => {
        testAsyncAction({ action, expected });
      }).toThrowError(error.NO_DONE_CALLBACK);
    });
  });

  describe('when no expectations are provided', () => {
    const expected = {};
    const action = asyncAction(({ commit }) => {
      commit('test');
    });

    it('throws NO_EXPECTATIONS', done => {
      expect(() => {
        testAsyncAction({ action, expected, done });
      }).toThrowError(error.NO_EXPECTATIONS);
    });
  });

  describe('when one commit with no payload is expected', () => {
    const expected = {
      commits: [
        { type: 'test' },
      ],
    };

    describe('when action calls one commit with no payload', () => {
      const action = asyncAction(({ commit }) => {
        commit('test');
      });

      it('does not throw', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).not.toThrow();
      });
    });

    describe('when action calls one commit with payload', () => {
      const action = asyncAction(({ commit }) => {
        commit('test', { arg: 'arg' });
      });

      it('throws COMMIT_PAYLOAD_NOT_EXPECTED', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.COMMIT_PAYLOAD_NOT_EXPECTED);
      });
    });

    describe('when action calls wrong commit', () => {
      const action = asyncAction(({ commit }) => {
        commit('bad');
      });

      it('throws INVALID_COMMIT_CALLED', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.INVALID_COMMIT_CALLED);
      });
    });
  });

  describe('when one commit with payload is expected', () => {
    const expected = {
      commits: [
        { type: 'test', payload: { arg: 'arg' } },
      ],
    };

    describe('when action calls one commit with payload', () => {
      const action = asyncAction(({ commit }) => {
        commit('test', { arg: 'arg' });
      });

      it('does not throw', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).not.toThrow();
      });
    });

    describe('when action calls one commit with wrong payload', () => {
      const action = asyncAction(({ commit }) => {
        commit('test', { arg: 'bad' });
      });

      it('throws INVALID_COMMIT_PAYLOAD', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.INVALID_COMMIT_PAYLOAD);
      });
    });

    describe('when action calls wrong commit', () => {
      const action = asyncAction(({ commit }) => {
        commit('bad', { arg: 'arg' });
      });

      it('throws INVALID_COMMIT_CALLED', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.INVALID_COMMIT_CALLED);
      });
    });
  });

  describe('when multiple commits are expected', () => {
    const expected = {
      commits: [
        { type: 'commit1' },
        { type: 'commit2', payload: { arg: 'arg' } },
        { type: 'commit3', payload: 3 },
      ],
    };

    describe('when action calls multiple commits', () => {
      const action = asyncAction(({ commit }) => {
        commit('commit1');
        commit('commit2', { arg: 'arg' });
        commit('commit3', 3);
      });

      it('does not throw', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).not.toThrow();
      });
    });

    describe('when action calls unexpected commit', () => {
      const action = asyncAction(({ commit }) => {
        commit('commit1');
        commit('commit4', { arg: 'arg' });
      });

      it('throws INVALID_COMMIT_CALLED', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.INVALID_COMMIT_CALLED);
      });
    });
  });

  describe('when one dispatch with no payload is expected', () => {
    const expected = {
      dispatches: [
        { type: 'test' },
      ],
    };

    describe('when action calls one dispatch with no payload', () => {
      const action = asyncAction(({ dispatch }) => {
        dispatch('test');
      });

      it('does not throw', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).not.toThrow();
      });
    });

    describe('when action calls one dispatch with payload', () => {
      const action = asyncAction(({ dispatch }) => {
        dispatch('test', { arg: 'arg' });
      });

      it('throws DISPATCH_PAYLOAD_NOT_EXPECTED', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.DISPATCH_PAYLOAD_NOT_EXPECTED);
      });
    });

    describe('when action calls wrong dispatch', () => {
      const action = asyncAction(({ dispatch }) => {
        dispatch('bad');
      });

      it('throws INVALID_DISPATCH_CALLED', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.INVALID_DISPATCH_CALLED);
      });
    });
  });

  describe('when one dispatch with payload is expected', () => {
    const expected = {
      dispatches: [
        { type: 'test', payload: { arg: 'arg' } },
      ],
    };

    describe('when action calls one dispatch with payload', () => {
      const action = asyncAction(({ dispatch }) => {
        dispatch('test', { arg: 'arg' });
      });

      it('does not throw', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).not.toThrow();
      });
    });

    describe('when action calls one dispatch with wrong payload', () => {
      const action = asyncAction(({ dispatch }) => {
        dispatch('test', { arg: 'bad' });
      });

      it('throws INVALID_DISPATCH_PAYLOAD', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.INVALID_DISPATCH_PAYLOAD);
      });
    });

    describe('when action calls wrong dispatch', () => {
      const action = asyncAction(({ dispatch }) => {
        dispatch('bad', { arg: 'arg' });
      });

      it('throws INVALID_DISPATCH_CALLED', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.INVALID_DISPATCH_CALLED);
      });
    });
  });

  describe('when multiple dispatches are expected', () => {
    const expected = {
      dispatches: [
        { type: 'dispatch1' },
        { type: 'dispatch2', payload: { arg: 'arg' } },
        { type: 'dispatch3', payload: 3 },
      ],
    };

    describe('when action calls multiple dispatches', () => {
      const action = asyncAction(({ dispatch }) => {
        dispatch('dispatch1');
        dispatch('dispatch2', { arg: 'arg' });
        dispatch('dispatch3', 3);
      });

      it('does not throw', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).not.toThrow();
      });
    });

    describe('when action calls unexpected dispatch', () => {
      const action = asyncAction(({ dispatch }) => {
        dispatch('dispatch1');
        dispatch('dispatch4', { arg: 'arg' });
      });

      it('throws INVALID_DISPATCH_CALLED', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.INVALID_DISPATCH_CALLED);
      });
    });
  });

  describe('when one commit and one dispatch are expected', () => {
    const expected = {
      commits: [
        { type: 'commit' },
      ],
      dispatches: [
        { type: 'dispatch' },
      ],
    };

    describe('when action calls one commit and one dispatch', () => {
      const action = asyncAction(({ commit, dispatch }) => {
        commit('commit');
        dispatch('dispatch');
      });

      it('does not throw', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).not.toThrow();
      });
    });

    describe('when action calls unexpected action', () => {
      const action = asyncAction(({ commit, dispatch }) => {
        commit('bad');
        dispatch('dispatch');
      });

      it('throws INVALID_COMMIT_CALLED', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.INVALID_COMMIT_CALLED);
      });
    });

    describe('when action calls unexpected dispatch', () => {
      const action = asyncAction(({ commit, dispatch }) => {
        commit('commit');
        dispatch('bad');
      });

      it('throws INVALID_DISPATCH_CALLED', done => {
        expect(() => {
          testAsyncAction({ action, expected, done });
        }).toThrowError(error.INVALID_DISPATCH_CALLED);
      });
    });
  });

  describe('when state mock is passed', () => {
    const mocks = {
      state: {
        test: 'test',
      },
    };
    const expected = {
      commits: [
        { type: 'commit', payload: 'test' },
      ],
    };

    describe('when action references state', () => {
      const action = asyncAction(({ state, commit }) => {
        commit('commit', state.test);
      });

      it('has access to the mocked state', done => {
        expect(() => {
          testAsyncAction({ action, mocks, expected, done })
        }).not.toThrow();
      });
    });
  });

  describe('when getters mock is passed', () => {
    const mocks = {
      getters: {
        test() { return 'test'; },
      },
    };
    const expected = {
      commits: [
        { type: 'commit', payload: 'test' },
      ],
    };

    describe('when action references getters', () => {
      const action = asyncAction(({ getters, commit }) => {
        commit('commit', getters.test());
      });

      it('has access to the mocked getters', done => {
        expect(() => {
          testAsyncAction({ action, mocks, expected, done })
        }).not.toThrow();
      });
    });
  });

  describe('when payload is passed', () => {
    const payload = { test: 'test' };
    const expected = {
      commits: [
        { type: 'commit', payload: 'test' },
      ],
    };

    describe('when action references payload', () => {
      const action = asyncAction(({ commit }) => {
        commit('commit', payload.test);
      });

      it('has access to the payload', done => {
        expect(() => {
          testAsyncAction({ action, payload, expected, done })
        }).not.toThrow();
      });
    });
  });
});
