const { mergeToObj, compare } = require('./utils');
const RedBlackTree = require('./rbtree');
const Msgpack = require('msgpack-lite');
const Select = require('./select.js');

class Appdb {
  constructor(options) {
    this.encodeType = 'json'; // 'msgpack';
    mergeToObj(options, this);

    this._dataCache = {};
    this._readyQueue = [];
  }

  _get() { 
    return new Promise((_, reject) => {
      reject(new Error('unsupport environment'));
    });
  }

  _getTable(tableName) {
    return new Promise(resolve => {
      if (this._dataCache[tableName]) {
        return resolve(this._dataCache[tableName]);
      }
      
      this._get(tableName).then(table => {
        
        let tree = RedBlackTree(compare);
        try {
          if (this.encodeType == 'msgpack') {
            tree.root = Msgpack.decode(table);
          } else {
            tree.root = JSON.parse(table);
          }
        } catch(e) {}
        this._dataCache[tableName] = tree;
        resolve(this._dataCache[tableName]);
      });
    });
  }

  

  _init() {
    if (this.table) {
      this._getTable(this.table).then(table => {
        this._ready(table);
      });
    } else {
      this._ready(null);
    }
  }

  _insert(params) {
    let { table, key, data } = params;
    return new Promise(resolve => {
      resolve(table.insert(key, data));
    });
  }

  _query(params) {
    if (this['_' + params.do]) {
      return this['_' + params.do](params);
    } else {
      return Promise.reject('method not support');
    }
  }

  _ready(table) {
    let cb = () => {};
    while(cb = this._readyQueue.pop()) {
      cb(table);
    }
  }

  _select(params) {
    return Select(params);
  }

  _set() {
    return new Promise((_, reject) => {
      reject(new Error('unsupport environment'));
    });
  }

  _setTable(tableName) {
    return new Promise(resolve => {
      this._set(tableName, this.toString(tableName)).then(() => {
        resolve(true);
      });
    });
  }
  
  delete(params) {
    let { table = this.table, where } = params;
    return this._getTable(table).then(tableObj => {
      return this._query({
        do: 'select',
        where,
        table: tableObj
      }).then(result => {
        if (result.total) {
          result.result.map(item => {
            let iterator = tableObj.find(item.key);
            tableObj = iterator.remove();
          });
          this._dataCache[table] = tableObj;
          return this._setTable(table).then(() => {
            return result.total;
          });
        }
        return 0;
      });
    });
  }

  insert(params) {
    let { key, value, table = this.table, update = true } = params;
    return this._getTable(table).then(tableObj => {
      return this._query({
        do: 'insert',
        key: key || (Date.now() + '' + Math.random()),
        table: tableObj,
        data: value
      }).then(newTable => {
        this._dataCache[table] = newTable;
        if (!update) return true;
        return this._setTable(table);
      });
    });
  }

  ready(readyCb) {
    this._readyQueue.push(readyCb);
  }

  select(params) {
    let { table = this.table, key = '*', where, order = {  }, limit = 1 } = params;
    return this._getTable(table).then(tableObj => {
      return this._query({
        do: 'select',
        key, 
        where, 
        order, 
        limit,
        table: tableObj
      }).then(result => {
        return result;
      });
    });
  }

  

  toString(tableName = this.table) {
    let dataObj = this._dataCache[tableName] ? this._dataCache[tableName].root : '';
    if (this.encodeType == 'msgpack') {
      return Msgpack.encode(dataObj);
    }
    return JSON.stringify(dataObj);      
  }

  update(params) {
    let { table = this.table, where, value = {}, newValue } = params;
    return this._getTable(table).then(tableObj => {
      return this._query({
        do: 'select',
        where,
        table: tableObj
      }).then(result => {
        if (result.total) {
          result.result.map(item => {
            let temValue = item.value;
            if (newValue) {
              temValue = value;
            } else {
              for (let key in value) {
                temValue[key] = value[key]; 
              }
            }
            
            let iterator = tableObj.find(item.key);
            tableObj = iterator.update(temValue);
          });
          this._dataCache[table] = tableObj;
          return this._setTable(table).then(() => {
            return result.total;
          });
        }
        return 0;
      });
    });

  }
}


module.exports = Appdb;