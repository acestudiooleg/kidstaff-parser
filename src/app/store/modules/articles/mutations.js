/* ============
 * Mutations for the articles module
 * ============
 */
import _ from 'lodash';


export default {
  setArticles(state, arts) {
    state.list = arts;
  },
  removeArticle(state, id) {
    state.list = _.reject(state.list, {id});
  },
  updateArticle(state, art) {
    const article = _.find(state.list, {id: art.id});
    if (!article) {
      alert('error - article is not found');
    } else {
      _.assign(article, art);
    }
  }
};
