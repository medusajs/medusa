# Broadcaster

Broadcaster provides a helper methods to broadcast events to the subscribers.

## Constructors

### constructor

**new Broadcaster**(`queryRunner`)

#### Parameters

| Name |
| :------ |
| `queryRunner` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:32

## Properties

### queryRunner

 `Private` **queryRunner**: `any`

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:31

## Methods

### broadcast

**broadcast**<`U`\>(`event`, `...args`): `Promise`<`void`\>

| Name | Type |
| :------ | :------ |
| `U` | keyof [`BroadcasterEvents`](../interfaces/BroadcasterEvents.md) |

#### Parameters

| Name |
| :------ |
| `event` | `U` |
| `...args` | [`Parameters`](../types/Parameters.md)<[`BroadcasterEvents`](../interfaces/BroadcasterEvents.md)[`U`]\> |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:33

___

### broadcastAfterInsertEvent

**broadcastAfterInsertEvent**(`result`, `metadata`, `entity?`): `void`

Broadcasts "AFTER_INSERT" event.
After insert event is executed after entity is being persisted to the database for the first time.
All subscribers and entity listeners who listened to this event will be executed at this point.
Subscribers and entity listeners can return promises, it will wait until they are resolved.

Note: this method has a performance-optimized code organization, do not change code structure.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:87

___

### broadcastAfterRecoverEvent

**broadcastAfterRecoverEvent**(`result`, `metadata`, `entity?`, `databaseEntity?`, `identifier?`): `void`

Broadcasts "AFTER_RECOVER" event.
After recover event is executed after entity is being recovered in the database.
All subscribers and entity listeners who listened to this event will be executed at this point.
Subscribers and entity listeners can return promises, it will wait until they are resolved.

Note: this method has a performance-optimized code organization, do not change code structure.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `identifier?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:147

___

### broadcastAfterRemoveEvent

**broadcastAfterRemoveEvent**(`result`, `metadata`, `entity?`, `databaseEntity?`, `identifier?`): `void`

Broadcasts "AFTER_REMOVE" event.
After remove event is executed after entity is being removed from the database.
All subscribers and entity listeners who listened to this event will be executed at this point.
Subscribers and entity listeners can return promises, it will wait until they are resolved.

Note: this method has a performance-optimized code organization, do not change code structure.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `identifier?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:129

___

### broadcastAfterSoftRemoveEvent

**broadcastAfterSoftRemoveEvent**(`result`, `metadata`, `entity?`, `databaseEntity?`, `identifier?`): `void`

Broadcasts "AFTER_SOFT_REMOVE" event.
After soft remove event is executed after entity is being soft removed from the database.
All subscribers and entity listeners who listened to this event will be executed at this point.
Subscribers and entity listeners can return promises, it will wait until they are resolved.

Note: this method has a performance-optimized code organization, do not change code structure.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `identifier?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:138

___

### broadcastAfterTransactionCommitEvent

**broadcastAfterTransactionCommitEvent**(`result`): `void`

Broadcasts "AFTER_TRANSACTION_COMMIT" event.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:103

___

### broadcastAfterTransactionRollbackEvent

**broadcastAfterTransactionRollbackEvent**(`result`): `void`

Broadcasts "AFTER_TRANSACTION_ROLLBACK" event.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:111

___

### broadcastAfterTransactionStartEvent

**broadcastAfterTransactionStartEvent**(`result`): `void`

Broadcasts "AFTER_TRANSACTION_START" event.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:95

___

### broadcastAfterUpdateEvent

**broadcastAfterUpdateEvent**(`result`, `metadata`, `entity?`, `databaseEntity?`, `updatedColumns?`, `updatedRelations?`): `void`

Broadcasts "AFTER_UPDATE" event.
After update event is executed after entity is being updated in the database.
All subscribers and entity listeners who listened to this event will be executed at this point.
Subscribers and entity listeners can return promises, it will wait until they are resolved.

Note: this method has a performance-optimized code organization, do not change code structure.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `updatedColumns?` | [`ColumnMetadata`](ColumnMetadata.md)[] |
| `updatedRelations?` | [`RelationMetadata`](RelationMetadata.md)[] |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:120

___

### broadcastBeforeInsertEvent

**broadcastBeforeInsertEvent**(`result`, `metadata`, `entity`): `void`

Broadcasts "BEFORE_INSERT" event.
Before insert event is executed before entity is being inserted to the database for the first time.
All subscribers and entity listeners who listened to this event will be executed at this point.
Subscribers and entity listeners can return promises, it will wait until they are resolved.

Note: this method has a performance-optimized code organization, do not change code structure.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity` | `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:42

___

### broadcastBeforeRecoverEvent

**broadcastBeforeRecoverEvent**(`result`, `metadata`, `entity?`, `databaseEntity?`, `identifier?`): `void`

Broadcasts "BEFORE_RECOVER" event.
Before recover event is executed before entity is being recovered in the database.
All subscribers and entity listeners who listened to this event will be executed at this point.
Subscribers and entity listeners can return promises, it will wait until they are resolved.

Note: this method has a performance-optimized code organization, do not change code structure.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `identifier?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:78

___

### broadcastBeforeRemoveEvent

**broadcastBeforeRemoveEvent**(`result`, `metadata`, `entity?`, `databaseEntity?`, `identifier?`): `void`

Broadcasts "BEFORE_REMOVE" event.
Before remove event is executed before entity is being removed from the database.
All subscribers and entity listeners who listened to this event will be executed at this point.
Subscribers and entity listeners can return promises, it will wait until they are resolved.

Note: this method has a performance-optimized code organization, do not change code structure.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `identifier?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:60

___

### broadcastBeforeSoftRemoveEvent

**broadcastBeforeSoftRemoveEvent**(`result`, `metadata`, `entity?`, `databaseEntity?`, `identifier?`): `void`

Broadcasts "BEFORE_SOFT_REMOVE" event.
Before soft remove event is executed before entity is being soft removed from the database.
All subscribers and entity listeners who listened to this event will be executed at this point.
Subscribers and entity listeners can return promises, it will wait until they are resolved.

Note: this method has a performance-optimized code organization, do not change code structure.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `identifier?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:69

___

### broadcastBeforeTransactionCommitEvent

**broadcastBeforeTransactionCommitEvent**(`result`): `void`

Broadcasts "BEFORE_TRANSACTION_COMMIT" event.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:99

___

### broadcastBeforeTransactionRollbackEvent

**broadcastBeforeTransactionRollbackEvent**(`result`): `void`

Broadcasts "BEFORE_TRANSACTION_ROLLBACK" event.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:107

___

### broadcastBeforeTransactionStartEvent

**broadcastBeforeTransactionStartEvent**(`result`): `void`

Broadcasts "BEFORE_TRANSACTION_START" event.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:91

___

### broadcastBeforeUpdateEvent

**broadcastBeforeUpdateEvent**(`result`, `metadata`, `entity?`, `databaseEntity?`, `updatedColumns?`, `updatedRelations?`): `void`

Broadcasts "BEFORE_UPDATE" event.
Before update event is executed before entity is being updated in the database.
All subscribers and entity listeners who listened to this event will be executed at this point.
Subscribers and entity listeners can return promises, it will wait until they are resolved.

Note: this method has a performance-optimized code organization, do not change code structure.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `databaseEntity?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `updatedColumns?` | [`ColumnMetadata`](ColumnMetadata.md)[] |
| `updatedRelations?` | [`RelationMetadata`](RelationMetadata.md)[] |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:51

___

### broadcastLoadEvent

**broadcastLoadEvent**(`result`, `metadata`, `entities`): `void`

Broadcasts "AFTER_LOAD" event for all given entities, and their sub-entities.
After load event is executed after entity has been loaded from the database.
All subscribers and entity listeners who listened to this event will be executed at this point.
Subscribers and entity listeners can return promises, it will wait until they are resolved.

Note: this method has a performance-optimized code organization, do not change code structure.

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entities` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:160

___

### broadcastLoadEventsForAll

**broadcastLoadEventsForAll**(`result`, `metadata`, `entities`): `void`

#### Parameters

| Name |
| :------ |
| `result` | [`BroadcasterResult`](BroadcasterResult.md) |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entities` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |

#### Returns

`void`

-`void`: (optional) 

**Deprecated**

Use `broadcastLoadForAllEvent`

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:151

___

### isAllowedSubscriber

`Protected` **isAllowedSubscriber**(`subscriber`, `target`): `boolean`

Checks if subscriber's methods can be executed by checking if its don't listen to the particular entity,
or listens our entity.

#### Parameters

| Name |
| :------ |
| `subscriber` | [`EntitySubscriberInterface`](../interfaces/EntitySubscriberInterface.md)<`any`\> |
| `target` | `string` \| `Function` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/Broadcaster.d.ts:165
