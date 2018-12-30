const Appdb = require('../node');

let apdb = new Appdb({
  table: 'test1'
});

apdb.ready(async (table) => {
  console.time("insert");
  for(let i = 0; i < 1000000; i ++) {
    await apdb.insert({
      key: Date.now() + 'test' + i, 
      value: { num: i, key: Date.now() + 'test' + i},
      update: i == 999999
    });
  }
  console.timeEnd("insert");
})



