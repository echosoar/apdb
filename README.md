# Apdb

Red-black-tree-based data storage (for small program / light application / node / browser ), efficient and lightweight, support for persistence and temporary storage!

## Usage

### Install

```
npm i apdb --save
```

### 1. Import

1. for nodejs
   ```
   import apdb from 'apdb/node';
   ```
2. for wechat mini app
   ```
   import apdb from 'apdb/wechat';
   ```
3. for web browser
   ```
   import apdb from 'apdb/web';
   ```

### 2. Initial

```
const apdb = new apdb( params );
```
#### params [object]

| key | desc | default |
| --- | --- | --- |
| table | [string] storage table name | 'default' |

### 3. Insert
```
const result = await apdb.insert( params );
```
#### result [boolean]

if insert successful, result is `true`

#### params [object]

| key | desc | default |
| --- | --- | --- |
| key | [string] primary key | Date.now() + Math.random() |
| value | [object] value | null |
| update | [boolean] update current tree to storage, improve multi-line insert performance   | true |

#### demo
```
await apdb.insert({
  key: 'apdb key', 
  value: {
    name: 'apdb',
    author: 'echosoar'
  }
});
```

### 4. Select
```
const result = await apdb.select( params );
```
#### result [object]
| key | desc |
| --- | --- | 
| total | [number] Total number of data |
| result | [array] all lines satisfying conditions | 
| result[n].key | primary key |
| result[n].value | value |


#### params [object]

| key | desc | default |
| --- | --- | --- |
| table | [string] storage table name | 'default' |
| key | [array string] which fields are returned | []: return all fields |
| where | [object] conditions for select, key value pair; use `$key` as key to select `primary key` | null |
| order | [object] depend on certain columns for sorting, the value can be `desc` or `asc` | null |
| limit | [object] | null |
| limit.start | [number] limit which line to start returning | 0 |
| limit.size | [number] limit number of returns | null : return all lines |

#### demo
```
const list = await apdb.select({
  where: {
    $key: /8/
  },
  order: {
    num: 'desc'
  },
  limit: {
    size: 5
  }
});
```
### 5. Update
```
const result = await apdb.update( params );
```
#### result [number]
result is the amount of updated lines

#### params [object]

| key | desc | default |
| --- | --- | --- |
| table | [string] storage table name | 'default' |
| where | [object] conditions for update, key value pair; use `$key` as key to select `primary key` | null |
| value | [object] new value | {} |
| newValue | [boolean] if ture, the original value columns will be discarded | false |

#### demo
```
const updateCount = await apdb.update({
    where: {
      num: 302910
    },
    value: { 
      up: 'test new value'
    },
});
  
```

### 6. Delete
```
const result = await apdb.delete( params );
```
#### result [number]
result is the amount of deleted lines

#### params [object]

| key | desc | default |
| --- | --- | --- |
| table | [string] storage table name | 'default' |
| where | [object] conditions for delete, key value pair; use `$key` as key to select `primary key` | null |

#### demo
```
const deleteCount = await apdb.delete({
    where: {
      num: 302909
    }
});
```


## Performance 

#### Node environment

| type | amount(lines) |  operate | time usage(ms) | space usage(MB) |
| --- | --- | --- | --- | --- |
| json | 1,000,000 | init | 2000 | - |
| json | 1,000,000 | insert | 14451 | 130.8 |
| msgpack | 1,000,000 | init | 7281 | - |
| msgpack | 1,000,000 | insert | 16288 | 100.7 |
| - all | 1,000,000 | order desc | 1729 | |
| - all | 1,000,000 | order asc | 1746 | | 
| - all | 1,000,000 | select where normal | 103 | |
| - all | 1,000,000 | select where regexp | 7197 | | 

#### Each line format

```
{
  key: "1545802142928test13",
  value: {
    "num":302910,
    "key":"1545801896834test302910"
  }
}
```