# RelationLoader

Wraps entities and creates getters/setters for their relations
to be able to lazily load relations when accessing these relations.

## Constructors

### constructor

**new RelationLoader**(`connection`)

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |

#### Defined in

node_modules/typeorm/query-builder/RelationLoader.d.ts:12

## Properties

### connection

 `Private` **connection**: `any`

#### Defined in

node_modules/typeorm/query-builder/RelationLoader.d.ts:11

## Methods

### enableLazyLoad

**enableLazyLoad**(`relation`, `entity`, `queryRunner?`): `void`

Wraps given entity and creates getters/setters for its given relation
to be able to lazily load data when accessing this relation.

#### Parameters

| Name |
| :------ |
| `relation` | [`RelationMetadata`](RelationMetadata.md) |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/RelationLoader.d.ts:58

___

### load

**load**(`relation`, `entityOrEntities`, `queryRunner?`, `queryBuilder?`): `Promise`<`any`[]\>

Loads relation data for the given entity and its relation.

#### Parameters

| Name |
| :------ |
| `relation` | [`RelationMetadata`](RelationMetadata.md) |
| `entityOrEntities` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |
| `queryBuilder?` | [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

#### Returns

`Promise`<`any`[]\>

-`Promise`: 
	-`any[]`: 
		-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/RelationLoader.d.ts:16

___

### loadManyToManyNotOwner

**loadManyToManyNotOwner**(`relation`, `entityOrEntities`, `queryRunner?`, `queryBuilder?`): `Promise`<`any`\>

Loads data for many-to-many not owner relations.

SELECT post
FROM post post
INNER JOIN post_categories post_categories
ON post_categories.postId = post.id
AND post_categories.categoryId = post_categories.categoryId

#### Parameters

| Name |
| :------ |
| `relation` | [`RelationMetadata`](RelationMetadata.md) |
| `entityOrEntities` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |
| `queryBuilder?` | [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/RelationLoader.d.ts:53

___

### loadManyToManyOwner

**loadManyToManyOwner**(`relation`, `entityOrEntities`, `queryRunner?`, `queryBuilder?`): `Promise`<`any`\>

Loads data for many-to-many owner relations.

SELECT category
FROM category category
INNER JOIN post_categories post_categories
ON post_categories.postId = :postId
AND post_categories.categoryId = category.id

#### Parameters

| Name |
| :------ |
| `relation` | [`RelationMetadata`](RelationMetadata.md) |
| `entityOrEntities` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |
| `queryBuilder?` | [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/RelationLoader.d.ts:43

___

### loadManyToOneOrOneToOneOwner

**loadManyToOneOrOneToOneOwner**(`relation`, `entityOrEntities`, `queryRunner?`, `queryBuilder?`): `Promise`<`any`\>

Loads data for many-to-one and one-to-one owner relations.

(ow) post.category<=>category.post
loaded: category from post
example: SELECT category.id AS category_id, category.name AS category_name FROM category category
             INNER JOIN post Post ON Post.category=category.id WHERE Post.id=1

#### Parameters

| Name |
| :------ |
| `relation` | [`RelationMetadata`](RelationMetadata.md) |
| `entityOrEntities` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |
| `queryBuilder?` | [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/RelationLoader.d.ts:25

___

### loadOneToManyOrOneToOneNotOwner

**loadOneToManyOrOneToOneNotOwner**(`relation`, `entityOrEntities`, `queryRunner?`, `queryBuilder?`): `Promise`<`any`\>

Loads data for one-to-many and one-to-one not owner relations.

SELECT post
FROM post post
WHERE post.[joinColumn.name] = entity[joinColumn.referencedColumn]

#### Parameters

| Name |
| :------ |
| `relation` | [`RelationMetadata`](RelationMetadata.md) |
| `entityOrEntities` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |
| `queryBuilder?` | [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/RelationLoader.d.ts:33
