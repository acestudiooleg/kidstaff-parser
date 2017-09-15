import test from 'ava';
import sinon from 'sinon';
import {
  schemaToFields, sqlp, sql, isTableExists, makeTableFields,
  createTable, find, insert, unitInsertOperation, bulkInsert,
  queryValuesSet, update, remove, createTableFunctions, WDB
  } from './index';

const schema = {
  name: 'John',
  age: 18
};

const makeDb = (iterations = []) => {
  const spy = sinon.spy();
  const tx = {
    executeSql: (q, p, s, f) => {
      const i = iterations.shift() || [];
      spy(q, p);
      if (i[1]) {
        f(i[1]);
        return;
      }
      s(i[0]);
    }
  };
  const db = {
    transaction: (cb) => cb(tx)
  };
  return {db, spy, tx};
};

test('schemaToFields', async t => {
  const {
    fields, placeholders, values
  } = schemaToFields(schema);

  t.is(fields, 'name, age');
  t.is(placeholders, '?, ?');
  t.deepEqual(values, ['John', 18]);
});

test('sqlp', t => {
  const {db, spy} = makeDb();
  const query = 'hello';
  const params = [1, 2];
  sqlp(db, query, params);
  t.is(spy.args[0][0], query);
  t.deepEqual(spy.args[0][1], params);
});

test('isTableExists - yes', t => {
  const isExists = true;
  const {db, spy} = makeDb([[isExists]]);
  const query = 'hello';
  isTableExists(db, query).then(data => {
    t.is(data, isExists);
  });
  t.is(spy.args[0][0], `SELECT COUNT(*) FROM ${query}`);
});

test('sql - success', t => {
  const {db, spy} = makeDb();
  const query = 'hello';
  const params = [1, 2];
  sql(db, query, params);
  t.is(spy.args[0][0], query);
  t.deepEqual(spy.args[0][1], params);
});

test('makeTableFields', t => {
  const val = makeTableFields(schema);
  t.is(val, 'name John, age 18');
});

test('createTable - exist', async t => {
  const {db} = makeDb([[true]]);
  const data = await createTable(db, 'hello');
  t.is(data, true);
});

test('createTable - not exist', async t => {
  const {db, spy} = makeDb([[false, true], [true]]);
  const query = 'hello';
  await createTable(db, query, schema);
  t.is(spy.args[1][0], `CREATE TABLE ${query} (id REAL UNIQUE, ${makeTableFields(schema)})`);
});

test('find', async t => {
  const {db, spy} = makeDb([['hi']]);
  const tablename = 'hello';
  const value = await find(db, tablename, 'id=4');
  t.is(value, 'hi');
  t.is(spy.args[0][0], `SELECT * FROM ${tablename} WHERE id=4`);
});

test('insert', async t => {
  const {db, spy} = makeDb();
  const tablename = 'hello';
  await insert(db, tablename, schema);

  const {placeholders, fields, values} = schemaToFields(schema);
  t.is(spy.args[0][0], `INSERT INTO ${tablename} (${fields}) values (${placeholders})`);
  t.deepEqual(spy.args[0][1], values);
});

test('insert with onlyOneValueInTable', async t => {
  const arr = [1, 2, 3];
  const {db, spy} = makeDb([[arr]]);
  const tablename = 'hello';
  const data = await insert(db, tablename, schema, true);
  t.deepEqual(data, arr);
  t.is(spy.args[0][0], `SELECT * FROM ${tablename} WHERE id=0`);
});


test('unitInsertOperation', async t => {
  const {tx, spy} = makeDb();
  const tablename = 'hello';
  await unitInsertOperation(tx, tablename, schema);

  const {placeholders, fields, values} = schemaToFields(schema);
  t.is(spy.args[0][0], `INSERT INTO ${tablename} (${fields}) values (${placeholders})`);
  t.deepEqual(spy.args[0][1], values);
});


test('bulkInsert', async t => {
  const {db, spy} = makeDb();
  const tablename = 'hello';
  const list = [schema, schema, {lola: 'net'}];
  await bulkInsert(db, tablename, list);

  const {placeholders, fields, values} = schemaToFields(schema);
  t.is(spy.args[0][0], `INSERT INTO ${tablename} (${fields}) values (${placeholders})`);
  t.deepEqual(spy.args[0][1], values);
  t.is(spy.args[2][0], `INSERT INTO ${tablename} (lola) values (?)`);
  t.deepEqual(spy.args[2][1], ['net']);
});

test('queryValuesSet', async t => {
  const str = queryValuesSet(schema);
  t.is(str, 'name=John, age=18');
});


test('update', async t => {
  const {db, spy} = makeDb();
  const tablename = 'hello';
  const id = 9;
  await update(db, tablename, id, schema);

  const str = queryValuesSet(schema);
  t.is(spy.args[0][0], `UPDATE ${tablename} SET ${str} WHERE id=${id}`);
});


test('remove', async t => {
  const {db, spy} = makeDb();
  const tablename = 'hello';
  const id = 9;
  await remove(db, tablename, id);

  t.is(spy.args[0][0], `DELETE FROM ${tablename} WHERE id=${id}`);
});

test('createTableFunctions', async t => {
  const {db, spy} = makeDb([[false, true], [true]]);
  const tablename = 'hello';
  const api = createTableFunctions(db)(tablename, schema);
  const methods = [
    'sqlp',
    'sql',
    'isTableExists',
    'makeTableFields',
    'createTable',
    'insert',
    'unitInsertOperation',
    'bulkInsert',
    'queryValuesSet',
    'update',
    'find',
    'remove',
    'db'
  ];
  t.deepEqual(Object.keys(api), methods);

  t.is(spy.args[0][0], `SELECT COUNT(*) FROM ${tablename}`);
  await new Promise(s => setTimeout(s, 0));
  t.is(spy.args[1][0], `CREATE TABLE ${tablename} (id REAL UNIQUE, ${makeTableFields(schema)})`);
});

