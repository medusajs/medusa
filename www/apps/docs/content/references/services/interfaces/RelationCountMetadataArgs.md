# RelationCountMetadataArgs

Arguments for RelationCountMetadata class.

## Properties

### alias

 `Optional` `Readonly` **alias**: `string`

Alias of the joined (destination) table.

#### Defined in

node_modules/typeorm/metadata-args/RelationCountMetadataArgs.d.ts:21

___

### propertyName

 `Readonly` **propertyName**: `string`

Class's property name to which this decorator is applied.

#### Defined in

node_modules/typeorm/metadata-args/RelationCountMetadataArgs.d.ts:13

___

### queryBuilderFactory

 `Optional` `Readonly` **queryBuilderFactory**: (`qb`: [`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\>

#### Type declaration

(`qb`): [`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\>

Extra condition applied to "ON" section of join.

##### Parameters

| Name |
| :------ |
| `qb` | [`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\> |

##### Returns

[`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\>

-`SelectQueryBuilder`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/metadata-args/RelationCountMetadataArgs.d.ts:25

___

### relation

 `Readonly` **relation**: `string` \| (`object`: `any`) => `any`

Target's relation which it should count.

#### Defined in

node_modules/typeorm/metadata-args/RelationCountMetadataArgs.d.ts:17

___

### target

 `Readonly` **target**: `Function`

Class to which this decorator is applied.

#### Defined in

node_modules/typeorm/metadata-args/RelationCountMetadataArgs.d.ts:9
