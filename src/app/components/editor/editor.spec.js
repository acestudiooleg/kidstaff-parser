import test from 'ava';
import sinon from 'sinon';
import { mount, tick } from '@/../test/helpers';
import Editor from './index';

test('renders', async t => {
  const name = 'hello world';

  // holder - jQuery wrapper
  const {vm, holder} = mount(Editor, {name});

  t.is(vm.name, name);
  t.is(vm.$el.textContent, `Editor - ${name}`);
  t.is(holder.html(), `Editor - ${name}`);
  t.is(holder.attr('class'), 'Editor-class');

  holder.click();
  await tick(); // rerender

  holder.debug('its a dom');

  t.is(vm.name, newName);
  t.is(vm.$el.textContent, `Editor - ${newName}`);
  t.is(holder.html(), `Editor - ${newName}`);

});