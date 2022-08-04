# Class: NoteService

## Hierarchy

- `TransactionBaseService`<[`NoteService`](NoteService.md)\>

  ↳ **`NoteService`**

## Constructors

### constructor

• **new NoteService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;NoteService\&gt;.constructor

#### Defined in

[services/note.ts:29](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/note.ts#L29)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/note.ts:27](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/note.ts#L27)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/note.ts:24](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/note.ts#L24)

___

### noteRepository\_

• `Protected` `Readonly` **noteRepository\_**: typeof `NoteRepository`

#### Defined in

[services/note.ts:26](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/note.ts#L26)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/note.ts:25](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/note.ts#L25)

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

[services/note.ts:18](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/note.ts#L18)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### create

▸ **create**(`data`, `config?`): `Promise`<`Note`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreateNoteInput` |  |
| `config` | `Object` |  |
| `config.metadata` | `Record`<`string`, `unknown`\> | - |

#### Returns

`Promise`<`Note`\>

#### Defined in

[services/note.ts:96](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/note.ts#L96)

___

### delete

▸ **delete**(`noteId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noteId` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/note.ts:154](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/note.ts#L154)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Note`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Note`\> |  |
| `config` | `FindConfig`<`Note`\> |  |

#### Returns

`Promise`<`Note`[]\>

#### Defined in

[services/note.ts:75](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/note.ts#L75)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Note`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `FindConfig`<`Note`\> |  |

#### Returns

`Promise`<`Note`\>

#### Defined in

[services/note.ts:47](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/note.ts#L47)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`noteId`, `value`): `Promise`<`Note`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `noteId` | `string` |  |
| `value` | `string` |  |

#### Returns

`Promise`<`Note`\>

#### Defined in

[services/note.ts:132](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/note.ts#L132)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
