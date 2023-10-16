---
displayed_sidebar: jsClientSidebar
---

# Class: NoteService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).NoteService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`NoteService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/note.d.ts:20

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### noteRepository\_

• `Protected` `Readonly` **noteRepository\_**: `Repository`<[`Note`](internal-8.internal.Note.md)\>

#### Defined in

packages/medusa/dist/services/note.d.ts:19

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/note.d.ts:14

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### create

▸ **create**(`data`, `config?`): `Promise`<[`Note`](internal-8.internal.Note.md)\>

Creates a note associated with a given author

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`CreateNoteInput`](../interfaces/internal-8.CreateNoteInput.md) | the note to create |
| `config?` | `Object` | any configurations if needed, including meta data |
| `config.metadata` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | - |

#### Returns

`Promise`<[`Note`](internal-8.internal.Note.md)\>

resolves to the creation result

#### Defined in

packages/medusa/dist/services/note.d.ts:53

___

### delete

▸ **delete**(`noteId`): `Promise`<`void`\>

Deletes a given note

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noteId` | `string` | id of the note to delete |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/note.d.ts:67

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`Note`](internal-8.internal.Note.md)[]\>

Fetches all notes related to the given selector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Note`](internal-8.internal.Note.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Note`](internal-8.internal.Note.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[`Note`](internal-8.internal.Note.md)[]\>

notes related to the given search.

#### Defined in

packages/medusa/dist/services/note.d.ts:37

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`Note`](internal-8.internal.Note.md)[], `number`]\>

Fetches all notes related to the given selector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Note`](internal-8.internal.Note.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Note`](internal-8.internal.Note.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[[`Note`](internal-8.internal.Note.md)[], `number`]\>

notes related to the given search.

#### Defined in

packages/medusa/dist/services/note.d.ts:46

___

### retrieve

▸ **retrieve**(`noteId`, `config?`): `Promise`<[`Note`](internal-8.internal.Note.md)\>

Retrieves a specific note.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noteId` | `string` | the id of the note to retrieve. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Note`](internal-8.internal.Note.md)\> | any options needed to query for the result. |

#### Returns

`Promise`<[`Note`](internal-8.internal.Note.md)\>

which resolves to the requested note.

#### Defined in

packages/medusa/dist/services/note.d.ts:28

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### update

▸ **update**(`noteId`, `value`): `Promise`<[`Note`](internal-8.internal.Note.md)\>

Updates a given note with a new value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noteId` | `string` | the id of the note to update |
| `value` | `string` | the new value |

#### Returns

`Promise`<[`Note`](internal-8.internal.Note.md)\>

resolves to the updated element

#### Defined in

packages/medusa/dist/services/note.d.ts:62

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`NoteService`](internal-8.internal.NoteService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`NoteService`](internal-8.internal.NoteService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
