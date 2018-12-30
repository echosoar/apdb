let key = 'asfasjldfbashjdfbashkdfvaskvfadghsvfashjfdjbjasfbashkdfbakhsdfvaskdf';
console.time("split");
for(let i = 0; i<10000; i++) {
  let tem = (key + '').split('');
  for(let j = 0;j< tem.length;j++) {
    key[j]
  }
}
console.timeEnd("split");

console.time("index");
for(let i = 0; i<10000; i++) {
  let tem = (key + '');
  for(let j = 0;j< tem.length;j++) {
    key[j]
  }
}
console.timeEnd("index");
