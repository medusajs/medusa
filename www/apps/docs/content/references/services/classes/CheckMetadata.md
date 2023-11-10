# CheckMetadata

Check metadata contains all information about table's check constraints.

## Constructors

### constructor

**new CheckMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.args?` | [`CheckMetadataArgs`](../interfaces/CheckMetadataArgs.md) |
| `options.entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Defined in

node_modules/typeorm/metadata/CheckMetadata.d.ts:30

## Properties

### entityMetadata

 **entityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata of the class to which this check constraint is applied.

#### Defined in

node_modules/typeorm/metadata/CheckMetadata.d.ts:11

___

### expression

 **expression**: `string`

Check expression.

#### Defined in

node_modules/typeorm/metadata/CheckMetadata.d.ts:19

___

### givenName

 `Optional` **givenName**: `string`

User specified check constraint name.

#### Defined in

node_modules/typeorm/metadata/CheckMetadata.d.ts:23

___

### name

 **name**: `string`

Final check constraint name.
If check constraint name was given by a user then it stores normalized (by naming strategy) givenName.
If check constraint name was not given then its generated.

#### Defined in

node_modules/typeorm/metadata/CheckMetadata.d.ts:29

___

### target

 `Optional` **target**: `string` \| `Function`

Target class to which metadata is applied.

#### Defined in

node_modules/typeorm/metadata/CheckMetadata.d.ts:15

## Methods

### build

**build**(`namingStrategy`): [`CheckMetadata`](CheckMetadata.md)

Builds some depend check constraint properties.
Must be called after all entity metadata's properties map, columns and relations are built.

#### Parameters

| Name |
| :------ |
| `namingStrategy` | [`NamingStrategyInterface`](../interfaces/NamingStrategyInterface.md) |

#### Returns

[`CheckMetadata`](CheckMetadata.md)

-`CheckMetadata`: 

#### Defined in

node_modules/typeorm/metadata/CheckMetadata.d.ts:38
