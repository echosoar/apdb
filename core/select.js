const RedBlackTree = require('./rbtree');
const { compare, keyToNum } = require('./utils');

const whereCheck = (where, node) => {
  if (!where) return node;
  let value = node.value;
  if (value['$key'] == null) value['$key'] = node.key;
  let keys = Object.keys(where);
  for (let i = 0; i < keys.length; i ++) {
    let key = keys[i];
    if (Array.isArray(where[key])) {
      let isFind = where[key].find(item => item && item.test ? item.test(value[key] + '') : item == value[key]);
      if (isFind) return node;
    } else {
      let item = where[key];
      if (item && item.test) {
        if (!item.test(value[key] + '')) return false;
      } else {
        if (value[key] != item) return false;
      }
    }
  }
  return node;
}
const Where = (newTree, tree, where, order) => {
  // 没有条件的时候不应该直接返回，而是需要进行重新插入树进行排序
  // 只有在不需要排序的情况下才直接返回
  if (!where && !order) return tree;

  // if (where && where['$key']) {
  //   let node = whereCheck(where, tree.find(where['$key']));
  //   if (node) {
  //     newTree = newTree.insert(node.key, node.value);
  //   }
  // } else {
    
  // }
  tree.forEach((key, value) => {
    let node = whereCheck(where, { key, value });
    if (node) {
      delete node.value['$key'];
      newTree = newTree.insert(node.key, node.value);
    }
  });
  return newTree;
}

// 处理排序
const Order = (order) => {
  if (!order) return false;
  let orderKeys = Object.keys(order);
  if (!orderKeys.length) return false;

  return (ka, kb, a, b) => {
    // 找到这两个要比较的值是很慢的，因此修改了btree，排序时传入
    // let index = temObj.tree.keys.findIndex(k => k == kb);
    // let a = temObj.nowInsertValue;
    // let b = temObj.tree.at(index).value;
    
    for (let i = 0; i < orderKeys.length; i ++) {
      // 倒序的话: b大于a返回1，b小于a返回-1
      let key = orderKeys[i];
      let big = order[key] == 'desc' ? 1: -1;
      let small = order[key] == 'desc' ? -1: 1;

      // 如果a,b都不存在则返回0
      // 如果没有a，说明b比a大，返回big
      // 如果没有b，说明a比b大，返回small
      if (a[key] != null || b[key] != null) {
        if (a[key] == null) return big;
        if (b[key] == null) return small;
        if (a[key] != b[key]) {
          if (keyToNum(b[key]) > keyToNum(a[key])) return big;
          return small;
        }
      }
    }
    return 0;
  }
}

const Limit = (tree, limit) => {
  let result = [];
  if (!limit) {
    tree.forEach((key, value) => {
      result.push({ key, value });
    });
  } else {
    let start = limit.start || 0;
    let end = start + (limit.size || tree.length);
    if (end > tree.length) end = tree.length;
    for(let i = start; i < end; i++) {
      let node = tree.at(i);
      result.push({ 
        key: node.key,
        value: node.value
      });
    }
  }
  return result;
}

const Key = (list, keys) => {
  if (!keys || keys == '*') return list;
  if (typeof keys == 'string') keys = [keys];
  return list.map(item => {
    let newObj = {
      key: item.key,
      value: item.value
    };
    if (keys.length) newObj.value = {};
    keys.map(key => {
      newObj.value[key] = item.value[key] || null
    });
    return newObj;
  });
}

module.exports = params => {
  return new Promise((resolve) => {
    /*
    对于排序，则重新创建红黑树
    where: 
    {
      a: 1
    }

    order: {
      aaa: 'desc' // 倒序
      
    }

    */
    let { key, where, order, limit, table } = params;

    let orderCompare = Order(order) || compare; // 排序的比较方式

    let newTree = RedBlackTree(orderCompare);

    newTree = Where(newTree, table, where, order);

    let result = Limit(newTree, limit);

    result = Key(result, key);

    resolve({
      total: newTree.length,
      result
    });
  });
}