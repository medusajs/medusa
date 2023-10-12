---
displayed_sidebar: jsClientSidebar
---

# Class: ReturnReasonService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ReturnReasonService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ReturnReasonService`**

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

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### retReasonRepo\_

• `Protected` `Readonly` **retReasonRepo\_**: `Repository`<[`ReturnReason`](internal-3.ReturnReason.md)\>

#### Defined in

packages/medusa/dist/services/return-reason.d.ts:12

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

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

▸ **create**(`data`): `Promise`<[`ReturnReason`](internal-3.ReturnReason.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreateReturnReason`](../modules/internal-8.md#createreturnreason) |

#### Returns

`Promise`<[`ReturnReason`](internal-3.ReturnReason.md)\>

#### Defined in

packages/medusa/dist/services/return-reason.d.ts:14

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

packages/medusa/dist/services/return-reason.d.ts:29

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`ReturnReason`](internal-3.ReturnReason.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`ReturnReason`](internal-3.ReturnReason.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ReturnReason`](internal-3.ReturnReason.md)\> | config object |

#### Returns

`Promise`<[`ReturnReason`](internal-3.ReturnReason.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/return-reason.d.ts:21

___

### retrieve

▸ **retrieve**(`returnReasonId`, `config?`): `Promise`<[`ReturnReason`](internal-3.ReturnReason.md)\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnReasonId` | `string` | id of order to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ReturnReason`](internal-3.ReturnReason.md)\> | config object |

#### Returns

`Promise`<[`ReturnReason`](internal-3.ReturnReason.md)\>

the order document

#### Defined in

packages/medusa/dist/services/return-reason.d.ts:28

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

▸ **update**(`id`, `data`): `Promise`<[`ReturnReason`](internal-3.ReturnReason.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | [`UpdateReturnReason`](../modules/internal-8.md#updatereturnreason) |

#### Returns

`Promise`<[`ReturnReason`](internal-3.ReturnReason.md)\>

#### Defined in

packages/medusa/dist/services/return-reason.d.ts:15

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ReturnReasonService`](internal-8.internal.ReturnReasonService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ReturnReasonService`](internal-8.internal.ReturnReasonService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
