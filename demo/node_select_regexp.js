const Appdb = require('../node');

let apdb = new Appdb({
  table: 'test1'
});
console.time("get")
apdb.ready((table) => {
  console.timeEnd("get")
  console.time('start');
  apdb.select({
    where: {
      $key: /8/
    }
  }).then(result => {
    console.timeEnd('start');
  });
  // console.log(table.keys);
})