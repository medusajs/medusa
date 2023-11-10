# RelationIdAttribute

Stores all join relation id attributes which will be used to build a JOIN query.

## Constructors

### constructor

**new RelationIdAttribute**(`queryExpressionMap`, `relationIdAttribute?`)

#### Parameters

| Name |
| :------ |
| `queryExpressionMap` | [`QueryExpressionMap`](QueryExpressionMap.md) |
| `relationIdAttribute?` | [`Partial`](../index.md#partial)<[`RelationIdAttribute`](RelationIdAttribute.md)\> |

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:30

## Properties

### alias

 `Optional` **alias**: `string`

Alias of the joined (destination) table.

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:13

___

### disableMixedMap

 **disableMixedMap**: `boolean`

Indicates if relation id should NOT be loaded as id map.

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:29

___

### mapToProperty

 **mapToProperty**: `string`

Property + alias of the object where to joined data should be mapped.

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:21

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

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:25

___

### queryExpressionMap

 `Private` **queryExpressionMap**: `any`

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:9

___

### relationName

 **relationName**: `string`

Name of relation.

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:17

## Accessors

### joinInverseSideMetadata

`get` **joinInverseSideMetadata**(): [`EntityMetadata`](EntityMetadata.md)

#### Returns

[`EntityMetadata`](EntityMetadata.md)

-`EntityMetadata`: 

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:31

___

### junctionAlias

`get` **junctionAlias**(): `string`

Generates alias of junction table, whose ids we get.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:56

___

### junctionMetadata

`get` **junctionMetadata**(): [`EntityMetadata`](EntityMetadata.md)

Metadata of the joined entity.
If extra condition without entity was joined, then it will return undefined.

#### Returns

[`EntityMetadata`](EntityMetadata.md)

-`EntityMetadata`: 

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:61

___

### mapToPropertyParentAlias

`get` **mapToPropertyParentAlias**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:62

___

### mapToPropertyPropertyPath

`get` **mapToPropertyPropertyPath**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:63

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

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:38

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

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:52

___

### relationPropertyPath

`get` **relationPropertyPath**(): `string`

Relation property name of the parent.
This is used to understand what is joined.
For example, if we join ("post.category", "categoryAlias") then "category" is a relation property.
This value is extracted from entityOrProperty value.
This is available when join was made using "post.category" syntax.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/relation-id/RelationIdAttribute.d.ts:46
