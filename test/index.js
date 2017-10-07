import { expect } from 'chai';
import { test } from '../src/';

describe('test', () => {
  it('should return "Test message!"', () => {
    expect(test()).to.equal('Test message!');
  });
});
