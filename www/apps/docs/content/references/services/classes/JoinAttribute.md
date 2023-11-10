# JoinAttribute

Stores all join attributes which will be used to build a JOIN query.

## Constructors

### constructor

**new JoinAttribute**(`connection`, `queryExpressionMap`, `joinAttribute?`)

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |
| `queryExpressionMap` | [`QueryExpressionMap`](QueryExpressionMap.md) |
| `joinAttribute?` | [`JoinAttribute`](JoinAttribute.md) |

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:40

## Properties

### alias

 **alias**: [`Alias`](Alias.md)

Alias of the joined (destination) table.

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:19

___

### condition

 `Optional` **condition**: `string`

Extra condition applied to "ON" section of join.

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:27

___

### connection

 `Private` **connection**: `any`

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:10

___

### direction

 **direction**: ``"INNER"`` \| ``"LEFT"``

Join direction.

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:15

___

### entityOrProperty

 **entityOrProperty**: `string` \| `Function`

Joined table, entity target, or relation in "post.category" format.

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:23

___

### isMappingMany

 `Optional` **isMappingMany**: `boolean`

Indicates if user maps one or many objects from the join.

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:35

___

### isSelectedCache

 **isSelectedCache**: `boolean`

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:42

___

### isSelectedEvaluated

 **isSelectedEvaluated**: `boolean`

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:43

___

### mapAsEntity

 `Optional` **mapAsEntity**: `string` \| `Function`

Useful when the joined expression is a custom query to support mapping.

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:39

___

### mapToProperty

 `Optional` **mapToProperty**: `string`

Property + alias of the object where to joined data should be mapped.

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:31

___

### queryExpressionMap

 `Private` **queryExpressionMap**: `any`

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:11

___

### relationCache

 **relationCache**: `undefined` \| [`RelationMetadata`](RelationMetadata.md)

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:67

___

### relationEvaluated

 **relationEvaluated**: `boolean`

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:68

## Accessors

### isMany

`get` **isMany**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:41

___

### isSelected

`get` **isSelected**(): `boolean`

Indicates if this join is selected.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:47

___

### junctionAlias

`get` **junctionAlias**(): `string`

Generates alias of junction table, whose ids we get.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:84

___

### mapToPropertyParentAlias

`get` **mapToPropertyParentAlias**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:85

___

### mapToPropertyPropertyName

`get` **mapToPropertyPropertyName**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:86

___

### metadata

`get` **metadata**(): `undefined` \| [`EntityMetadata`](EntityMetadata.md)

Metadata of the joined entity.
If table without entity was joined, then it will return undefined.

#### Returns

`undefined` \| [`EntityMetadata`](EntityMetadata.md)

-`undefined \| EntityMetadata`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:80

___

### parentAlias

`get` **parentAlias**(): `undefined` \| `string`

Alias of the parent of this join.
For example, if we join ("post.category", "categoryAlias") then "post" is a parent alias.
This value is extracted from entityOrProperty value.
This is available when join was made using "post.category" syntax.

#### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:58

___

### relation

`get` **relation**(): `undefined` \| [`RelationMetadata`](RelationMetadata.md)

Relation of the parent.
This is used to understand what is joined.
This is available when join was made using "post.category" syntax.
Relation can be undefined if entityOrProperty is regular entity or custom table.

#### Returns

`undefined` \| [`RelationMetadata`](RelationMetadata.md)

-`undefined \| RelationMetadata`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:75

___

### relationPropertyPath

`get` **relationPropertyPath**(): `undefined` \| `string`

Relation property name of the parent.
This is used to understand what is joined.
For example, if we join ("post.category", "categoryAlias") then "category" is a relation property.
This value is extracted from entityOrProperty value.
This is available when join was made using "post.category" syntax.

#### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:66

___

### tablePath

`get` **tablePath**(): `string`

Name of the table which we should join.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/JoinAttribute.d.ts:51
