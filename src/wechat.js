const AppdbCore = require('../core/appdb');

class Appdb extends AppdbCore {
  constructor(options) {
    super(options);
    this._init();
  }

  _get(name) {
    return new Promise(resolve => {
      wx.getStorage({
        key: name + '.apdb',
        success: data => {
          resolve(data);
        },
        fail: () => {
          resolve('');
        }
      });
    });
  }

  _set(name, data) { // data is string
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: name + '.apdb',
        data,
        success: () => {
          resolve(true);
        },
        fail: (e) => {
          reject(e);
        }
      });
    });
  }
}

module.exports = Appdb;