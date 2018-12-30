const AppdbCore = require('./core/appdb');
const Fs = require('fs');
const Path = require('path');

class Appdb extends AppdbCore {
  constructor(options) {
    super(options);

    this.dirname = this.dirname || Path.resolve(__dirname, './apdb');

    this._init();
  }

  _get(name) {
    return new Promise(resolve => {
      let addr = Path.resolve(this.dirname, './' + name + '.apdb');
      if (Fs.existsSync(addr)) {
        resolve(Fs.readFileSync(addr));
      }
      resolve('');
    });
  }

  _set(name, data) { // data is string
    return new Promise((resolve, reject) => {
      if (!Fs.existsSync(this.dirname)) Fs.mkdirSync(this.dirname);
      let addr = Path.resolve(this.dirname, './' + name + '.apdb');
      resolve(Fs.writeFileSync(addr, data));
    });
  }
}

module.exports = Appdb;