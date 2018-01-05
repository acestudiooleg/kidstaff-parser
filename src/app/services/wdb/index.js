/* ============
 * lsdb Service
 * ============
 *
 */
import _ from 'lodash';

export const TEXT = 'TEXT';
export const NUMBER = 'REAL';
export const BOOL = 'BOOL';
export const ARRAY = TEXT;
export const OBJ = TEXT;
export const ANY = TEXT;

export const schemaToFields = schema => {
  const fields = [];
  const values = [];
  const pl = [];


  Object.keys(schema).forEach(field => {
    fields.push(field);
    pl.push('?');
    values.push(schema[field]);
  });
  return {
    fields: fields.join(', '),
    placeholders: pl.join(', '),
    values
  };
};

export const errorHandler = (method, query, value) => tx => {
  console.error(tx);
  console.log('===========================');
  console.log({
    method,
    query,
    value: JSON.stringify(value)
  });
  console.log('\n\n');
};

export const fromTx = f => (_, data) => f(data);

export const sqlp = (db, query, params = []) =>
  new Promise((s, f) => db.transaction(tx => tx.executeSql(query, params, fromTx(s), fromTx(f))));
export const sql = (db, query, params = []) => sqlp(db, query, params).catch(errorHandler('sql', query, params));
export const isTableExists = (db, name) => {
  return new Promise(resolve => {
    sqlp(db, `SELECT COUNT(*) FROM ${name}`).then(() => resolve(true)).catch(() => resolve(false));
  });
};

export const makeTableFields = schema =>
  Object.keys(schema).map(field => `${field} ${schema[field]}`).join(', ');

export const createTable = (db, name, schema) => {
  return isTableExists(db, name)
    .then(exist => {
      if (!exist) {
        const fields = makeTableFields(schema);
        return sql(db, `CREATE TABLE ${name} (id INTEGER PRIMARY KEY , ${fields})`);
      }
      return Promise.resolve(true);
    });
};
export const find = async (db, tablename, criteria) => {
  const {rows} = await sql(db, `SELECT * FROM ${tablename} WHERE ${criteria}`);
  return Object.keys(rows || {}).map(k => rows[k]);
};


export const insert = (db, tablename, value, onlyOneValueInTable) => {
  const insertData = () => {
    const {placeholders, fields, values} = schemaToFields(value);
    return sql(db, `INSERT INTO ${tablename} (${fields}) values (${placeholders})`, values);
  };

  if (onlyOneValueInTable) {
    return find(db, tablename, 'id=0').then(arr => {
      console.log(arr);
      return arr;
    });
  }
  return insertData();
};

export const unitInsertOperation = (tx, tablename, value) => {
  return new Promise((resolve, reject) => {
    const {placeholders, fields, values} = schemaToFields(value);
    tx.executeSql(`INSERT INTO ${tablename} (${fields}) values (${placeholders})`, values, fromTx(resolve), fromTx(reject));
  });
};

export const bulkInsert = (db, tablename, list) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const promises = list.map(el => unitInsertOperation(tx, tablename, el));
      Promise.all(promises).then(resolve).catch(reject);
    });
  })
  .then(_.identity)
  .catch(errorHandler('bulkInsert', tablename, [list]));
};

export const queryValuesSet = val => Object.keys(val).map(k => `${k}='${val[k]}'`).join(', ');

export const update = (db, tablename, id, newValue) => {
  const set = queryValuesSet(newValue);
  return sql(db, `UPDATE ${tablename} SET ${set} WHERE id=${id}`);
};

export const remove = (db, tablename, id) => sql(db, `DELETE FROM ${tablename} WHERE id=${id}`);

export const drop = (db, tablename) => sql(db, `DROP TABLE ${tablename}`);

export const createTableFunctions = db => (tablename, schemaToFields) => {
  createTable(db, tablename, schemaToFields);
  return {
    sqlp: (query, params) => sqlp(db, query, params),
    sql: (query, params, onlyOne) => sql(db, query, params, onlyOne),
    isTableExists: (name) => isTableExists(db, name),
    makeTableFields,
    createTable: (tablename, schemaToFields) => createTable(db, tablename, schemaToFields),
    insert: (value) => insert(db, tablename, value),
    unitInsertOperation,
    bulkInsert: (list) => bulkInsert(db, tablename, list),
    queryValuesSet,
    update: (id, value) => update(db, tablename, id, value),
    find: (criteria) => find(db, tablename, criteria),
    remove: (id) => remove(db, tablename, id),
    drop: () => drop(db, tablename),
    db,
  };
};

export const WDB = (dbname, version = '0.1', desc = 'A list of to do items.', size = 200000) => {
  const db = openDatabase(dbname, version, desc, size);
  if (!db) {
    throw new Error('Failed to connect to database.');
  }
  return createTableFunctions(db);
};

export default {
  WDB,
  sqlp,
  sql,
  isTableExists,
  makeTableFields,
  createTable,
  insert,
  unitInsertOperation,
  bulkInsert,
  queryValuesSet,
  update,
  find,
  remove,
  types: {
    NUMBER,
    TEXT,
    BOOL,
    ARRAY,
    OBJ,
    ANY
  }
};
