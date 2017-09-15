import test from 'ava';
import sinon from 'sinon';
import { mount, tick } from '@/../test/helpers';
import Articles from './index';

test('page', async t => {
  const name = 'hello world';

  // holder - jQuery wrapper
  const {vm, holder} = mount(Articles, {name});

  t.is(vm.name, name);
  t.is(vm.$el.textContent, `Articles - ${name}`);
  t.is(holder.html(), `Articles - ${name}`);
  t.is(holder.attr('class'), 'Articles-class');

  holder.click();
  await tick(); // rerender

  holder.debug('its a dom');

  t.is(vm.name, newName);
  t.is(vm.$el.textContent, `Articles - ${newName}`);
  t.is(holder.html(), `Articles - ${newName}`);

});