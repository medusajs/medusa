# TableIndex

Database's table index stored in this class.

## Constructors

### constructor

**new TableIndex**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | [`TableIndexOptions`](../interfaces/TableIndexOptions.md) |

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:47

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:7

___

### columnNames

 **columnNames**: `string`[]

Columns included in this index.

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:15

___

### isFulltext

 **isFulltext**: `boolean`

The FULLTEXT modifier indexes the entire column and does not allow prefixing.
Works only in MySQL.

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:29

___

### isNullFiltered

 **isNullFiltered**: `boolean`

NULL_FILTERED indexes are particularly useful for indexing sparse columns, where most rows contain a NULL value.
In these cases, the NULL_FILTERED index can be considerably smaller and more efficient to maintain than
a normal index that includes NULL values.

Works only in Spanner.

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:37

___

### isSpatial

 **isSpatial**: `boolean`

The SPATIAL modifier indexes the entire column and does not allow indexed columns to contain NULL values.
Works only in MySQL.

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:24

___

### isUnique

 **isUnique**: `boolean`

Indicates if this index is unique.

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:19

___

### name

 `Optional` **name**: `string`

Index name.

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:11

___

### parser

 `Optional` **parser**: `string`

Fulltext parser.
Works only in MySQL.

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:42

___

### where

 **where**: `string`

Index filter condition.

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:46

## Methods

### clone

**clone**(): [`TableIndex`](TableIndex.md)

Creates a new copy of this index with exactly same properties.

#### Returns

[`TableIndex`](TableIndex.md)

-`TableIndex`: 

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:51

___

### create

`Static` **create**(`indexMetadata`): [`TableIndex`](TableIndex.md)

Creates index from the index metadata object.

#### Parameters

| Name |
| :------ |
| `indexMetadata` | [`IndexMetadata`](IndexMetadata.md) |

#### Returns

[`TableIndex`](TableIndex.md)

-`TableIndex`: 

#### Defined in

node_modules/typeorm/schema-builder/table/TableIndex.d.ts:55
