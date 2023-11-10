# ExclusionMetadata

Exclusion metadata contains all information about table's exclusion constraints.

## Constructors

### constructor

**new ExclusionMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.args?` | [`ExclusionMetadataArgs`](../interfaces/ExclusionMetadataArgs.md) |
| `options.entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Defined in

node_modules/typeorm/metadata/ExclusionMetadata.d.ts:30

## Properties

### entityMetadata

 **entityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata of the class to which this exclusion constraint is applied.

#### Defined in

node_modules/typeorm/metadata/ExclusionMetadata.d.ts:11

___

### expression

 **expression**: `string`

Exclusion expression.

#### Defined in

node_modules/typeorm/metadata/ExclusionMetadata.d.ts:19

___

### givenName

 `Optional` **givenName**: `string`

User specified exclusion constraint name.

#### Defined in

node_modules/typeorm/metadata/ExclusionMetadata.d.ts:23

___

### name

 **name**: `string`

Final exclusion constraint name.
If exclusion constraint name was given by a user then it stores normalized (by naming strategy) givenName.
If exclusion constraint name was not given then its generated.

#### Defined in

node_modules/typeorm/metadata/ExclusionMetadata.d.ts:29

___

### target

 `Optional` **target**: `string` \| `Function`

Target class to which metadata is applied.

#### Defined in

node_modules/typeorm/metadata/ExclusionMetadata.d.ts:15

## Methods

### build

**build**(`namingStrategy`): [`ExclusionMetadata`](ExclusionMetadata.md)

Builds some depend exclusion constraint properties.
Must be called after all entity metadata's properties map, columns and relations are built.

#### Parameters

| Name |
| :------ |
| `namingStrategy` | [`NamingStrategyInterface`](../interfaces/NamingStrategyInterface.md) |

#### Returns

[`ExclusionMetadata`](ExclusionMetadata.md)

-`ExclusionMetadata`: 

#### Defined in

node_modules/typeorm/metadata/ExclusionMetadata.d.ts:38
