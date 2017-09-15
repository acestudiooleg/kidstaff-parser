import test from 'ava';
import sinon from 'sinon';
import mutations from './mutations';

test('mutations', async t => {
  const y = '/articles';
  const x = '/articles';
  t.is(x, y);
});
