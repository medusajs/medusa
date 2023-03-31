# Class: NoteService

## Hierarchy

- `TransactionBaseService`

  ↳ **`NoteService`**

## Constructors

### constructor

• **new NoteService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/note.ts:29](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/note.ts#L29)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/note.ts:27](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/note.ts#L27)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/note.ts:24](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/note.ts#L24)

___

### noteRepository\_

• `Protected` `Readonly` **noteRepository\_**: typeof `NoteRepository`

#### Defined in

[packages/medusa/src/services/note.ts:26](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/note.ts#L26)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/note.ts:25](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/note.ts#L25)

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

[packages/medusa/src/services/note.ts:18](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/note.ts#L18)

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

TransactionBaseService.atomicPhase\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### create

▸ **create**(`data`, `config?`): `Promise`<`Note`\>

Creates a note associated with a given author

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreateNoteInput` | the note to create |
| `config` | `Object` | any configurations if needed, including meta data |
| `config.metadata` | `Record`<`string`, `unknown`\> | - |

#### Returns

`Promise`<`Note`\>

resolves to the creation result

#### Defined in

[packages/medusa/src/services/note.ts:103](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/note.ts#L103)

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

[packages/medusa/src/services/note.ts:161](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/note.ts#L161)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Note`[]\>

Fetches all notes related to the given selector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Note`\> | the query object for find |
| `config` | `FindConfig`<`Note`\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<`Note`[]\>

notes related to the given search.

#### Defined in

[packages/medusa/src/services/note.ts:82](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/note.ts#L82)

___

### retrieve

▸ **retrieve**(`noteId`, `config?`): `Promise`<`Note`\>

Retrieves a specific note.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noteId` | `string` | the id of the note to retrieve. |
| `config` | `FindConfig`<`Note`\> | any options needed to query for the result. |

#### Returns

`Promise`<`Note`\>

which resolves to the requested note.

#### Defined in

[packages/medusa/src/services/note.ts:47](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/note.ts#L47)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### update

▸ **update**(`noteId`, `value`): `Promise`<`Note`\>

Updates a given note with a new value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noteId` | `string` | the id of the note to update |
| `value` | `string` | the new value |

#### Returns

`Promise`<`Note`\>

resolves to the updated element

#### Defined in

[packages/medusa/src/services/note.ts:139](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/note.ts#L139)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`NoteService`](NoteService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`NoteService`](NoteService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
