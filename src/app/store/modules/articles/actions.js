/* ============
 * Actions for the articles module
 * ============
 */
import {articles, myjson} from '@/services/db';
import {getArticles, extractArticles, injectArticles, convertToJSON, makeXML} from '@/services/converter';
import _ from 'lodash';

export const uploadXML = ({ commit, dispatch }, xml) => {
  const jsonData = convertToJSON(xml);
  const arts = getArticles(xml);

  Promise.all([
    myjson.insert({data: JSON.stringify(jsonData)}, true),
    articles.bulkInsert(arts)
  ])
  .then(() => dispatch('getArticlesFromDB'));
};


export const getArticlesFromDB = async ({ commit }) => {
  const arts = await articles.find('id > 0');
  commit('setArticles', arts);
};

export const saveArticle = async ({commit}, art) => {
  const a = {...art};
  delete a.id;
  await articles.update(art.id, a);
  commit('updateArticle', art);
};

export const saveAllData = async () => {
  const arts = await articles.find('id > 0');
  const myjsonDataStr = await myjson.find('id=1');
  const artsjson = JSON.parse(myjsonDataStr[0].data);
  const newJson = injectArticles(arts, artsjson);
  const myjsonstr = JSON.stringify(newJson);
  const r = await myjson.update(1, {data: myjsonstr});
  return r;
};

export const getNewXml = async () => {
  const myjsonDataStr = await myjson.find('id=1');
  const artsjson = JSON.parse(myjsonDataStr[0].data);
  return makeXML(artsjson);
};

export const resetToOriginalArticle = async ({commit}, {artOriginalId, id}) => {
  const originalJson = await myjson.find('id=1');
  const original = JSON.parse(originalJson[0].data);
  const arts = extractArticles(original);
  const art = _.find(arts, {_id: artOriginalId});
  if (!art) {
    return alert('error - original article is not found');
  }
  await articles.update(id, art);
  const arto = {...art, id};
  commit('updateArticle', arto);
  return arto;
};

export default {
  uploadXML,
  getArticlesFromDB,
  saveArticle,
  resetToOriginalArticle,
  getNewXml,
  saveAllData
};

