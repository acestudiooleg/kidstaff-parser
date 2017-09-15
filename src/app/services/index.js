/* ============
 * Services File
 * ============
 */

// Services
import db from './db';
import wdb from './wdb';
import converter from './converter';
import auth from './auth';
import account from './account';

export default [
  db,
  wdb,
  converter,
  auth,
  account
];
