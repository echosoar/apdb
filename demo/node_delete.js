const Appdb = require('../node');

let apdb = new Appdb({
  table: 'test1'
});
console.time("get")
apdb.ready((table) => {
  console.timeEnd("get")
  console.time('start');
  apdb.delete({
    where: {
      num: '302909'
    }
  }).then(result => {
    console.log(result);
    console.timeEnd('start');
  });
})