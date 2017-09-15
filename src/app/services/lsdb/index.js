/* ============
 * lsdb Service
 * ============
 *
 */
import _ from 'lodash';

export const NUMBER = 'NUMBER';
export const TEXT = 'TEXT';
export const BOOL = 'BOOL';
export const ARRAY = 'ARRAY';
export const OBJ = 'OBJ';
export const ANY = 'ANY';

const limit = 500;

const puzzle = value => {
  const list = [];
  let i = 0;
  let part = 'hello';
  while (part) {
    part = value.slice(i * limit, ((i + 1) * limit));
    list.push(part);
    i++;
  }
  return list;
};

const solve = list => list.join('');

export class LSDB {
  constructor(prefix, table = '', useSeparateKeys = false) {
    this.prefix = prefix;
    this.table = table;
    this.useSeparateKeys = useSeparateKeys;
    this.ls = localStorage;
    this.types = {
      [NUMBER]: _.isNumber,
      [TEXT]: _.isString,
      [BOOL]: _.isBoolean,
      [ARRAY]: _.isArray,
      [OBJ]: _.isObject,
      [ANY]: () => true
    };
  }
  set(key, value) {
    if (this.useSeparateKeys) {
      value.forEach((el, i) => {
        const value = JSON.stringify(el);
        if (value.length > limit) {
          const parts = puzzle(value);
          parts.forEach((part, j) => {
            this.ls.setItem(`${this.prefix}_${key}_${i}_${j}`, JSON.stringify(part));
          });
          return;
        }
        this.ls.setItem(`${this.prefix}_${key}_${i}`, JSON.stringify(el));
      });
      return this;
    }
    this.ls.setItem(`${this.prefix}_${key}`, JSON.stringify(value));
    return this;
  }
  get(key, cancelUseSeparateKeys) {
    if (this.useSeparateKeys && !cancelUseSeparateKeys) {
      const list = [];
      let parts = [];
      let i = 0;
      let j = 0;
      let value = 'true';
      let part = 'true';
      while (value !== null) {
        parts = [];
        part = this.ls.getItem(`${this.prefix}_${key}_${i}_${j}`);
        if (!part) {
          value = this.ls.getItem(`${this.prefix}_${key}_${i}`);
        }
        while (part !== null) {
          part = this.ls.getItem(`${this.prefix}_${key}_${i}_${j}`);
          j++;
          parts.push(part);
        }
        if (parts.length) {
          value = solve(parts);
        }
        if (value) {
          list.push(JSON.parse(value));
        }
        i++;
      }
      return list;
    }

    return JSON.parse(this.ls.getItem(`${this.prefix}_${key}`));
  }
  setSchema(name, value) {
    this.set(`SCHEMA_${name}`, value);
  }
  getSchema(name) {
    return this.get(`SCHEMA_${name}`, true);
  }
  createTable(name, schema, useSeparateKeys) {
    const exist = this.getSchema(name);
    if (!exist) {
      schema.id = NUMBER;
      this.setSchema(name, schema);
      this.set(name, []);
    }
    return new LSDB(this.prefix, name, useSeparateKeys);
  }
  validate(type, value) {
    const f = type in this.types ? this.types[type] : () => false;
    return f(value);
  }
  checkSchema(table, value) {
    const schema = this.getSchema(table);
    return Object.keys(value).every(key => {
      const isValid = this.validate(schema[key], value[key]);
      if (!isValid) {
        console.error('Schema error');
        console.table([
          ['field', key],
          ['type', schema[key]],
          ['schema', JSON.stringify(schema)],
          ['value', value[key]]
        ]);
      }
      return isValid;
    });
  }
  isEmpty() {
    return this.get(this.table).length === 0;
  }
  insert(value) {
    const valid = this.checkSchema(this.table, value);
    if (valid) {
      const content = this.get(this.table);
      const id = content.length + 1;
      value.id = id;
      content.push(value);
      this.set(this.table, content);
      return this;
    }
    return null;
  }
  bulkInsert(list) {
    list.forEach(el => this.insert(el));
    return this;
  }
  update(id, newValue) {
    const valid = this.checkSchema(this.table, newValue);
    if (valid) {
      const content = this.get(this.table);
      const value = _.find(content, { id });
      if (!value) {
        return console.error('record not found');
      }
      _.assign(value, newValue);
      this.set(this.table, content);
      return this;
    }
    return null;
  }
  find(criteria) {
    const content = this.get(this.table);
    return _.find(content, criteria);
  }
  where(criteria) {
    const content = this.get(this.table);
    return _.filter(content, criteria);
  }
  remove(id) {
    const content = this.get(this.table);
    const newContent = _.filter(content, el => el.id !== id);
    this.set(this.table, newContent);
    return this;
  }
  all() {
    return this.get(this.table);
  }
}

export default {
  LSDB,
  types: {
    NUMBER,
    TEXT,
    BOOL,
    ARRAY,
    OBJ,
    ANY
  }
};
