import { testAsyncAction } from '../src/';
import * as error from '../src/error';

function asyncAction(fn) {
  return (args) => { setTimeout(fn(args), 100); };
}

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
});
