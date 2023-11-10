# RelationCountMetadata

Contains all information about entity's relation count.

## Constructors

### constructor

**new RelationCountMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.args` | [`RelationCountMetadataArgs`](../interfaces/RelationCountMetadataArgs.md) |
| `options.entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Defined in

node_modules/typeorm/metadata/RelationCountMetadata.d.ts:37

## Properties

### alias

 `Optional` **alias**: `string`

Alias of the joined (destination) table.

#### Defined in

node_modules/typeorm/metadata/RelationCountMetadata.d.ts:32

___

### entityMetadata

 **entityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata where this column metadata is.

#### Defined in

node_modules/typeorm/metadata/RelationCountMetadata.d.ts:12

___

### propertyName

 **propertyName**: `string`

Target's property name to which this metadata is applied.

#### Defined in

node_modules/typeorm/metadata/RelationCountMetadata.d.ts:28

___

### queryBuilderFactory

 `Optional` **queryBuilderFactory**: (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

#### Type declaration

(`qb`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

Extra condition applied to "ON" section of join.

##### Parameters

| Name |
| :------ |
| `qb` | [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

##### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

-`SelectQueryBuilder`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationCountMetadata.d.ts:36

___

### relation

 **relation**: [`RelationMetadata`](RelationMetadata.md)

Relation which needs to be counted.

#### Defined in

node_modules/typeorm/metadata/RelationCountMetadata.d.ts:16

___

### relationNameOrFactory

 **relationNameOrFactory**: `string` \| (`object`: `any`) => `any`

Relation name which need to count.

#### Defined in

node_modules/typeorm/metadata/RelationCountMetadata.d.ts:20

___

### target

 **target**: `string` \| `Function`

Target class to which metadata is applied.

#### Defined in

node_modules/typeorm/metadata/RelationCountMetadata.d.ts:24

## Methods

### build

**build**(): `void`

Builds some depend relation count metadata properties.
This builder method should be used only after entity metadata, its properties map and all relations are build.

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationCountMetadata.d.ts:45
