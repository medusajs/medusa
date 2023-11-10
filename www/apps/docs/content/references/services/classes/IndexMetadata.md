# IndexMetadata

Index metadata contains all information about table's index.

## Constructors

### constructor

**new IndexMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.args?` | [`IndexMetadataArgs`](../interfaces/IndexMetadataArgs.md) |
| `options.columns?` | [`ColumnMetadata`](ColumnMetadata.md)[] |
| `options.embeddedMetadata?` | [`EmbeddedMetadata`](EmbeddedMetadata.md) |
| `options.entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:100

## Properties

### columnNamesWithOrderingMap

 **columnNamesWithOrderingMap**: `object`

Map of column names with order set.
Used only by MongoDB driver.

#### Index signature

▪ [key: `string`]: `number`

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:97

___

### columns

 **columns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Indexed columns.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:72

___

### embeddedMetadata

 `Optional` **embeddedMetadata**: [`EmbeddedMetadata`](EmbeddedMetadata.md)

Embedded metadata if this index was applied on embedded.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:17

___

### entityMetadata

 **entityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata of the class to which this index is applied.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:13

___

### expireAfterSeconds

 `Optional` **expireAfterSeconds**: `number`

Specifies a time to live, in seconds.
This option is only supported for mongodb database.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:64

___

### givenColumnNames

 `Optional` **givenColumnNames**: `string`[] \| (`object?`: `any`) => `any`[] \| { `[key: string]`: `number`;  }

User specified column names.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:80

___

### givenName

 `Optional` **givenName**: `string`

User specified index name.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:76

___

### isBackground

 `Optional` **isBackground**: `boolean`

Builds the index in the background so that building an index an does not block other database activities.
This option is only supported for mongodb database.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:59

___

### isFulltext

 **isFulltext**: `boolean`

The FULLTEXT modifier indexes the entire column and does not allow prefixing.
Works only in MySQL.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:31

___

### isNullFiltered

 **isNullFiltered**: `boolean`

NULL_FILTERED indexes are particularly useful for indexing sparse columns, where most rows contain a NULL value.
In these cases, the NULL_FILTERED index can be considerably smaller and more efficient to maintain than
a normal index that includes NULL values.

Works only in Spanner.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:39

___

### isSparse

 `Optional` **isSparse**: `boolean`

If true, the index only references documents with the specified field.
These indexes use less space but behave differently in some situations (particularly sorts).
This option is only supported for mongodb database.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:54

___

### isSpatial

 **isSpatial**: `boolean`

The SPATIAL modifier indexes the entire column and does not allow indexed columns to contain NULL values.
Works only in MySQL.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:26

___

### isUnique

 **isUnique**: `boolean`

Indicates if this index must be unique.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:21

___

### name

 **name**: `string`

Final index name.
If index name was given by a user then it stores normalized (by naming strategy) givenName.
If index name was not given then its generated.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:88

___

### parser

 `Optional` **parser**: `string`

Fulltext parser.
Works only in MySQL.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:44

___

### synchronize

 **synchronize**: `boolean`

Indicates if this index must synchronize with database index.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:48

___

### target

 `Optional` **target**: `string` \| `Function`

Target class to which metadata is applied.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:68

___

### where

 `Optional` **where**: `string`

Index filter condition.

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:92

## Methods

### build

**build**(`namingStrategy`): [`IndexMetadata`](IndexMetadata.md)

Builds some depend index properties.
Must be called after all entity metadata's properties map, columns and relations are built.

#### Parameters

| Name |
| :------ |
| `namingStrategy` | [`NamingStrategyInterface`](../interfaces/NamingStrategyInterface.md) |

#### Returns

[`IndexMetadata`](IndexMetadata.md)

-`IndexMetadata`: 

#### Defined in

node_modules/typeorm/metadata/IndexMetadata.d.ts:110
