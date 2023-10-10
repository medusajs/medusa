---
displayed_sidebar: jsClientSidebar
---

# Class: OrderService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).OrderService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`OrderService`**

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

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: `Repository`<[`Address`](internal-3.Address.md)\>

#### Defined in

packages/medusa/dist/services/order.d.ts:72

___

### cartService\_

• `Protected` `Readonly` **cartService\_**: [`CartService`](internal-8.internal.CartService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:71

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](internal-8.internal.CustomerService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:59

___

### discountService\_

• `Protected` `Readonly` **discountService\_**: [`DiscountService`](internal-8.internal.DiscountService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:63

___

### draftOrderService\_

• `Protected` `Readonly` **draftOrderService\_**: [`DraftOrderService`](internal-8.internal.DraftOrderService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:74

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:76

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:77

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](internal-8.internal.FulfillmentProviderService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:64

___

### fulfillmentService\_

• `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](internal-8.FulfillmentService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:65

___

### getTotalsRelations

• `Private` **getTotalsRelations**: `any`

#### Defined in

packages/medusa/dist/services/order.d.ts:266

___

### giftCardService\_

• `Protected` `Readonly` **giftCardService\_**: [`GiftCardService`](internal-8.internal.GiftCardService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:73

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: [`IInventoryService`](../interfaces/internal-8.IInventoryService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:75

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](internal-8.internal.LineItemService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:66

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### newTotalsService\_

• `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](internal-8.internal.NewTotalsService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:68

___

### orderRepository\_

• `Protected` `Readonly` **orderRepository\_**: `Repository`<[`Order`](internal-3.Order.md)\> & { `findOneWithRelations`: (`relations?`: `FindOptionsRelations`<[`Order`](internal-3.Order.md)\>, `optionsWithoutRelations?`: [`Omit`](../modules/internal-1.md#omit)<`FindManyOptions`<[`Order`](internal-3.Order.md)\>, ``"relations"``\>) => `Promise`<[`Order`](internal-3.Order.md)\> ; `findWithRelations`: (`relations?`: `FindOptionsRelations`<[`Order`](internal-3.Order.md)\>, `optionsWithoutRelations?`: [`Omit`](../modules/internal-1.md#omit)<`FindManyOptions`<[`Order`](internal-3.Order.md)\>, ``"relations"``\>) => `Promise`<[`Order`](internal-3.Order.md)[]\>  }

#### Defined in

packages/medusa/dist/services/order.d.ts:58

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](internal-8.internal.PaymentProviderService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:60

___

### productVariantInventoryService\_

• `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](internal-8.internal.ProductVariantInventoryService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:78

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](internal-8.internal.RegionService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:70

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](internal-8.internal.ShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:61

___

### shippingProfileService\_

• `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](internal-8.internal.ShippingProfileService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:62

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](internal-8.internal.TaxProviderService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:69

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](internal-8.internal.TotalsService.md)

#### Defined in

packages/medusa/dist/services/order.d.ts:67

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `COMPLETED` | `string` |
| `FULFILLMENT_CANCELED` | `string` |
| `FULFILLMENT_CREATED` | `string` |
| `GIFT_CARD_CREATED` | `string` |
| `ITEMS_RETURNED` | `string` |
| `PAYMENT_CAPTURED` | `string` |
| `PAYMENT_CAPTURE_FAILED` | `string` |
| `PLACED` | `string` |
| `REFUND_CREATED` | `string` |
| `REFUND_FAILED` | `string` |
| `RETURN_ACTION_REQUIRED` | `string` |
| `RETURN_REQUESTED` | `string` |
| `SHIPMENT_CREATED` | `string` |
| `SWAP_CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/order.d.ts:40

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

### addShippingMethod

▸ **addShippingMethod**(`orderId`, `optionId`, `data?`, `config?`): `Promise`<[`Order`](internal-3.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderId` | `string` |
| `optionId` | `string` |
| `data?` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |
| `config?` | [`CreateShippingMethodDto`](../modules/internal-8.md#createshippingmethoddto) |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

#### Defined in

packages/medusa/dist/services/order.d.ts:161

___

### archive

▸ **archive**(`orderId`): `Promise`<[`Order`](internal-3.Order.md)\>

Archives an order. It only alloved, if the order has been fulfilled
and payment has been captured.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the order to archive |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/order.d.ts:236

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

▸ **cancel**(`orderId`): `Promise`<[`Order`](internal-3.Order.md)\>

Cancels an order.
Throws if fulfillment process has been initiated.
Throws if payment process has been initiated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to cancel. |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

result of the update operation.

#### Defined in

packages/medusa/dist/services/order.d.ts:179

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<[`Order`](internal-3.Order.md)\>

Cancels a fulfillment (if related to an order)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the ID of the fulfillment to cancel |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

updated order

#### Defined in

packages/medusa/dist/services/order.d.ts:218

___

### capturePayment

▸ **capturePayment**(`orderId`): `Promise`<[`Order`](internal-3.Order.md)\>

Captures payment for an order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to capture payment for. |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

result of the update operation.

#### Defined in

packages/medusa/dist/services/order.d.ts:185

___

### completeOrder

▸ **completeOrder**(`orderId`): `Promise`<[`Order`](internal-3.Order.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of the order to complete |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/order.d.ts:125

___

### createFromCart

▸ **createFromCart**(`cartOrId`): `Promise`<[`Order`](internal-3.Order.md)\>

Creates an order from a cart

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartOrId` | `string` \| [`Cart`](internal-3.Cart.md) |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

resolves to the creation result.

#### Defined in

packages/medusa/dist/services/order.d.ts:131

___

### createFulfillment

▸ **createFulfillment**(`orderId`, `itemsToFulfill`, `config?`): `Promise`<[`Order`](internal-3.Order.md)\>

Creates fulfillments for an order.
In a situation where the order has more than one shipping method,
we need to partition the order items, such that they can be sent
to their respective fulfillment provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to fulfil. |
| `itemsToFulfill` | [`FulFillmentItemType`](../modules/internal-8.md#fulfillmentitemtype)[] | items to fulfil. |
| `config?` | `Object` | the config to fulfil. |
| `config.location_id?` | `string` | - |
| `config.metadata?` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | - |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

result of the update operation.

#### Defined in

packages/medusa/dist/services/order.d.ts:208

___

### createGiftCardsFromLineItem\_

▸ `Protected` **createGiftCardsFromLineItem_**(`order`, `lineItem`, `manager`): `Promise`<[`GiftCard`](internal-3.GiftCard.md)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) |
| `lineItem` | [`LineItem`](internal-3.LineItem.md) |
| `manager` | `EntityManager` |

#### Returns

`Promise`<[`GiftCard`](internal-3.GiftCard.md)\>[]

#### Defined in

packages/medusa/dist/services/order.d.ts:132

___

### createRefund

▸ **createRefund**(`orderId`, `refundAmount`, `reason`, `note?`, `config?`): `Promise`<[`Order`](internal-3.Order.md)\>

Refunds a given amount back to the customer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of the order to refund. |
| `refundAmount` | `number` | the amount to refund. |
| `reason` | `string` | the reason to refund. |
| `note?` | `string` | note for refund. |
| `config?` | `Object` | the config for refund. |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

the result of the refund operation.

#### Defined in

packages/medusa/dist/services/order.d.ts:246

___

### createShipment

▸ **createShipment**(`orderId`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<[`Order`](internal-3.Order.md)\>

Adds a shipment to the order to indicate that an order has left the
warehouse. Will ask the fulfillment provider for any documents that may
have been created in regards to the shipment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the id of the order that has been shipped |
| `fulfillmentId` | `string` | the fulfillment that has now been shipped |
| `trackingLinks?` | [`TrackingLink`](internal-3.TrackingLink.md)[] | array of tracking numbers associated with the shipment |
| `config?` | `Object` | the config of the order that has been shipped |
| `config.metadata` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | - |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

the resulting order following the update.

#### Defined in

packages/medusa/dist/services/order.d.ts:143

___

### decorateTotals

▸ **decorateTotals**(`order`, `totalsFields?`): `Promise`<[`Order`](internal-3.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) |
| `totalsFields?` | `string`[] |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

#### Defined in

packages/medusa/dist/services/order.d.ts:250

▸ **decorateTotals**(`order`, `context?`): `Promise`<[`Order`](internal-3.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) |
| `context?` | [`TotalsContext`](../modules/internal-8.md#totalscontext) |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

#### Defined in

packages/medusa/dist/services/order.d.ts:251

___

### decorateTotalsLegacy

▸ `Protected` **decorateTotalsLegacy**(`order`, `totalsFields?`): `Promise`<[`Order`](internal-3.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) |
| `totalsFields?` | `string`[] |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

#### Defined in

packages/medusa/dist/services/order.d.ts:249

___

### getFulfillmentItems

▸ `Protected` **getFulfillmentItems**(`order`, `items`, `transformer`): `Promise`<[`LineItem`](internal-3.LineItem.md)[]\>

Retrieves the order line items, given an array of items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | the order to get line items from |
| `items` | [`FulFillmentItemType`](../modules/internal-8.md#fulfillmentitemtype)[] | the items to get |
| `transformer` | (`item`: `undefined` \| [`LineItem`](internal-3.LineItem.md), `quantity`: `number`) => `unknown` | a function to apply to each of the items retrieved from the order, should return a line item. If the transformer returns an undefined value the line item will be filtered from the returned array. |

#### Returns

`Promise`<[`LineItem`](internal-3.LineItem.md)[]\>

the line items generated by the transformer.

#### Defined in

packages/medusa/dist/services/order.d.ts:229

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`Order`](internal-3.Order.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Order`](internal-3.Order.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Order`](internal-3.Order.md)\> | the config to be used for find |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/order.d.ts:85

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`Order`](internal-3.Order.md)[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`Order`](internal-3.Order.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Order`](internal-3.Order.md)\> | the config to be used for find |

#### Returns

`Promise`<[[`Order`](internal-3.Order.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/order.d.ts:91

___

### registerReturnReceived

▸ **registerReturnReceived**(`orderId`, `receivedReturn`, `customRefundAmount?`): `Promise`<[`Order`](internal-3.Order.md)\>

Handles receiving a return. This will create a
refund to the customer. If the returned items don't match the requested
items the return status will be updated to requires_action. This behaviour
is useful in situations where a custom refund amount is requested, but the
returned items are not matching the requested items. Setting the
allowMismatch argument to true, will process the return, ignoring any
mismatches.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the order to return. |
| `receivedReturn` | [`Return`](internal-3.Return.md) | the received return |
| `customRefundAmount?` | `number` | the custom refund amount return |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/order.d.ts:265

___

### retrieve

▸ **retrieve**(`orderId`, `config?`): `Promise`<[`Order`](internal-3.Order.md)\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id or selector of order to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Order`](internal-3.Order.md)\> | config of order to retrieve |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

the order document

#### Defined in

packages/medusa/dist/services/order.d.ts:103

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `config?`): `Promise`<[`Order`](internal-3.Order.md)\>

Gets an order by cart id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | cart id to find order |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Order`](internal-3.Order.md)\> | the config to be used to find order |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

the order document

#### Defined in

packages/medusa/dist/services/order.d.ts:112

___

### retrieveByCartIdWithTotals

▸ **retrieveByCartIdWithTotals**(`cartId`, `options?`): `Promise`<[`Order`](internal-3.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartId` | `string` |
| `options?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Order`](internal-3.Order.md)\> |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

#### Defined in

packages/medusa/dist/services/order.d.ts:113

___

### retrieveByExternalId

▸ **retrieveByExternalId**(`externalId`, `config?`): `Promise`<[`Order`](internal-3.Order.md)\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalId` | `string` | id of order to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Order`](internal-3.Order.md)\> | query config to get order by |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

the order document

#### Defined in

packages/medusa/dist/services/order.d.ts:120

___

### retrieveLegacy

▸ `Protected` **retrieveLegacy**(`orderIdOrSelector`, `config?`): `Promise`<[`Order`](internal-3.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderIdOrSelector` | `string` \| [`Selector`](../modules/internal-8.internal.md#selector)<[`Order`](internal-3.Order.md)\> |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Order`](internal-3.Order.md)\> |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

#### Defined in

packages/medusa/dist/services/order.d.ts:104

___

### retrieveWithTotals

▸ **retrieveWithTotals**(`orderId`, `options?`, `context?`): `Promise`<[`Order`](internal-3.Order.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderId` | `string` |
| `options?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Order`](internal-3.Order.md)\> |
| `context?` | [`TotalsContext`](../modules/internal-8.md#totalscontext) |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

#### Defined in

packages/medusa/dist/services/order.d.ts:105

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

### transformQueryForTotals

▸ `Protected` **transformQueryForTotals**(`config`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Order`](internal-3.Order.md)\> |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `relations` | `undefined` \| `string`[] |
| `select` | `undefined` \| keyof [`Order`](internal-3.Order.md)[] |
| `totalsToSelect` | `undefined` \| keyof [`Order`](internal-3.Order.md)[] |

#### Defined in

packages/medusa/dist/services/order.d.ts:92

___

### update

▸ **update**(`orderId`, `update`): `Promise`<[`Order`](internal-3.Order.md)\>

Updates an order. Metadata updates should
use dedicated method, e.g. `setMetadata` etc. The function
will throw errors if metadata updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the id of the order. Must be a string that can be casted to an ObjectId |
| `update` | [`UpdateOrderInput`](../modules/internal-8.md#updateorderinput) | an object with the update values. |

#### Returns

`Promise`<[`Order`](internal-3.Order.md)\>

resolves to the update result.

#### Defined in

packages/medusa/dist/services/order.d.ts:171

___

### updateBillingAddress

▸ `Protected` **updateBillingAddress**(`order`, `address`): `Promise`<`void`\>

Updates the order's billing address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | the order to update |
| `address` | [`Address`](internal-3.Address.md) | the value to set the billing address to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/order.d.ts:153

___

### updateShippingAddress

▸ `Protected` **updateShippingAddress**(`order`, `address`): `Promise`<`void`\>

Updates the order's shipping address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | the order to update |
| `address` | [`Address`](internal-3.Address.md) | the value to set the shipping address to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/order.d.ts:160

___

### validateFulfillmentLineItem

▸ `Protected` **validateFulfillmentLineItem**(`item`, `quantity`): ``null`` \| [`LineItem`](internal-3.LineItem.md)

Checks that a given quantity of a line item can be fulfilled. Fails if the
fulfillable quantity is lower than the requested fulfillment quantity.
Fulfillable quantity is calculated by subtracting the already fulfilled
quantity from the quantity that was originally purchased.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | [`LineItem`](internal-3.LineItem.md) | the line item to check has sufficient fulfillable quantity. |
| `quantity` | `number` | the quantity that is requested to be fulfilled. |

#### Returns

``null`` \| [`LineItem`](internal-3.LineItem.md)

a line item that has the requested fulfillment quantity
  set.

#### Defined in

packages/medusa/dist/services/order.d.ts:197

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`OrderService`](internal-8.internal.OrderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`OrderService`](internal-8.internal.OrderService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
