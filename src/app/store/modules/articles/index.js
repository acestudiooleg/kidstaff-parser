/* ============
 * articles Module
 * ============
 *
 */

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const logger = acts => {
  const actions = {};
  Object.keys(acts).forEach(act => {
    actions[act] = function r(...rest) {
      console.log('ACTION:', act);
      console.log('DATA:', rest[1]);
      console.log('===========================================');
      return acts[act](...rest);
    };
  });
  return {actions};
};

export default {
  namespaced: true,
  ...logger(actions),
  getters,
  mutations,
  state,
};
