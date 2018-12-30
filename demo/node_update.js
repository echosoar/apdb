const Appdb = require('../node');

let apdb = new Appdb({
  table: 'test1'
});
console.time("get")
apdb.ready((table) => {
  console.timeEnd("get")
  console.time('start');
  apdb.update({
    where: {
      up: '456'
    },
    value: { num: 302910, key: '1545801896834test302910'},
  }).then(result => {
    console.log(result);
    console.timeEnd('start');
  });
})