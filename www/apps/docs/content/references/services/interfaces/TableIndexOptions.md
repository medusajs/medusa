# TableIndexOptions

Database's table index options.

## Properties

### columnNames

 **columnNames**: `string`[]

Columns included in this index.

#### Defined in

node_modules/typeorm/schema-builder/options/TableIndexOptions.d.ts:12

___

### isFulltext

 `Optional` **isFulltext**: `boolean`

The FULLTEXT modifier indexes the entire column and does not allow prefixing.
Supported only in MySQL & SAP HANA.

#### Defined in

node_modules/typeorm/schema-builder/options/TableIndexOptions.d.ts:26

___

### isNullFiltered

 `Optional` **isNullFiltered**: `boolean`

NULL_FILTERED indexes are particularly useful for indexing sparse columns, where most rows contain a NULL value.
In these cases, the NULL_FILTERED index can be considerably smaller and more efficient to maintain than
a normal index that includes NULL values.

Works only in Spanner.

#### Defined in

node_modules/typeorm/schema-builder/options/TableIndexOptions.d.ts:34

___

### isSpatial

 `Optional` **isSpatial**: `boolean`

The SPATIAL modifier indexes the entire column and does not allow indexed columns to contain NULL values.
Works only in MySQL.

#### Defined in

node_modules/typeorm/schema-builder/options/TableIndexOptions.d.ts:21

___

### isUnique

 `Optional` **isUnique**: `boolean`

Indicates if this index is unique.

#### Defined in

node_modules/typeorm/schema-builder/options/TableIndexOptions.d.ts:16

___

### name

 `Optional` **name**: `string`

Constraint name.

#### Defined in

node_modules/typeorm/schema-builder/options/TableIndexOptions.d.ts:8

___

### parser

 `Optional` **parser**: `string`

Fulltext parser.
Works only in MySQL.

#### Defined in

node_modules/typeorm/schema-builder/options/TableIndexOptions.d.ts:39

___

### where

 `Optional` **where**: `string`

Index filter condition.

#### Defined in

node_modules/typeorm/schema-builder/options/TableIndexOptions.d.ts:43
