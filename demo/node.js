const Appdb = require('../node');

let apdb = new Appdb({
  table: 'test1'
});

apdb.ready((table) => {
  console.time('start');
  apdb.select({
    // where: {
    //   num: 80
    // },
    // order: {
    //   num: 'asc'
    // },
    limit: {
      size: 5
    }
  }).then(result => {
    console.timeEnd('start');
    console.log(JSON.stringify(result));
  });
  // console.log(table.keys);
})

