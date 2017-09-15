import test from 'ava';
import sinon from 'sinon';
import { asyncSum } from './index';

test('service db', async t => {
  const a = 1;
  const b = 2;
  const expected = 3;
  const actual = await asyncSum(a, b);
  t.is(actual, expected);
});
