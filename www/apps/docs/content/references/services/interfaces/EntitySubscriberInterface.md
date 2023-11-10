# EntitySubscriberInterface

Classes that implement this interface are subscribers that subscribe for the specific events in the ORM.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Entity` | `object` |

## Methods

### afterInsert

`Optional` **afterInsert**(`event`): `void` \| `Promise`<`any`\>

Called after entity is inserted to the database.

#### Parameters

| Name |
| :------ |
| `event` | [`InsertEvent`](InsertEvent.md)<`Entity`\> |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:35

___

### afterLoad

`Optional` **afterLoad**(`entity`, `event?`): `void` \| `Promise`<`any`\>

Called after entity is loaded from the database.

For backward compatibility this signature is slightly different from the
others.  `event` was added later but is always provided (it is only
optional in the signature so that its introduction does not break
compilation for existing subscribers).

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |
| `event?` | [`LoadEvent`](LoadEvent.md)<`Entity`\> |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:27

___

### afterRecover

`Optional` **afterRecover**(`event`): `void` \| `Promise`<`any`\>

Called after entity is recovered in the database.

#### Parameters

| Name |
| :------ |
| `event` | [`RecoverEvent`](RecoverEvent.md)<`Entity`\> |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:67

___

### afterRemove

`Optional` **afterRemove**(`event`): `void` \| `Promise`<`any`\>

Called after entity is removed from the database.

#### Parameters

| Name |
| :------ |
| `event` | [`RemoveEvent`](RemoveEvent.md)<`Entity`\> |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:59

___

### afterSoftRemove

`Optional` **afterSoftRemove**(`event`): `void` \| `Promise`<`any`\>

Called after entity is soft removed from the database.

#### Parameters

| Name |
| :------ |
| `event` | [`SoftRemoveEvent`](SoftRemoveEvent.md)<`Entity`\> |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:63

___

### afterTransactionCommit

`Optional` **afterTransactionCommit**(`event`): `void` \| `Promise`<`any`\>

Called after transaction is committed.

#### Parameters

| Name |
| :------ |
| `event` | [`TransactionCommitEvent`](TransactionCommitEvent.md) |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:83

___

### afterTransactionRollback

`Optional` **afterTransactionRollback**(`event`): `void` \| `Promise`<`any`\>

Called after transaction rollback.

#### Parameters

| Name |
| :------ |
| `event` | [`TransactionRollbackEvent`](TransactionRollbackEvent.md) |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:91

___

### afterTransactionStart

`Optional` **afterTransactionStart**(`event`): `void` \| `Promise`<`any`\>

Called after transaction is started.

#### Parameters

| Name |
| :------ |
| `event` | [`TransactionStartEvent`](TransactionStartEvent.md) |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:75

___

### afterUpdate

`Optional` **afterUpdate**(`event`): `void` \| `Promise`<`any`\>

Called after entity is updated in the database.

#### Parameters

| Name |
| :------ |
| `event` | [`UpdateEvent`](UpdateEvent.md)<`Entity`\> |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:43

___

### beforeInsert

`Optional` **beforeInsert**(`event`): `void` \| `Promise`<`any`\>

Called before entity is inserted to the database.

#### Parameters

| Name |
| :------ |
| `event` | [`InsertEvent`](InsertEvent.md)<`Entity`\> |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:31

___

### beforeRecover

`Optional` **beforeRecover**(`event`): `void` \| `Promise`<`any`\>

Called before entity is recovered in the database.

#### Parameters

| Name |
| :------ |
| `event` | [`RecoverEvent`](RecoverEvent.md)<`Entity`\> |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:55

___

### beforeRemove

`Optional` **beforeRemove**(`event`): `void` \| `Promise`<`any`\>

Called before entity is removed from the database.

#### Parameters

| Name |
| :------ |
| `event` | [`RemoveEvent`](RemoveEvent.md)<`Entity`\> |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:47

___

### beforeSoftRemove

`Optional` **beforeSoftRemove**(`event`): `void` \| `Promise`<`any`\>

Called before entity is soft removed from the database.

#### Parameters

| Name |
| :------ |
| `event` | [`SoftRemoveEvent`](SoftRemoveEvent.md)<`Entity`\> |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:51

___

### beforeTransactionCommit

`Optional` **beforeTransactionCommit**(`event`): `void` \| `Promise`<`any`\>

Called before transaction is committed.

#### Parameters

| Name |
| :------ |
| `event` | [`TransactionCommitEvent`](TransactionCommitEvent.md) |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:79

___

### beforeTransactionRollback

`Optional` **beforeTransactionRollback**(`event`): `void` \| `Promise`<`any`\>

Called before transaction rollback.

#### Parameters

| Name |
| :------ |
| `event` | [`TransactionRollbackEvent`](TransactionRollbackEvent.md) |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:87

___

### beforeTransactionStart

`Optional` **beforeTransactionStart**(`event`): `void` \| `Promise`<`any`\>

Called before transaction is started.

#### Parameters

| Name |
| :------ |
| `event` | [`TransactionStartEvent`](TransactionStartEvent.md) |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:71

___

### beforeUpdate

`Optional` **beforeUpdate**(`event`): `void` \| `Promise`<`any`\>

Called before entity is updated in the database.

#### Parameters

| Name |
| :------ |
| `event` | [`UpdateEvent`](UpdateEvent.md)<`Entity`\> |

#### Returns

`void` \| `Promise`<`any`\>

-`void \| Promise<any\>`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:39

___

### listenTo

`Optional` **listenTo**(): `string` \| `Function`

Returns the class of the entity to which events will listen.
If this method is omitted, then subscriber will listen to events of all entities.

#### Returns

`string` \| `Function`

-`string \| Function`: (optional) 

#### Defined in

node_modules/typeorm/subscriber/EntitySubscriberInterface.d.ts:18
