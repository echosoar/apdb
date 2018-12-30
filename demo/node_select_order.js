const Appdb = require('../node');

let apdb = new Appdb({
  table: 'test1'
});
console.time("get")
apdb.ready((table) => {
  console.timeEnd("get")
  console.time('start');
  apdb.select({
    order: {
      num: 'desc'
    }
  }).then(result => {
    console.timeEnd('start');
    // console.log(result)
  });
  // console.log(table.keys);
})