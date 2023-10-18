---
displayed_sidebar: jsClientSidebar
---

# Class: ReturnService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ReturnService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ReturnService`**

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

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/return.d.ts:37

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](internal-8.internal.FulfillmentProviderService.md)

#### Defined in

packages/medusa/dist/services/return.d.ts:33

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](internal-8.internal.LineItemService.md)

#### Defined in

packages/medusa/dist/services/return.d.ts:30

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### orderService\_

• `Protected` `Readonly` **orderService\_**: [`OrderService`](internal-8.internal.OrderService.md)

#### Defined in

packages/medusa/dist/services/return.d.ts:35

___

### productVariantInventoryService\_

• `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](internal-8.internal.ProductVariantInventoryService.md)

#### Defined in

packages/medusa/dist/services/return.d.ts:36

___

### returnItemRepository\_

• `Protected` `Readonly` **returnItemRepository\_**: `Repository`<[`ReturnItem`](internal-3.ReturnItem.md)\>

#### Defined in

packages/medusa/dist/services/return.d.ts:29

___

### returnReasonService\_

• `Protected` `Readonly` **returnReasonService\_**: [`ReturnReasonService`](internal-8.internal.ReturnReasonService.md)

#### Defined in

packages/medusa/dist/services/return.d.ts:34

___

### returnRepository\_

• `Protected` `Readonly` **returnRepository\_**: `Repository`<[`Return`](internal-3.Return.md)\>

#### Defined in

packages/medusa/dist/services/return.d.ts:28

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](internal-8.internal.ShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/return.d.ts:32

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](internal-8.internal.TaxProviderService.md)

#### Defined in

packages/medusa/dist/services/return.d.ts:31

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](internal-8.internal.TotalsService.md)

#### Defined in

packages/medusa/dist/services/return.d.ts:27

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

### cancel

▸ **cancel**(`returnId`): `Promise`<[`Return`](internal-3.Return.md)\>

Cancels a return if possible. Returns can be canceled if it has not been received.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnId` | `string` | the id of the return to cancel. |

#### Returns

`Promise`<[`Return`](internal-3.Return.md)\>

the updated Return

#### Defined in

packages/medusa/dist/services/return.d.ts:70

___

### create

▸ **create**(`data`): `Promise`<[`Return`](internal-3.Return.md)\>

Creates a return request for an order, with given items, and a shipping
method. If no refund amount is provided the refund amount is calculated from
the return lines and the shipping cost.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`CreateReturnInput`](../modules/internal-8.md#createreturninput) | data to use for the return e.g. shipping_method, items or refund_amount |

#### Returns

`Promise`<[`Return`](internal-3.Return.md)\>

the created return

#### Defined in

packages/medusa/dist/services/return.d.ts:111

___

### fulfill

▸ **fulfill**(`returnId`): `Promise`<[`Return`](internal-3.Return.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnId` | `string` |

#### Returns

`Promise`<[`Return`](internal-3.Return.md)\>

#### Defined in

packages/medusa/dist/services/return.d.ts:112

___

### getFulfillmentItems

▸ `Protected` **getFulfillmentItems**(`order`, `items`, `transformer`): `Promise`<[`LineItem`](internal-3.LineItem.md) & { `note?`: `string` ; `reason_id?`: `string`  }[]\>

Retrieves the order line items, given an array of items

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | the order to get line items from |
| `items` | [`OrdersReturnItem`](internal-8.OrdersReturnItem.md)[] | the items to get |
| `transformer` | [`Transformer`](../modules/internal-8.md#transformer) | a function to apply to each of the items retrieved from the order, should return a line item. If the transformer returns an undefined value the line item will be filtered from the returned array. |

#### Returns

`Promise`<[`LineItem`](internal-3.LineItem.md) & { `note?`: `string` ; `reason_id?`: `string`  }[]\>

the line items generated by the transformer.

#### Defined in

packages/medusa/dist/services/return.d.ts:49

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`Return`](internal-3.Return.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Return`](internal-3.Return.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Return`](internal-3.Return.md)\> | the config object for find |

#### Returns

`Promise`<[`Return`](internal-3.Return.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/return.d.ts:58

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`Return`](internal-3.Return.md)[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Return`](internal-3.Return.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Return`](internal-3.Return.md)\> | the config object for find |

#### Returns

`Promise`<[[`Return`](internal-3.Return.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/return.d.ts:64

___

### receive

▸ **receive**(`returnId`, `receivedItems`, `refundAmount?`, `allowMismatch?`, `context?`): `Promise`<[`Return`](internal-3.Return.md)\>

Registers a previously requested return as received. This will create a
refund to the customer. If the returned items don't match the requested
items the return status will be updated to requires_action. This behaviour
is useful in situations where a custom refund amount is requested, but the
returned items are not matching the requested items. Setting the
allowMismatch argument to true, will process the return, ignoring any
mismatches.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnId` | `string` | the orderId to return to |
| `receivedItems` | [`OrdersReturnItem`](internal-8.OrdersReturnItem.md)[] | the items received after return. |
| `refundAmount?` | `number` | the amount to return |
| `allowMismatch?` | `boolean` | whether to ignore return/received product mismatch |
| `context?` | `Object` | - |
| `context.locationId?` | `string` | - |

#### Returns

`Promise`<[`Return`](internal-3.Return.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/return.d.ts:128

___

### retrieve

▸ **retrieve**(`returnId`, `config?`): `Promise`<[`Return`](internal-3.Return.md)\>

Retrieves a return by its id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnId` | `string` | the id of the return to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Return`](internal-3.Return.md)\> | the config object |

#### Returns

`Promise`<[`Return`](internal-3.Return.md)\>

the return

#### Defined in

packages/medusa/dist/services/return.d.ts:100

___

### retrieveBySwap

▸ **retrieveBySwap**(`swapId`, `relations?`): `Promise`<[`Return`](internal-3.Return.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapId` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<[`Return`](internal-3.Return.md)\>

#### Defined in

packages/medusa/dist/services/return.d.ts:101

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

▸ **update**(`returnId`, `update`): `Promise`<[`Return`](internal-3.Return.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnId` | `string` |
| `update` | [`UpdateReturnInput`](../modules/internal-8.md#updatereturninput) |

#### Returns

`Promise`<[`Return`](internal-3.Return.md)\>

#### Defined in

packages/medusa/dist/services/return.d.ts:102

___

### validateReturnLineItem

▸ `Protected` **validateReturnLineItem**(`item?`, `quantity?`, `additional?`): `DeepPartial`<[`LineItem`](internal-3.LineItem.md)\>

Checks that a given quantity of a line item can be returned. Fails if the
item is undefined or if the returnable quantity of the item is lower, than
the quantity that is requested to be returned.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item?` | [`LineItem`](internal-3.LineItem.md) | the line item to check has sufficient returnable quantity. |
| `quantity?` | `number` | the quantity that is requested to be returned. |
| `additional?` | `Object` | the quantity that is requested to be returned. |
| `additional.note?` | `string` | - |
| `additional.reason_id?` | `string` | - |

#### Returns

`DeepPartial`<[`LineItem`](internal-3.LineItem.md)\>

a line item where the quantity is set to the requested
  return quantity.

#### Defined in

packages/medusa/dist/services/return.d.ts:90

___

### validateReturnStatuses

▸ `Protected` **validateReturnStatuses**(`order`): `void`

Checks that an order has the statuses necessary to complete a return.
fulfillment_status cannot be not_fulfilled or returned.
payment_status must be captured.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | the order to check statuses on |

#### Returns

`void`

**`Throws`**

when statuses are not sufficient for returns.

#### Defined in

packages/medusa/dist/services/return.d.ts:78

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ReturnService`](internal-8.internal.ReturnService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ReturnService`](internal-8.internal.ReturnService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
