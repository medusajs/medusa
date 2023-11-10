# EntitySchemaIndexOptions

## Properties

### columns

 `Optional` **columns**: `string`[] \| (`object?`: `any`) => `any`[] \| { `[key: string]`: `number`;  }

Index column names.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaIndexOptions.d.ts:9

___

### fulltext

 `Optional` **fulltext**: `boolean`

The FULLTEXT modifier indexes the entire column and does not allow prefixing.
Works only in MySQL.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaIndexOptions.d.ts:35

___

### name

 `Optional` **name**: `string`

Index name.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaIndexOptions.d.ts:5

___

### nullFiltered

 `Optional` **nullFiltered**: `boolean`

NULL_FILTERED indexes are particularly useful for indexing sparse columns, where most rows contain a NULL value.
In these cases, the NULL_FILTERED index can be considerably smaller and more efficient to maintain than
a normal index that includes NULL values.

Works only in Spanner.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaIndexOptions.d.ts:43

___

### parser

 `Optional` **parser**: `string`

Fulltext parser.
Works only in MySQL.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaIndexOptions.d.ts:48

___

### sparse

 `Optional` **sparse**: `boolean`

If true, the index only references documents with the specified field.
These indexes use less space but behave differently in some situations (particularly sorts).
This option is only supported for mongodb database.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaIndexOptions.d.ts:21

___

### spatial

 `Optional` **spatial**: `boolean`

The SPATIAL modifier indexes the entire column and does not allow indexed columns to contain NULL values.
Works only in MySQL and PostgreSQL.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaIndexOptions.d.ts:30

___

### synchronize

 `Optional` **synchronize**: `boolean`

Indicates if index must sync with database index.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaIndexOptions.d.ts:15

___

### unique

 `Optional` **unique**: `boolean`

Indicates if this index must be unique or not.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaIndexOptions.d.ts:25

___

### where

 `Optional` **where**: `string`

Index filter condition.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaIndexOptions.d.ts:52
