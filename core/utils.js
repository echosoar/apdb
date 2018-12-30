const mergeToObj = (from, to) => {
  Object.keys(from || {}).map(key => {
    to[key] = from[key];
  });
}

const keyToNum = (key) => {
  if (typeof key == 'number') return key;
  let keyMap = '0123456789abcdefghijklmnopqrstuvwxyz_.*/+-=@#$%';
  return keyMap.indexOf(key) || key.charCodeAt(0) || 0;
}

const compare = (key1, key2) => {

  let key2Arr = (key2 + '');
  if (key1 && key1.test) {
    if (key1.test(key2)) return 0;
  }
  
  let key1Arr = (key1 + '');

  let defaultValue = key1Arr.length - key2Arr.length;
  let len = defaultValue > 0? key2Arr.length : key1Arr.length;
  // 正序排列，大的在后
  for(let i = 0; i < len; i ++) {
    if (key1Arr[i] != key2Arr[i]) {
      return keyToNum(key1Arr[i]) - keyToNum(key2Arr[i]);
    }
  }
  return defaultValue;
}


module.exports = {
  mergeToObj,
  keyToNum,
  compare
}