---
displayed_sidebar: jsClientSidebar
---

# Class: SalesChannelService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).SalesChannelService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`SalesChannelService`**

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

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:22

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### salesChannelRepository\_

• `Protected` `Readonly` **salesChannelRepository\_**: `Repository`<[`SalesChannel`](internal-3.SalesChannel.md)\> & { `addProducts`: (`salesChannelId`: `string`, `productIds`: `string`[]) => `Promise`<`void`\> ; `getFreeTextSearchResultsAndCount`: (`q`: `string`, `options?`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`SalesChannel`](internal-3.SalesChannel.md)\>) => `Promise`<[[`SalesChannel`](internal-3.SalesChannel.md)[], `number`]\> ; `listProductIdsBySalesChannelIds`: (`salesChannelIds`: `string` \| `string`[]) => `Promise`<{ `[salesChannelId: string]`: `string`[];  }\> ; `removeProducts`: (`salesChannelId`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\>  }

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:21

___

### storeService\_

• `Protected` `Readonly` **storeService\_**: [`StoreService`](internal-8.internal.StoreService.md)

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:23

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
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:16

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

### addProducts

▸ **addProducts**(`salesChannelId`, `productIds`): `Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

Add a batch of product to a sales channel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | The id of the sales channel on which to add the products |
| `productIds` | `string`[] | The products ids to attach to the sales channel |

#### Returns

`Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

the sales channel on which the products have been added

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:106

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

### create

▸ **create**(`data`): `Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

Creates a SalesChannel

 This feature is under development and may change in the future.
To use this feature please enable the corresponding feature flag in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreateSalesChannelInput`](../modules/internal-8.md#createsaleschannelinput) |

#### Returns

`Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

the created channel

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:66

___

### createDefault

▸ **createDefault**(): `Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

Creates a default sales channel, if this does not already exist.

#### Returns

`Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

the sales channel

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:79

___

### delete

▸ **delete**(`salesChannelId`): `Promise`<`void`\>

Deletes a sales channel from
 This feature is under development and may change in the future.
To use this feature please enable the corresponding feature flag in your medusa backend project.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | the id of the sales channel to delete |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:74

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`SalesChannel`](internal-3.SalesChannel.md)[], `number`]\>

Lists sales channels based on the provided parameters and includes the count of
sales channels that match the query.

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`SalesChannel`](internal-3.SalesChannel.md)\> |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`SalesChannel`](internal-3.SalesChannel.md)\> |

#### Returns

`Promise`<[[`SalesChannel`](internal-3.SalesChannel.md)[], `number`]\>

an array containing the sales channels as
  the first element and the total count of sales channels that matches the query
  as the second element.

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:58

___

### listProductIdsBySalesChannelIds

▸ **listProductIdsBySalesChannelIds**(`salesChannelIds`): `Promise`<{ `[salesChannelId: string]`: `string`[];  }\>

List all product ids that belongs to the sales channels ids

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelIds` | `string` \| `string`[] |

#### Returns

`Promise`<{ `[salesChannelId: string]`: `string`[];  }\>

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:90

___

### removeProducts

▸ **removeProducts**(`salesChannelId`, `productIds`): `Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

Remove a batch of product from a sales channel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | The id of the sales channel on which to remove the products |
| `productIds` | `string`[] | The products ids to remove from the sales channel |

#### Returns

`Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

the sales channel on which the products have been removed

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:99

___

### retrieve

▸ **retrieve**(`salesChannelId`, `config?`): `Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

Retrieve a SalesChannel by id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | id of the channel to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`SalesChannel`](internal-3.SalesChannel.md)\> | SC config This feature is under development and may change in the future. To use this feature please enable the corresponding feature flag in your medusa backend project. |

#### Returns

`Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

a sales channel

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:42

___

### retrieveByName

▸ **retrieveByName**(`name`, `config?`): `Promise`<`unknown`\>

Find a sales channel by name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | of the sales channel |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`SalesChannel`](internal-3.SalesChannel.md)\> | find config |

#### Returns

`Promise`<`unknown`\>

a sales channel with matching name

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:50

___

### retrieveDefault

▸ **retrieveDefault**(): `Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

Retrieves the default sales channel.

#### Returns

`Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

the sales channel

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:84

___

### retrieve\_

▸ `Protected` **retrieve_**(`selector`, `config?`): `Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

A generic retrieve used to find a sales channel by different attributes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`SalesChannel`](internal-3.SalesChannel.md)\> | SC selector |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`SalesChannel`](internal-3.SalesChannel.md)\> | find config |

#### Returns

`Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

a single SC matching the query or throws

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:32

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

▸ **update**(`salesChannelId`, `data`): `Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `data` | [`Partial`](../modules/internal-8.md#partial)<[`CreateSalesChannelInput`](../modules/internal-8.md#createsaleschannelinput)\> |

#### Returns

`Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

#### Defined in

packages/medusa/dist/services/sales-channel.d.ts:67

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`SalesChannelService`](internal-8.internal.SalesChannelService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`SalesChannelService`](internal-8.internal.SalesChannelService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
