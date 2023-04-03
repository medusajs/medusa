# Class: ReturnReasonService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ReturnReasonService`**

## Constructors

### constructor

• **new ReturnReasonService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/return-reason.ts:21](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/return-reason.ts#L21)

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

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/return-reason.ts:18](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/return-reason.ts#L18)

___

### retReasonRepo\_

• `Protected` `Readonly` **retReasonRepo\_**: typeof `ReturnReasonRepository`

#### Defined in

[packages/medusa/src/services/return-reason.ts:16](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/return-reason.ts#L16)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/return-reason.ts:19](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/return-reason.ts#L19)

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

▸ **create**(`data`): `Promise`<`ReturnReason`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateReturnReason` |

#### Returns

`Promise`<`ReturnReason`\>

#### Defined in

[packages/medusa/src/services/return-reason.ts:29](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/return-reason.ts#L29)

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

[packages/medusa/src/services/return-reason.ts:117](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/return-reason.ts#L117)

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

[packages/medusa/src/services/return-reason.ts:72](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/return-reason.ts#L72)

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

[packages/medusa/src/services/return-reason.ts:91](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/return-reason.ts#L91)

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

▸ **update**(`id`, `data`): `Promise`<`ReturnReason`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `UpdateReturnReason` |

#### Returns

`Promise`<`ReturnReason`\>

#### Defined in

[packages/medusa/src/services/return-reason.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/return-reason.ts#L50)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
