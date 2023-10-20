---
displayed_sidebar: jsClientSidebar
---

# Class: ClaimItemService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ClaimItemService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ClaimItemService`**

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

### claimImageRepository\_

• `Protected` `Readonly` **claimImageRepository\_**: `Repository`<[`ClaimImage`](internal-3.ClaimImage.md)\>

#### Defined in

packages/medusa/dist/services/claim-item.d.ts:20

___

### claimItemRepository\_

• `Protected` `Readonly` **claimItemRepository\_**: `Repository`<[`ClaimItem`](internal-3.ClaimItem.md)\>

#### Defined in

packages/medusa/dist/services/claim-item.d.ts:18

___

### claimTagRepository\_

• `Protected` `Readonly` **claimTagRepository\_**: `Repository`<[`ClaimTag`](internal-3.ClaimTag.md)\>

#### Defined in

packages/medusa/dist/services/claim-item.d.ts:19

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/claim-item.d.ts:17

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](internal-8.internal.LineItemService.md)

#### Defined in

packages/medusa/dist/services/claim-item.d.ts:16

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/claim-item.d.ts:11

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

▸ **create**(`data`): `Promise`<[`ClaimItem`](internal-3.ClaimItem.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreateClaimItemInput`](../modules/internal-8.md#createclaimiteminput) |

#### Returns

`Promise`<[`ClaimItem`](internal-3.ClaimItem.md)\>

#### Defined in

packages/medusa/dist/services/claim-item.d.ts:28

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`ClaimItem`](internal-3.ClaimItem.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`ClaimItem`](internal-3.ClaimItem.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ClaimItem`](internal-3.ClaimItem.md)\> | the config object for find |

#### Returns

`Promise`<[`ClaimItem`](internal-3.ClaimItem.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/claim-item.d.ts:35

___

### retrieve

▸ **retrieve**(`claimItemId`, `config?`): `Promise`<[`ClaimItem`](internal-3.ClaimItem.md)\>

Gets a claim item by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `claimItemId` | `string` | id of ClaimItem to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ClaimItem`](internal-3.ClaimItem.md)\> | configuration for the find operation |

#### Returns

`Promise`<[`ClaimItem`](internal-3.ClaimItem.md)\>

the ClaimItem

#### Defined in

packages/medusa/dist/services/claim-item.d.ts:42

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

▸ **update**(`id`, `data`): `Promise`<[`ClaimItem`](internal-3.ClaimItem.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `data` | `any` |

#### Returns

`Promise`<[`ClaimItem`](internal-3.ClaimItem.md)\>

#### Defined in

packages/medusa/dist/services/claim-item.d.ts:29

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ClaimItemService`](internal-8.internal.ClaimItemService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ClaimItemService`](internal-8.internal.ClaimItemService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
