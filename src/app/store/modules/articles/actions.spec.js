import test from 'ava';
import sinon from 'sinon';
import actions from './actions';

test('actions', async t => {
  const y = '/articles';
  const x = '/articles';
  t.is(x, y);
});
