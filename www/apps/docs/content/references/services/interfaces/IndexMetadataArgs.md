# IndexMetadataArgs

Arguments for IndexMetadata class.

## Properties

### background

 `Optional` **background**: `boolean`

Builds the index in the background so that building an index an does not block other database activities.
This option is only supported for mongodb database.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:64

___

### columns

 `Optional` **columns**: `string`[] \| (`object?`: `any`) => `any`[] \| { `[key: string]`: `number`;  }

Columns combination to be used as index.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:16

___

### expireAfterSeconds

 `Optional` **expireAfterSeconds**: `number`

Specifies a time to live, in seconds.
This option is only supported for mongodb database.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:69

___

### fulltext

 `Optional` **fulltext**: `boolean`

The FULLTEXT modifier indexes the entire column and does not allow prefixing.
Works only in MySQL.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:32

___

### name

 `Optional` **name**: `string`

Index name.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:12

___

### nullFiltered

 `Optional` **nullFiltered**: `boolean`

NULL_FILTERED indexes are particularly useful for indexing sparse columns, where most rows contain a NULL value.
In these cases, the NULL_FILTERED index can be considerably smaller and more efficient to maintain than
a normal index that includes NULL values.

Works only in Spanner.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:40

___

### parser

 `Optional` **parser**: `string`

Fulltext parser.
Works only in MySQL.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:45

___

### sparse

 `Optional` **sparse**: `boolean`

If true, the index only references documents with the specified field.
These indexes use less space but behave differently in some situations (particularly sorts).
This option is only supported for mongodb database.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:59

___

### spatial

 `Optional` **spatial**: `boolean`

The SPATIAL modifier indexes the entire column and does not allow indexed columns to contain NULL values.
Works only in MySQL.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:27

___

### synchronize

 `Optional` **synchronize**: `boolean`

Indicates if index must sync with database index.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:53

___

### target

 **target**: `string` \| `Function`

Class to which index is applied.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:8

___

### unique

 `Optional` **unique**: `boolean`

Indicates if index must be unique or not.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:22

___

### where

 `Optional` **where**: `string`

Index filter condition.

#### Defined in

node_modules/typeorm/metadata-args/IndexMetadataArgs.d.ts:49
