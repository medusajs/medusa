# UniqueMetadata

Unique metadata contains all information about table's unique constraints.

## Constructors

### constructor

**new UniqueMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.args?` | [`UniqueMetadataArgs`](../interfaces/UniqueMetadataArgs.md) |
| `options.columns?` | [`ColumnMetadata`](ColumnMetadata.md)[] |
| `options.embeddedMetadata?` | [`EmbeddedMetadata`](EmbeddedMetadata.md) |
| `options.entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Defined in

node_modules/typeorm/metadata/UniqueMetadata.d.ts:54

## Properties

### columnNamesWithOrderingMap

 **columnNamesWithOrderingMap**: `object`

Map of column names with order set.
Used only by MongoDB driver.

#### Index signature

▪ [key: `string`]: `number`

#### Defined in

node_modules/typeorm/metadata/UniqueMetadata.d.ts:51

___

### columns

 **columns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Unique columns.

#### Defined in

node_modules/typeorm/metadata/UniqueMetadata.d.ts:26

___

### deferrable

 `Optional` **deferrable**: [`DeferrableType`](../types/DeferrableType.md)

Indicate if unique constraints can be deferred.

#### Defined in

node_modules/typeorm/metadata/UniqueMetadata.d.ts:30

___

### embeddedMetadata

 `Optional` **embeddedMetadata**: [`EmbeddedMetadata`](EmbeddedMetadata.md)

Embedded metadata if this unique was applied on embedded.

#### Defined in

node_modules/typeorm/metadata/UniqueMetadata.d.ts:18

___

### entityMetadata

 **entityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata of the class to which this unique constraint is applied.

#### Defined in

node_modules/typeorm/metadata/UniqueMetadata.d.ts:14

___

### givenColumnNames

 `Optional` **givenColumnNames**: `string`[] \| (`object?`: `any`) => `any`[] \| { `[key: string]`: `number`;  }

User specified column names.

#### Defined in

node_modules/typeorm/metadata/UniqueMetadata.d.ts:38

___

### givenName

 `Optional` **givenName**: `string`

User specified unique constraint name.

#### Defined in

node_modules/typeorm/metadata/UniqueMetadata.d.ts:34

___

### name

 **name**: `string`

Final unique constraint name.
If unique constraint name was given by a user then it stores normalized (by naming strategy) givenName.
If unique constraint name was not given then its generated.

#### Defined in

node_modules/typeorm/metadata/UniqueMetadata.d.ts:46

___

### target

 `Optional` **target**: `string` \| `Function`

Target class to which metadata is applied.

#### Defined in

node_modules/typeorm/metadata/UniqueMetadata.d.ts:22

## Methods

### build

**build**(`namingStrategy`): [`UniqueMetadata`](UniqueMetadata.md)

Builds some depend unique constraint properties.
Must be called after all entity metadata's properties map, columns and relations are built.

#### Parameters

| Name |
| :------ |
| `namingStrategy` | [`NamingStrategyInterface`](../interfaces/NamingStrategyInterface.md) |

#### Returns

[`UniqueMetadata`](UniqueMetadata.md)

-`UniqueMetadata`: 

#### Defined in

node_modules/typeorm/metadata/UniqueMetadata.d.ts:64
