# vuex-test [![CircleCI](https://circleci.com/gh/mcmillion/vuex-test/tree/master.svg?style=svg)](https://circleci.com/gh/mcmillion/vuex-test/tree/master)

`vuex-test` is a small library of helpers intended to promote better design patterns and easier testing of Vuex actions.

> `vuex-test` is under heavy active development. Please add any bugs, requests, or other feedback to the [issue tracker](https://github.com/mcmillion/vuex-test/issues).

## Installation

Install using `yarn`:

```
yarn add --dev vuex-test
```

Install using `npm`:

```
npm install --save-dev vuex-test
```

## Usage

`vuex-test` exposes it's helpers as functions that can be imported and used in tests. Since `vuex-test` aims to be test-framework-agnostic, each helper will either throw an error if a test fails, or not throw an error if the test succeeds. You can handle this however you like in your tests. You may use ES2015 or CommonJS style imports.

Using ES2015 Modules style:

```javascript
import { testAsyncAction } from 'vuex-test';
```

Using CommonJS style:

```javascript
var testAsyncAction = require('vuex-test').testAsyncAction;
```

## Writing Testable Vuex Actions with Asynchronous Code

Correctly testing Vuex actions that involve asynchronous code requires that you adhere to one simple design principle:

> Any action that involves asynchronous code should only have side effects that are caused by either `commit` or `dispatch`.

Any side effects that happen outside of `commit` or `dispatch` *will be untestable*. This means that things like `router.push` need to happen inside of a **synchronous action**.

Let's take a look at an example Vuex action used for user login. If the user is not already logged in, it asynchronously hits an API endpoint, commits some data, and then reroutes the user to the dashboard:

```javascript
async login({ getters, commit, dispatch }, payload) {
  if (!getters.userLoggedIn()) {
    const response = await axios.post('/login', {
      user: payload.user,
      password: payload.password
    });
    commit('setCurrentUser', response.data.user);
    dispatch('redirectToDashboard');
  }
},
redirectToDashboard() {
  router.push({ name: 'Dashboard' });
},
```

## Testing a Vuex Action with Asynchronous Code

You can test an asynchronous Vuex action using `testAsyncAction`. It takes a single object providing the name of the action to be tested, test setup, and mocks needed for the test:

```javascript
{
  action, // the action being tested,
  payload, // an optional payload that should be passed to the action
  mocks: {
    state, // an object that mocks the initial state of the store
    getters, // an object that mocks getters passed into the action
  },
  expected: {
    commits, // an array of expected commits in the order that they should occur
    dispatches // an array of expected dispatched in the order that they should occur
  },
  done // a done callback provided by your test framework that gets called when the test is complete
}
```

You can specify each expected `commit` or `dispatch` as an object with a `type` and an optional `payload`:

```javascript
{
  type, // the name of a commit or dispatch that should be called
  payload // an optional payload object that should be passed to the commit or dispatch
}
```

The idea is borrowed directly from the [Vuex documentation testing page](https://vuex.vuejs.org/en/testing.html) but is improved by adding the ability to test `dispatches` and mock `getters`. `testAsyncAction` counts each `commit` and `dispatch` and matches them against expected `commits` and `dispatches`. If any of these occur out of order or with unexpected payloads, `testAsyncAction` throws an error. Since `testAsyncAction` can't know when an action is finished, it mocks `commit` and `dispatch` internally to count occurrences and compares this to the expected number of `commits` and `dispatches` provided. This means that any additional `commits` or `dispatches` that happen after successful call **will not be tested**.

Here's an example test for the login action from the previous section:

```javascript
testAsyncAction({
  action: login,
  payload: { user: 'user@email.com', password: 'password123' },
  mocks: {
    state: { user: null },
    getters: {
      userLoggedIn() {
        return false;
      }
    }
  },
  expected: {
    commits: [
      { type: 'setCurrentUser', payload: expectedUserResponse }
    ],
    dispatches: [
      { type: 'redirectToDashboard' }
    ]
  },
  done
});
```

`testAsyncAction` will throw an error if any of the tests fail, or not throw if the test passes.
