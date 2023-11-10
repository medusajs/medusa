# NoteService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`NoteService`**

## Constructors

### constructor

**new NoteService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-16.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/note.ts:28](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/note.ts#L28)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/note.ts:26](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/note.ts#L26)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### noteRepository\_

 `Protected` `Readonly` **noteRepository\_**: [`Repository`](Repository.md)<[`Note`](Note.md)\>

#### Defined in

[packages/medusa/src/services/note.ts:25](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/note.ts#L25)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/note.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/note.ts#L19)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(`data`, `config?`): `Promise`<[`Note`](Note.md)\>

Creates a note associated with a given author

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`CreateNoteInput`](../interfaces/CreateNoteInput.md) | the note to create |
| `config` | `object` | any configurations if needed, including meta data |
| `config.metadata` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<[`Note`](Note.md)\>

-`Promise`: resolves to the creation result
	-`Note`: 

#### Defined in

[packages/medusa/src/services/note.ts:119](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/note.ts#L119)

___

### delete

**delete**(`noteId`): `Promise`<`void`\>

Deletes a given note

#### Parameters

| Name | Description |
| :------ | :------ |
| `noteId` | `string` | id of the note to delete |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/note.ts:177](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/note.ts#L177)

___

### list

**list**(`selector`, `config?`): `Promise`<[`Note`](Note.md)[]\>

Fetches all notes related to the given selector

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../types/Selector.md)<[`Note`](Note.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Note`](Note.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[`Note`](Note.md)[]\>

-`Promise`: notes related to the given search.
	-`Note[]`: 
		-`Note`: 

#### Defined in

[packages/medusa/src/services/note.ts:77](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/note.ts#L77)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[[`Note`](Note.md)[], `number`]\>

Fetches all notes related to the given selector

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../types/Selector.md)<[`Note`](Note.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Note`](Note.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[[`Note`](Note.md)[], `number`]\>

-`Promise`: notes related to the given search.
	-`Note[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/note.ts:98](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/note.ts#L98)

___

### retrieve

**retrieve**(`noteId`, `config?`): `Promise`<[`Note`](Note.md)\>

Retrieves a specific note.

#### Parameters

| Name | Description |
| :------ | :------ |
| `noteId` | `string` | the id of the note to retrieve. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Note`](Note.md)\> | any options needed to query for the result. |

#### Returns

`Promise`<[`Note`](Note.md)\>

-`Promise`: which resolves to the requested note.
	-`Note`: 

#### Defined in

[packages/medusa/src/services/note.ts:42](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/note.ts#L42)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`noteId`, `value`): `Promise`<[`Note`](Note.md)\>

Updates a given note with a new value

#### Parameters

| Name | Description |
| :------ | :------ |
| `noteId` | `string` | the id of the note to update |
| `value` | `string` | the new value |

#### Returns

`Promise`<[`Note`](Note.md)\>

-`Promise`: resolves to the updated element
	-`Note`: 

#### Defined in

[packages/medusa/src/services/note.ts:155](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/note.ts#L155)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`NoteService`](NoteService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`NoteService`](NoteService.md)

-`NoteService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
