/* ============
 * db Service
 * ============
 *
 */
import { WDB, TEXT, OBJ, ARRAY } from '@/services/lsdb';

const createTable = new WDB('kidstaff');

const artModel = {
  model: TEXT,
  keywords: TEXT,
  description: TEXT,
  categoryId: TEXT,
  characteristics: OBJ,
  picture: ARRAY,
  warranty: TEXT,
  price: TEXT,
  shopsection: TEXT,
  _available: TEXT,
  _id: TEXT
};
const sourceModel = {
  data: TEXT
};

const myjsonModel = {
  data: OBJ
};

export const articles = createTable('articles', artModel);
export const source = createTable('source', sourceModel);
export const myjson = createTable('myjson', myjsonModel);

export default {
  articles,
  source,
  myjson
};
