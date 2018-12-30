const AppdbCore = require('../core/appdb');

class Appdb extends AppdbCore {
  constructor(options) {
    super(options);
    this._init();
  }

  _get(name) {
    return new Promise(resolve => {
      let item = localStorage.getItem(name + '.apdb');
      if (item) return resolve(item);
      resolve('');
    });
  }

  _set(name, data) { // data is string
    return new Promise((resolve, reject) => {
      resolve(localStorage.setItem(name + '.apdb', data));
    });
  }
}

module.exports = Appdb;