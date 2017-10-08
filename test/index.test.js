import { test } from '../src/';

describe('test', () => {
  it('should return "Test message!"', () => {
    expect(test()).toEqual('Test message!');
  });
});
