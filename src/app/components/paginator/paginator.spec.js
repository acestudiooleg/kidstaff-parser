import test from 'ava';
import sinon from 'sinon';
import { mount, tick } from '@/../test/helpers';
import Paginator from './index';

test('renders', async t => {
  const name = 'hello world';

  // holder - jQuery wrapper
  const {vm, holder} = mount(Paginator, {name});

  t.is(vm.name, name);
  t.is(vm.$el.textContent, `Paginator - ${name}`);
  t.is(holder.html(), `Paginator - ${name}`);
  t.is(holder.attr('class'), 'Paginator-class');

  holder.click();
  await tick(); // rerender

  holder.debug('its a dom');

  t.is(vm.name, newName);
  t.is(vm.$el.textContent, `Paginator - ${newName}`);
  t.is(holder.html(), `Paginator - ${newName}`);

});