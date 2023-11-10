# BroadcasterEvents

## Properties

### AfterInsert

 **AfterInsert**: (`metadata`: [`EntityMetadata`](../classes/EntityMetadata.md), `entity`: `undefined` \| [`ObjectLiteral`](ObjectLiteral.md)) => `void`

#### Type declaration

(`metadata`, `entity`): `void`

##### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `entity` | `undefined` \| [`ObjectLiteral`](ObjectLiteral.md) |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:18

___

### AfterRecover

 **AfterRecover**: (`metadata`: [`EntityMetadata`](../classes/EntityMetadata.md), `entity?`: [`ObjectLiteral`](ObjectLiteral.md), `databaseEntity?`: [`ObjectLiteral`](ObjectLiteral.md)) => `void`

#### Type declaration

(`metadata`, `entity?`, `databaseEntity?`): `void`

##### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](ObjectLiteral.md) |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:24

___

### AfterRemove

 **AfterRemove**: (`metadata`: [`EntityMetadata`](../classes/EntityMetadata.md), `entity?`: [`ObjectLiteral`](ObjectLiteral.md), `databaseEntity?`: [`ObjectLiteral`](ObjectLiteral.md)) => `void`

#### Type declaration

(`metadata`, `entity?`, `databaseEntity?`): `void`

##### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](ObjectLiteral.md) |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:20

___

### AfterSoftRemove

 **AfterSoftRemove**: (`metadata`: [`EntityMetadata`](../classes/EntityMetadata.md), `entity?`: [`ObjectLiteral`](ObjectLiteral.md), `databaseEntity?`: [`ObjectLiteral`](ObjectLiteral.md)) => `void`

#### Type declaration

(`metadata`, `entity?`, `databaseEntity?`): `void`

##### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](ObjectLiteral.md) |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:22

___

### AfterTransactionCommit

 **AfterTransactionCommit**: () => `void`

#### Type declaration

(): `void`

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:10

___

### AfterTransactionRollback

 **AfterTransactionRollback**: () => `void`

#### Type declaration

(): `void`

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:14

___

### AfterTransactionStart

 **AfterTransactionStart**: () => `void`

#### Type declaration

(): `void`

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:12

___

### AfterUpdate

 **AfterUpdate**: (`metadata`: [`EntityMetadata`](../classes/EntityMetadata.md), `entity?`: [`ObjectLiteral`](ObjectLiteral.md), `databaseEntity?`: [`ObjectLiteral`](ObjectLiteral.md), `updatedColumns?`: [`ColumnMetadata`](../classes/ColumnMetadata.md)[], `updatedRelations?`: [`RelationMetadata`](../classes/RelationMetadata.md)[]) => `void`

#### Type declaration

(`metadata`, `entity?`, `databaseEntity?`, `updatedColumns?`, `updatedRelations?`): `void`

##### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](ObjectLiteral.md) |
| `updatedColumns?` | [`ColumnMetadata`](../classes/ColumnMetadata.md)[] |
| `updatedRelations?` | [`RelationMetadata`](../classes/RelationMetadata.md)[] |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:16

___

### BeforeInsert

 **BeforeInsert**: (`metadata`: [`EntityMetadata`](../classes/EntityMetadata.md), `entity`: `undefined` \| [`ObjectLiteral`](ObjectLiteral.md)) => `void`

#### Type declaration

(`metadata`, `entity`): `void`

##### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `entity` | `undefined` \| [`ObjectLiteral`](ObjectLiteral.md) |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:17

___

### BeforeRecover

 **BeforeRecover**: (`metadata`: [`EntityMetadata`](../classes/EntityMetadata.md), `entity?`: [`ObjectLiteral`](ObjectLiteral.md), `databaseEntity?`: [`ObjectLiteral`](ObjectLiteral.md)) => `void`

#### Type declaration

(`metadata`, `entity?`, `databaseEntity?`): `void`

##### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](ObjectLiteral.md) |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:23

___

### BeforeRemove

 **BeforeRemove**: (`metadata`: [`EntityMetadata`](../classes/EntityMetadata.md), `entity?`: [`ObjectLiteral`](ObjectLiteral.md), `databaseEntity?`: [`ObjectLiteral`](ObjectLiteral.md)) => `void`

#### Type declaration

(`metadata`, `entity?`, `databaseEntity?`): `void`

##### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](ObjectLiteral.md) |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:19

___

### BeforeSoftRemove

 **BeforeSoftRemove**: (`metadata`: [`EntityMetadata`](../classes/EntityMetadata.md), `entity?`: [`ObjectLiteral`](ObjectLiteral.md), `databaseEntity?`: [`ObjectLiteral`](ObjectLiteral.md)) => `void`

#### Type declaration

(`metadata`, `entity?`, `databaseEntity?`): `void`

##### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](ObjectLiteral.md) |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:21

___

### BeforeTransactionCommit

 **BeforeTransactionCommit**: () => `void`

#### Type declaration

(): `void`

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:9

___

### BeforeTransactionRollback

 **BeforeTransactionRollback**: () => `void`

#### Type declaration

(): `void`

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:13

___

### BeforeTransactionStart

 **BeforeTransactionStart**: () => `void`

#### Type declaration

(): `void`

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:11

___

### BeforeUpdate

 **BeforeUpdate**: (`metadata`: [`EntityMetadata`](../classes/EntityMetadata.md), `entity?`: [`ObjectLiteral`](ObjectLiteral.md), `databaseEntity?`: [`ObjectLiteral`](ObjectLiteral.md), `updatedColumns?`: [`ColumnMetadata`](../classes/ColumnMetadata.md)[], `updatedRelations?`: [`RelationMetadata`](../classes/RelationMetadata.md)[]) => `void`

#### Type declaration

(`metadata`, `entity?`, `databaseEntity?`, `updatedColumns?`, `updatedRelations?`): `void`

##### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](ObjectLiteral.md) |
| `updatedColumns?` | [`ColumnMetadata`](../classes/ColumnMetadata.md)[] |
| `updatedRelations?` | [`RelationMetadata`](../classes/RelationMetadata.md)[] |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:15

___

### Load

 **Load**: (`metadata`: [`EntityMetadata`](../classes/EntityMetadata.md), `entities`: [`ObjectLiteral`](ObjectLiteral.md)[]) => `void`

#### Type declaration

(`metadata`, `entities`): `void`

##### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](../classes/EntityMetadata.md) |
| `entities` | [`ObjectLiteral`](ObjectLiteral.md)[] |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:25
