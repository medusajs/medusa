# RelationIdMetadata

Contains all information about entity's relation count.

## Constructors

### constructor

**new RelationIdMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.args` | [`RelationIdMetadataArgs`](../interfaces/RelationIdMetadataArgs.md) |
| `options.entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Defined in

node_modules/typeorm/metadata/RelationIdMetadata.d.ts:38

## Properties

### alias

 `Optional` **alias**: `string`

Alias of the joined (destination) table.

#### Defined in

node_modules/typeorm/metadata/RelationIdMetadata.d.ts:33

___

### entityMetadata

 **entityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata where this column metadata is.

#### Defined in

node_modules/typeorm/metadata/RelationIdMetadata.d.ts:13

___

### propertyName

 **propertyName**: `string`

Target's property name to which this metadata is applied.

#### Defined in

node_modules/typeorm/metadata/RelationIdMetadata.d.ts:29

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

node_modules/typeorm/metadata/RelationIdMetadata.d.ts:37

___

### relation

 **relation**: [`RelationMetadata`](RelationMetadata.md)

Relation from which ids will be extracted.

#### Defined in

node_modules/typeorm/metadata/RelationIdMetadata.d.ts:17

___

### relationNameOrFactory

 **relationNameOrFactory**: `string` \| (`object`: `any`) => `any`

Relation name which need to count.

#### Defined in

node_modules/typeorm/metadata/RelationIdMetadata.d.ts:21

___

### target

 **target**: `string` \| `Function`

Target class to which metadata is applied.

#### Defined in

node_modules/typeorm/metadata/RelationIdMetadata.d.ts:25

## Methods

### build

**build**(): `void`

Builds some depend relation id properties.
This builder method should be used only after entity metadata, its properties map and all relations are build.

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationIdMetadata.d.ts:52

___

### setValue

**setValue**(`entity`): `void`

Sets relation id value from the given entity.

todo: make it to work in embeds as well.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationIdMetadata.d.ts:47
