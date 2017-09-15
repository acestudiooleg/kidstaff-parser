/* ============
 * articles Route
 * ============
 * https://router.vuejs.org/en/essentials/getting-started.html
 *
 */

import articles from '@/pages/articles';

export default {
  path: '/articles',
  name: 'articles.index',
  component: articles,

  meta: {
    hello: 'meta world',
  }
};
