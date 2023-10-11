# Class: ReturnReasonService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ReturnReasonService`**

## Constructors

### constructor

• **new ReturnReasonService**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/return-reason.ts:18](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/return-reason.ts#L18)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### retReasonRepo\_

• `Protected` `Readonly` **retReasonRepo\_**: `Repository`<`ReturnReason`\>

#### Defined in

[medusa/src/services/return-reason.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/return-reason.ts#L16)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(`data`): `Promise`<`ReturnReason`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateReturnReason` |

#### Returns

`Promise`<`ReturnReason`\>

#### Defined in

[medusa/src/services/return-reason.ts:25](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/return-reason.ts#L25)

___

### delete

▸ **delete**(`returnReasonId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnReasonId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/return-reason.ts:113](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/return-reason.ts#L113)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`ReturnReason`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ReturnReason`\> | the query object for find |
| `config` | `FindConfig`<`ReturnReason`\> | config object |

#### Returns

`Promise`<`ReturnReason`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/return-reason.ts:68](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/return-reason.ts#L68)

___

### retrieve

▸ **retrieve**(`returnReasonId`, `config?`): `Promise`<`ReturnReason`\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnReasonId` | `string` | id of order to retrieve |
| `config` | `FindConfig`<`ReturnReason`\> | config object |

#### Returns

`Promise`<`ReturnReason`\>

the order document

#### Defined in

[medusa/src/services/return-reason.ts:87](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/return-reason.ts#L87)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`id`, `data`): `Promise`<`ReturnReason`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `UpdateReturnReason` |

#### Returns

`Promise`<`ReturnReason`\>

#### Defined in

[medusa/src/services/return-reason.ts:46](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/return-reason.ts#L46)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ReturnReasonService`](ReturnReasonService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ReturnReasonService`](ReturnReasonService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
