/* ============
 * converter Service
 * ============
 *
 */

import X2js from 'x2js';
import _ from 'lodash';

const x2 = new X2js();
const path = 'yml_catalog.shop.offers.offer';

export const getArticles = xml => {
  const json = x2.xml2js(xml);
  return _.get(json, path, []);
};

export const makeXML = x2.js2xml;

export const convertToJSON = val => x2.xml2js(val);
export const convertToXML = val => x2.js2xml(val);
export const extractArticles = val => _.get(val, path, []);
export const injectArticles = (articles, json) =>
  _.set(json, path,
    articles.map(el => Object.assign(el, {
      description2: el.description,
      description: `replaceDescription${el.ID}`
    })));

export default {
  convertToJSON,
  convertToXML,
  getArticles,
  makeXML
};
