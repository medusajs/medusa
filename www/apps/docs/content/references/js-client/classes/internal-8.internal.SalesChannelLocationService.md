---
displayed_sidebar: jsClientSidebar
---

# Class: SalesChannelLocationService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).SalesChannelLocationService

Service for managing the stock locations of sales channels

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`SalesChannelLocationService`**

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

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`IEventBusService`](../interfaces/internal-8.IEventBusService.md)

#### Defined in

packages/medusa/dist/services/sales-channel-location.d.ts:16

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### salesChannelService\_

• `Protected` `Readonly` **salesChannelService\_**: [`SalesChannelService`](internal-8.internal.SalesChannelService.md)

#### Defined in

packages/medusa/dist/services/sales-channel-location.d.ts:15

___

### stockLocationService\_

• `Protected` `Readonly` **stockLocationService\_**: [`IStockLocationService`](../interfaces/internal-8.IStockLocationService.md)

#### Defined in

packages/medusa/dist/services/sales-channel-location.d.ts:17

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

### associateLocation

▸ **associateLocation**(`salesChannelId`, `locationId`): `Promise`<`void`\>

Associates a sales channel with a stock location.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | The ID of the sales channel. |
| `locationId` | `string` | The ID of the stock location. |

#### Returns

`Promise`<`void`\>

A promise that resolves when the association has been created.

#### Defined in

packages/medusa/dist/services/sales-channel-location.d.ts:32

___

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

### listLocationIds

▸ **listLocationIds**(`salesChannelId`): `Promise`<`string`[]\>

Lists the stock locations associated with a sales channel.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` \| `string`[] | The ID of the sales channel. |

#### Returns

`Promise`<`string`[]\>

A promise that resolves with an array of location IDs.

#### Defined in

packages/medusa/dist/services/sales-channel-location.d.ts:38

___

### listSalesChannelIds

▸ **listSalesChannelIds**(`locationId`): `Promise`<`string`[]\>

Lists the sales channels associated with a stock location.

#### Parameters

| Name | Type |
| :------ | :------ |
| `locationId` | `string` |

#### Returns

`Promise`<`string`[]\>

A promise that resolves with an array of sales channel IDs.

#### Defined in

packages/medusa/dist/services/sales-channel-location.d.ts:44

___

### removeLocation

▸ **removeLocation**(`locationId`, `salesChannelId?`): `Promise`<`void`\>

Removes an association between a sales channel and a stock location.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `locationId` | `string` | The ID of the stock location. |
| `salesChannelId?` | `string` | The ID of the sales channel or undefined if all the sales channel will be affected. |

#### Returns

`Promise`<`void`\>

A promise that resolves when the association has been removed.

#### Defined in

packages/medusa/dist/services/sales-channel-location.d.ts:25

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

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`SalesChannelLocationService`](internal-8.internal.SalesChannelLocationService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`SalesChannelLocationService`](internal-8.internal.SalesChannelLocationService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
