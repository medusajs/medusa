# CollStats

**See**

https://www.mongodb.com/docs/manual/reference/command/collStats/

## Hierarchy

- [`Document`](Document.md)

  ↳ **`CollStats`**

## Properties

### avgObjSize

 **avgObjSize**: `number`

Average object size in bytes

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1918

___

### capped

 **capped**: `boolean`

`true` if the collection is capped

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1939

___

### count

 **count**: `number`

Number of documents

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1914

___

### freeStorageSize

 `Optional` **freeStorageSize**: `number`

The amount of storage available for reuse. The scale argument affects this value.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1950

___

### indexBuilds

 `Optional` **indexBuilds**: `number`

An array that contains the names of the indexes that are currently being built on the collection

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1952

___

### indexDetails

 `Optional` **indexDetails**: `any`

The fields in this document are the names of the indexes, while the values themselves are documents that contain statistics for the index provided by the storage engine

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1947

___

### indexSizes

 **indexSizes**: `Object`

Size of specific indexes in bytes

#### Index signature

▪ [index: `string`]: `number`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id_` | `number` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1934

___

### lastExtentSize

 **lastExtentSize**: `number`

Size of the most recently created extent in bytes

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1926

___

### max

 **max**: `number`

The maximum number of documents that may be present in a capped collection

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1941

___

### maxSize

 **maxSize**: `number`

The maximum size of a capped collection

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1943

___

### nindexes

 **nindexes**: `number`

Number of indexes

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1924

___

### ns

 **ns**: `string`

Namespace

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1912

___

### numExtents

 **numExtents**: `number`

Number of extents (contiguously allocated chunks of datafile space)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1922

___

### ok

 **ok**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1948

___

### paddingFactor

 **paddingFactor**: `number`

Padding can speed up updates if documents grow

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1928

___

### scaleFactor

 **scaleFactor**: `number`

The scale value used by the command.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1956

___

### size

 **size**: `number`

Collection size in bytes

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1916

___

### storageSize

 **storageSize**: `number`

(Pre)allocated space for the collection in bytes

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1920

___

### totalIndexSize

 **totalIndexSize**: `number`

Total index size in bytes

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1932

___

### totalSize

 **totalSize**: `number`

The sum of the storageSize and totalIndexSize. The scale argument affects this value

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1954

___

### userFlags

 `Optional` **userFlags**: `number`

A number that indicates the user-set flags on the collection. userFlags only appears when using the mmapv1 storage engine

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1930

___

### wiredTiger

 `Optional` **wiredTiger**: [`WiredTigerData`](WiredTigerData.md)

This document contains data reported directly by the WiredTiger engine and other data for internal diagnostic use

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1945
