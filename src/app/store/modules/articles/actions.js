/* ============
 * Actions for the articles module
 * ============
 */
import db from '@/services/lsdb';
import {getArticles, extractArticles, injectArticles, convertToJSON, makeXML} from '@/services/converter';
import _ from 'lodash';

export const uploadXML = ({ commit, dispatch }, xml) => {
  const jsonData = convertToJSON(xml);
  console.log(jsonData);
  const arts = getArticles(xml);

  (arts || []).forEach(art => db.insert('articles', art));


  db.insert('myjson', {data: jsonData});
  db.commit();

  dispatch('getArticlesFromDB');
};


export const getArticlesFromDB = ({ commit }) => {
  const arts = db.queryAll('articles').map(el => Object.assign(el, {
    id: el.ID
  }));
  commit('setArticles', arts);
};

export const removeAll = ({ commit }) => {
  db.drop();
  window.location.reload();
};


export const saveArticle = ({commit}, art) => {
  const a = {...art};
  console.log(a);
  db.update('articles', {ID: art.ID}, () => a);
  db.commit();
  commit('updateArticle', art);
};

export const removeArticle = ({commit}, ID) => {
  db.deleteRows('articles', {ID});
  db.commit();
  commit('removeArticle', ID);
  window.location.reload();
};

export const getNewXml = async () => {
  const arts = db.queryAll('articles');
  const myjsonDataStr = db.queryAll('myjson');
  const artsjson = myjsonDataStr[0].data;
  const newJson = injectArticles(arts, artsjson);
  console.log(newJson);
  let xml = makeXML(newJson);
  arts.forEach(el => {
    xml = xml.replace(new RegExp(`replaceDescription${el.ID}`), `<![CDATA[${el.description2}]]`);
  });
  return xml;
};

export const resetToOriginalArticle = ({commit}, {artOriginalId, id}) => {
  const originalJson = db.queryAll('myjson', { ID: 1 });
  const original = originalJson[0].data;
  const arts = extractArticles(original);
  const art = _.find(arts, {_id: artOriginalId});
  if (!art) {
    return alert('error - original article is not found');
  }
  db.update('articles', {ID: art.id}, () => art);
  db.commit();
  const arto = {...art, id};
  commit('updateArticle', arto);
  return arto;
};

export const removeChecked = ({ commit }, checked = []) => {
  db.deleteRows('articles', row => {
    const is = Boolean(checked.find(id => id === row.ID));
    if (is) {
      commit('removeArticle', row.ID);
    }
    return is;
  });
  db.commit();
};

export default {
  uploadXML,
  getArticlesFromDB,
  saveArticle,
  resetToOriginalArticle,
  getNewXml,
  removeArticle,
  removeAll,
  removeChecked
};

