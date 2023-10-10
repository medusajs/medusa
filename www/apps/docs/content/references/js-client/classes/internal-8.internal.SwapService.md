---
displayed_sidebar: jsClientSidebar
---

# Class: SwapService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).SwapService

Handles swaps

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`SwapService`**

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

### cartService\_

• `Protected` `Readonly` **cartService\_**: [`CartService`](internal-8.internal.CartService.md)

#### Defined in

packages/medusa/dist/services/swap.d.ts:40

___

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](internal-8.internal.CustomShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/swap.d.ts:50

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/swap.d.ts:41

___

### fulfillmentService\_

• `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](internal-8.FulfillmentService.md)

#### Defined in

packages/medusa/dist/services/swap.d.ts:46

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](internal-8.internal.LineItemAdjustmentService.md)

#### Defined in

packages/medusa/dist/services/swap.d.ts:49

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](internal-8.internal.LineItemService.md)

#### Defined in

packages/medusa/dist/services/swap.d.ts:45

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

packages/medusa/dist/services/swap.d.ts:42

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](internal-8.internal.PaymentProviderService.md)

#### Defined in

packages/medusa/dist/services/swap.d.ts:48

___

### productVariantInventoryService\_

• `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](internal-8.internal.ProductVariantInventoryService.md)

#### Defined in

packages/medusa/dist/services/swap.d.ts:51

___

### returnService\_

• `Protected` `Readonly` **returnService\_**: [`ReturnService`](internal-8.internal.ReturnService.md)

#### Defined in

packages/medusa/dist/services/swap.d.ts:43

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](internal-8.internal.ShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/swap.d.ts:47

___

### swapRepository\_

• `Protected` `Readonly` **swapRepository\_**: `Repository`<[`Swap`](internal-3.Swap.md)\>

#### Defined in

packages/medusa/dist/services/swap.d.ts:39

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](internal-8.internal.TotalsService.md)

#### Defined in

packages/medusa/dist/services/swap.d.ts:44

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
| `FULFILLMENT_CREATED` | `string` |
| `PAYMENT_CAPTURED` | `string` |
| `PAYMENT_CAPTURE_FAILED` | `string` |
| `PAYMENT_COMPLETED` | `string` |
| `PROCESS_REFUND_FAILED` | `string` |
| `RECEIVED` | `string` |
| `REFUND_PROCESSED` | `string` |
| `SHIPMENT_CREATED` | `string` |

#### Defined in

packages/medusa/dist/services/swap.d.ts:28

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

### areReturnItemsValid

▸ `Protected` **areReturnItemsValid**(`returnItems`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnItems` | [`WithRequiredProperty`](../modules/internal-8.internal.md#withrequiredproperty)<[`Partial`](../modules/internal-8.md#partial)<[`ReturnItem`](internal-3.ReturnItem.md)\>, ``"item_id"``\>[] |

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/medusa/dist/services/swap.d.ts:214

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

### cancel

▸ **cancel**(`swapId`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Cancels a given swap if possible. A swap can only be canceled if all
related returns, fulfillments, and payments have been canceled. If a swap
is associated with a refund, it cannot be canceled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to cancel. |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

the canceled swap.

#### Defined in

packages/medusa/dist/services/swap.d.ts:169

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Cancels a fulfillment (if related to a swap)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the ID of the fulfillment to cancel |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

updated swap

#### Defined in

packages/medusa/dist/services/swap.d.ts:185

___

### create

▸ **create**(`order`, `returnItems`, `additionalItems?`, `returnShipping?`, `custom?`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Creates a swap from an order, with given return items, additional items
and an optional return shipping method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | the order to base the swap off |
| `returnItems` | [`WithRequiredProperty`](../modules/internal-8.internal.md#withrequiredproperty)<[`Partial`](../modules/internal-8.md#partial)<[`ReturnItem`](internal-3.ReturnItem.md)\>, ``"item_id"``\>[] | the items to return in the swap |
| `additionalItems?` | [`Pick`](../modules/internal-1.md#pick)<[`LineItem`](internal-3.LineItem.md), ``"variant_id"`` \| ``"quantity"``\>[] | the items to send to the customer |
| `returnShipping?` | `Object` | an optional shipping method for returning the returnItems |
| `returnShipping.option_id` | `string` | - |
| `returnShipping.price?` | `number` | - |
| `custom?` | `Object` | contains relevant custom information. This object may include no_notification which will disable sending notification when creating swap. If set, it overrules the attribute inherited from the order |
| `custom.allow_backorder?` | `boolean` | - |
| `custom.idempotency_key?` | `string` | - |
| `custom.location_id?` | `string` | - |
| `custom.no_notification?` | `boolean` | - |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

the newly created swap

#### Defined in

packages/medusa/dist/services/swap.d.ts:114

___

### createCart

▸ **createCart**(`swapId`, `customShippingOptions?`, `context?`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Creates a cart from the given swap. The cart can be used to pay
for differences associated with the swap. The swap represented by the
swapId must belong to the order. Fails if there is already a cart on the
swap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to create the cart from |
| `customShippingOptions?` | { `option_id`: `string` ; `price`: `number`  }[] | the shipping options |
| `context?` | `Object` | - |
| `context.sales_channel_id?` | `string` | - |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

the swap with its cart_id prop set to the id of the new cart.

#### Defined in

packages/medusa/dist/services/swap.d.ts:148

___

### createFulfillment

▸ **createFulfillment**(`swapId`, `config?`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Fulfills the additional items associated with the swap. Will call the
fulfillment providers associated with the shipping methods.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to fulfill, |
| `config?` | [`CreateShipmentConfig`](../modules/internal-8.md#createshipmentconfig) | optional configurations, includes optional metadata to attach to the shipment, and a no_notification flag. |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

the updated swap with new status and fulfillments.

#### Defined in

packages/medusa/dist/services/swap.d.ts:178

___

### createShipment

▸ **createShipment**(`swapId`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Marks a fulfillment as shipped and attaches tracking numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap that has been shipped. |
| `fulfillmentId` | `string` | the id of the specific fulfillment that has been shipped |
| `trackingLinks?` | { `tracking_number`: `string`  }[] | the tracking numbers associated with the shipment |
| `config?` | [`CreateShipmentConfig`](../modules/internal-8.md#createshipmentconfig) | optional configurations, includes optional metadata to attach to the shipment, and a noNotification flag. |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

the updated swap with new fulfillments and status.

#### Defined in

packages/medusa/dist/services/swap.d.ts:195

___

### deleteMetadata

▸ **deleteMetadata**(`swapId`, `key`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Dedicated method to delete metadata for a swap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the order to delete metadata from. |
| `key` | `string` | key for metadata field |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

resolves to the updated result.

#### Defined in

packages/medusa/dist/services/swap.d.ts:205

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`Swap`](internal-3.Swap.md)[]\>

List swaps.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Swap`](internal-3.Swap.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Swap`](internal-3.Swap.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/swap.d.ts:92

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`Swap`](internal-3.Swap.md)[], `number`]\>

List swaps.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Swap`](internal-3.Swap.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Swap`](internal-3.Swap.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[[`Swap`](internal-3.Swap.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/swap.d.ts:100

___

### processDifference

▸ **processDifference**(`swapId`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Process difference for the requested swap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | id of a swap being processed |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

processed swap

#### Defined in

packages/medusa/dist/services/swap.d.ts:129

___

### registerCartCompletion

▸ **registerCartCompletion**(`swapId`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Register a cart completion

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | The id of the swap |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

swap related to the cart

#### Defined in

packages/medusa/dist/services/swap.d.ts:160

___

### registerReceived

▸ **registerReceived**(`id`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Registers the swap return items as received so that they cannot be used
as a part of other swaps/returns.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `any` | the id of the order with the swap. |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

the resulting order

#### Defined in

packages/medusa/dist/services/swap.d.ts:213

___

### retrieve

▸ **retrieve**(`swapId`, `config?`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Retrieves a swap with the given id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to retrieve |
| `config?` | [`Omit`](../modules/internal-1.md#omit)<[`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Swap`](internal-3.Swap.md)\>, ``"select"``\> & { `select?`: `string`[]  } | the configuration to retrieve the swap |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

the swap

#### Defined in

packages/medusa/dist/services/swap.d.ts:74

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `relations?`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Retrieves a swap based on its associated cart id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the cart id that the swap's cart has |
| `relations?` | `string`[] | the relations to retrieve swap |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

the swap

#### Defined in

packages/medusa/dist/services/swap.d.ts:84

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

### transformQueryForCart

▸ `Protected` **transformQueryForCart**(`config`): [`Omit`](../modules/internal-1.md#omit)<[`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Swap`](internal-3.Swap.md)\>, ``"select"``\> & { `select?`: `string`[]  } & { `cartRelations`: `undefined` \| `string`[] ; `cartSelects`: `undefined` \| keyof [`Cart`](internal-3.Cart.md)[]  }

Transform find config object for retrieval.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`Omit`](../modules/internal-1.md#omit)<[`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Swap`](internal-3.Swap.md)\>, ``"select"``\> & { `select?`: `string`[]  } | parsed swap find config |

#### Returns

[`Omit`](../modules/internal-1.md#omit)<[`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Swap`](internal-3.Swap.md)\>, ``"select"``\> & { `select?`: `string`[]  } & { `cartRelations`: `undefined` \| `string`[] ; `cartSelects`: `undefined` \| keyof [`Cart`](internal-3.Cart.md)[]  }

transformed find swap config

#### Defined in

packages/medusa/dist/services/swap.d.ts:59

___

### update

▸ **update**(`swapId`, `update`): `Promise`<[`Swap`](internal-3.Swap.md)\>

Update the swap record.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | id of a swap to update |
| `update` | [`Partial`](../modules/internal-8.md#partial)<[`Swap`](internal-3.Swap.md)\> | new data |

#### Returns

`Promise`<[`Swap`](internal-3.Swap.md)\>

updated swap record

#### Defined in

packages/medusa/dist/services/swap.d.ts:137

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`SwapService`](internal-8.internal.SwapService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`SwapService`](internal-8.internal.SwapService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
