# RelationCountAttribute

## Constructors

### constructor

**new RelationCountAttribute**(`expressionMap`, `relationCountAttribute?`)

#### Parameters

| Name |
| :------ |
| `expressionMap` | [`QueryExpressionMap`](QueryExpressionMap.md) |
| `relationCountAttribute?` | [`Partial`](../types/Partial.md)<[`RelationCountAttribute`](RelationCountAttribute.md)\> |

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:23

## Properties

### alias

 `Optional` **alias**: `string`

Alias of the joined (destination) table.

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:10

___

### expressionMap

 `Private` **expressionMap**: `any`

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:6

___

### mapToProperty

 **mapToProperty**: `string`

Property + alias of the object where to joined data should be mapped.

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:18

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

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:22

___

### relationName

 **relationName**: `string`

Name of relation.

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:14

## Accessors

### joinInverseSideMetadata

`get` **joinInverseSideMetadata**(): [`EntityMetadata`](EntityMetadata.md)

#### Returns

[`EntityMetadata`](EntityMetadata.md)

-`EntityMetadata`: 

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:24

___

### junctionAlias

`get` **junctionAlias**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:40

___

### mapToPropertyPropertyName

`get` **mapToPropertyPropertyName**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:52

___

### metadata

`get` **metadata**(): [`EntityMetadata`](EntityMetadata.md)

Metadata of the joined entity.
If table without entity was joined, then it will return undefined.

#### Returns

[`EntityMetadata`](EntityMetadata.md)

-`EntityMetadata`: 

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:51

___

### parentAlias

`get` **parentAlias**(): `string`

Alias of the parent of this join.
For example, if we join ("post.category", "categoryAlias") then "post" is a parent alias.
This value is extracted from entityOrProperty value.
This is available when join was made using "post.category" syntax.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:31

___

### relation

`get` **relation**(): [`RelationMetadata`](RelationMetadata.md)

Relation of the parent.
This is used to understand what is joined.
This is available when join was made using "post.category" syntax.

#### Returns

[`RelationMetadata`](RelationMetadata.md)

-`RelationMetadata`: 

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:46

___

### relationProperty

`get` **relationProperty**(): `undefined` \| `string`

Relation property name of the parent.
This is used to understand what is joined.
For example, if we join ("post.category", "categoryAlias") then "category" is a relation property.
This value is extracted from entityOrProperty value.
This is available when join was made using "post.category" syntax.

#### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/relation-count/RelationCountAttribute.d.ts:39
