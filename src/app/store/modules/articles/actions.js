/* ============
 * Actions for the articles module
 * ============
 */
import {articles, source, myjson} from '@/services/db';
import {getArticles, convertToJSON} from '@/services/converter';

export const uploadXML = ({ commit }, xml) => {
  const jsonData = convertToJSON(xml);
  const arts = getArticles(xml);

  Promise.all([
    source.insert({data: xml}, true),
    myjson.insert({data: JSON.stringify(jsonData)}, true),
    articles.bulkInsert(arts)
  ])
  .then(() => commit('setArticles', arts));
};

export default {
  uploadXML,
};

