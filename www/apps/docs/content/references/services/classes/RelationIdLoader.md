# RelationIdLoader

Loads relation ids for the given entities.

## Constructors

### constructor

**new RelationIdLoader**(`connection`, `queryRunner?`)

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Defined in

node_modules/typeorm/query-builder/RelationIdLoader.d.ts:12

## Properties

### connection

 `Private` **connection**: `any`

#### Defined in

node_modules/typeorm/query-builder/RelationIdLoader.d.ts:10

___

### queryRunner

 `Protected` `Optional` **queryRunner**: [`QueryRunner`](../interfaces/QueryRunner.md)

#### Defined in

node_modules/typeorm/query-builder/RelationIdLoader.d.ts:11

## Methods

### load

**load**(`relation`, `entityOrEntities`, `relatedEntityOrRelatedEntities?`): `Promise`<`any`[]\>

Loads relation ids of the given entity or entities.

#### Parameters

| Name |
| :------ |
| `relation` | [`RelationMetadata`](RelationMetadata.md) |
| `entityOrEntities` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `relatedEntityOrRelatedEntities?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |

#### Returns

`Promise`<`any`[]\>

-`Promise`: 
	-`any[]`: 
		-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/RelationIdLoader.d.ts:16

___

### loadForManyToMany

`Protected` **loadForManyToMany**(`relation`, `entities`, `relatedEntities?`): `Promise`<`any`[]\>

Loads relation ids for the many-to-many relation.

#### Parameters

| Name |
| :------ |
| `relation` | [`RelationMetadata`](RelationMetadata.md) |
| `entities` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `relatedEntities?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |

#### Returns

`Promise`<`any`[]\>

-`Promise`: 
	-`any[]`: 
		-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/RelationIdLoader.d.ts:63

___

### loadForManyToOneAndOneToOneOwner

`Protected` **loadForManyToOneAndOneToOneOwner**(`relation`, `entities`, `relatedEntities?`): `Promise`<`any`[]\>

Loads relation ids for the many-to-one and one-to-one owner relations.

#### Parameters

| Name |
| :------ |
| `relation` | [`RelationMetadata`](RelationMetadata.md) |
| `entities` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `relatedEntities?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |

#### Returns

`Promise`<`any`[]\>

-`Promise`: 
	-`any[]`: 
		-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/RelationIdLoader.d.ts:67

___

### loadForOneToManyAndOneToOneNotOwner

`Protected` **loadForOneToManyAndOneToOneNotOwner**(`relation`, `entities`, `relatedEntities?`): `Promise`<`any`[]\>

Loads relation ids for the one-to-many and one-to-one not owner relations.

#### Parameters

| Name |
| :------ |
| `relation` | [`RelationMetadata`](RelationMetadata.md) |
| `entities` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `relatedEntities?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |

#### Returns

`Promise`<`any`[]\>

-`Promise`: 
	-`any[]`: 
		-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/RelationIdLoader.d.ts:71

___

### loadManyToManyRelationIdsAndGroup

**loadManyToManyRelationIdsAndGroup**<`E1`, `E2`\>(`relation`, `entitiesOrEntities`, `relatedEntityOrEntities?`, `queryBuilder?`): `Promise`<{ `entity`: `E1` ; `related?`: `E2` \| `E2`[]  }[]\>

Loads relation ids of the given entities and groups them into the object with parent and children.

todo: extract this method?

| Name | Type |
| :------ | :------ |
| `E1` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `E2` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `relation` | [`RelationMetadata`](RelationMetadata.md) |
| `entitiesOrEntities` | `E1` \| `E1`[] |
| `relatedEntityOrEntities?` | `E2` \| `E2`[] |
| `queryBuilder?` | [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

#### Returns

`Promise`<{ `entity`: `E1` ; `related?`: `E2` \| `E2`[]  }[]\>

-`Promise`: 
	-`{ `entity`: `E1` ; `related?`: `E2` \| `E2`[]  }[]`: 
		-``object``: (optional) 

#### Defined in

node_modules/typeorm/query-builder/RelationIdLoader.d.ts:22
