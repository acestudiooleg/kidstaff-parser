import test from 'ava';
import sinon from 'sinon';
import articles from './index';

test('route articles', async t => {
  const y = '/articles';
  const x = articles.path;
  t.is(x, y);
});
