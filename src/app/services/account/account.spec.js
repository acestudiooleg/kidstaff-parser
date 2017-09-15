import test from 'ava';
import account from './index';

test('roro is pass or not', t => {
  const actual = 2;
  const expected = 2;
  t.is(actual, expected);
});
