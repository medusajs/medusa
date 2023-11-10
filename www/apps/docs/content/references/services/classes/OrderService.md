# OrderService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`OrderService`**

## Constructors

### constructor

**new OrderService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-19) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/order.ts:138](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L138)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### addressRepository\_

 `Protected` `Readonly` **addressRepository\_**: [`Repository`](Repository.md)<[`Address`](Address.md)\>

#### Defined in

[packages/medusa/src/services/order.ts:129](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L129)

___

### cartService\_

 `Protected` `Readonly` **cartService\_**: [`CartService`](CartService.md)

#### Defined in

[packages/medusa/src/services/order.ts:128](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L128)

___

### customerService\_

 `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/order.ts:116](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L116)

___

### discountService\_

 `Protected` `Readonly` **discountService\_**: [`DiscountService`](DiscountService.md)

#### Defined in

[packages/medusa/src/services/order.ts:120](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L120)

___

### draftOrderService\_

 `Protected` `Readonly` **draftOrderService\_**: [`DraftOrderService`](DraftOrderService.md)

#### Defined in

[packages/medusa/src/services/order.ts:131](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L131)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/order.ts:133](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L133)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](FlagRouter.md)

#### Defined in

[packages/medusa/src/services/order.ts:134](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L134)

___

### fulfillmentProviderService\_

 `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[packages/medusa/src/services/order.ts:121](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L121)

___

### fulfillmentService\_

 `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](FulfillmentService.md)

#### Defined in

[packages/medusa/src/services/order.ts:122](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L122)

___

### giftCardService\_

 `Protected` `Readonly` **giftCardService\_**: [`GiftCardService`](GiftCardService.md)

#### Defined in

[packages/medusa/src/services/order.ts:130](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L130)

___

### inventoryService\_

 `Protected` `Readonly` **inventoryService\_**: [`IInventoryService`](../interfaces/IInventoryService.md)

#### Defined in

[packages/medusa/src/services/order.ts:132](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L132)

___

### lineItemService\_

 `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/order.ts:123](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L123)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### newTotalsService\_

 `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](NewTotalsService.md)

#### Defined in

[packages/medusa/src/services/order.ts:125](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L125)

___

### orderRepository\_

 `Protected` `Readonly` **orderRepository\_**: [`Repository`](Repository.md)<[`Order`](Order.md)\> & { `findOneWithRelations`: Method findOneWithRelations ; `findWithRelations`: Method findWithRelations  }

#### Defined in

[packages/medusa/src/services/order.ts:115](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L115)

___

### paymentProviderService\_

 `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[packages/medusa/src/services/order.ts:117](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L117)

___

### productVariantInventoryService\_

 `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Defined in

[packages/medusa/src/services/order.ts:136](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L136)

___

### regionService\_

 `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/order.ts:127](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L127)

___

### shippingOptionService\_

 `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/order.ts:118](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L118)

___

### shippingProfileService\_

 `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](ShippingProfileService.md)

#### Defined in

[packages/medusa/src/services/order.ts:119](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L119)

___

### taxProviderService\_

 `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/order.ts:126](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L126)

___

### totalsService\_

 `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/order.ts:124](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L124)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` `Readonly` **Events**: `Object`

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

[packages/medusa/src/services/order.ts:96](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L96)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addShippingMethod

**addShippingMethod**(`orderId`, `optionId`, `data?`, `config?`): `Promise`<[`Order`](Order.md)\>

#### Parameters

| Name |
| :------ |
| `orderId` | `string` |
| `optionId` | `string` |
| `data?` | Record<`string`, `unknown`\> |
| `config` | [`CreateShippingMethodDto`](../index.md#createshippingmethoddto) |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: 
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1031](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1031)

___

### archive

**archive**(`orderId`): `Promise`<[`Order`](Order.md)\>

Archives an order. It only alloved, if the order has been fulfilled
and payment has been captured.

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderId` | `string` | the order to archive |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: the result of the update operation
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1563](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1563)

___

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### cancel

**cancel**(`orderId`): `Promise`<[`Order`](Order.md)\>

Cancels an order.
Throws if fulfillment process has been initiated.
Throws if payment process has been initiated.

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderId` | `string` | id of order to cancel. |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: result of the update operation.
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1181](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1181)

___

### cancelFulfillment

**cancelFulfillment**(`fulfillmentId`): `Promise`<[`Order`](Order.md)\>

Cancels a fulfillment (if related to an order)

#### Parameters

| Name | Description |
| :------ | :------ |
| `fulfillmentId` | `string` | the ID of the fulfillment to cancel |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: updated order
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1500](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1500)

___

### capturePayment

**capturePayment**(`orderId`): `Promise`<[`Order`](Order.md)\>

Captures payment for an order.

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderId` | `string` | id of order to capture payment for. |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: result of the update operation.
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1270](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1270)

___

### completeOrder

**completeOrder**(`orderId`): `Promise`<[`Order`](Order.md)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderId` | `string` | id of the order to complete |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: the result of the find operation
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:578](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L578)

___

### createFromCart

**createFromCart**(`cartOrId`): `Promise`<[`Order`](Order.md)\>

Creates an order from a cart

#### Parameters

| Name |
| :------ |
| `cartOrId` | `string` \| [`Cart`](Cart.md) |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: resolves to the creation result.
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:608](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L608)

___

### createFulfillment

**createFulfillment**(`orderId`, `itemsToFulfill`, `config?`): `Promise`<[`Order`](Order.md)\>

Creates fulfillments for an order.
In a situation where the order has more than one shipping method,
we need to partition the order items, such that they can be sent
to their respective fulfillment provider.

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderId` | `string` | id of order to fulfil. |
| `itemsToFulfill` | [`FulFillmentItemType`](../index.md#fulfillmentitemtype)[] | items to fulfil. |
| `config` | `object` | the config to fulfil. |
| `config.location_id?` | `string` |
| `config.metadata?` | Record<`string`, `unknown`\> |
| `config.no_notification?` | `boolean` |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: result of the update operation.
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1375](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1375)

___

### createGiftCardsFromLineItem\_

`Protected` **createGiftCardsFromLineItem_**(`order`, `lineItem`, `manager`): `Promise`<[`GiftCard`](GiftCard.md)\>[]

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | An order is a purchase made by a customer. It holds details about payment and fulfillment of the order. An order may also be created from a draft order, which is created by an admin user. |
| `lineItem` | [`LineItem`](LineItem.md) | Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits. |
| `manager` | [`EntityManager`](EntityManager.md) |

#### Returns

`Promise`<[`GiftCard`](GiftCard.md)\>[]

-`Promise<GiftCard\>[]`: 
	-`Promise`: 
		-`GiftCard`: 

#### Defined in

[packages/medusa/src/services/order.ts:812](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L812)

___

### createRefund

**createRefund**(`orderId`, `refundAmount`, `reason`, `note?`, `config?`): `Promise`<[`Order`](Order.md)\>

Refunds a given amount back to the customer.

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderId` | `string` | id of the order to refund. |
| `refundAmount` | `number` | the amount to refund. |
| `reason` | `string` | the reason to refund. |
| `note?` | `string` | note for refund. |
| `config` | `object` | the config for refund. |
| `config.no_notification?` | `boolean` |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: the result of the refund operation.
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1589](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1589)

___

### createShipment

**createShipment**(`orderId`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<[`Order`](Order.md)\>

Adds a shipment to the order to indicate that an order has left the
warehouse. Will ask the fulfillment provider for any documents that may
have been created in regards to the shipment.

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderId` | `string` | the id of the order that has been shipped |
| `fulfillmentId` | `string` | the fulfillment that has now been shipped |
| `trackingLinks?` | [`TrackingLink`](TrackingLink.md)[] | array of tracking numbers associated with the shipment |
| `config` | `object` | the config of the order that has been shipped |
| `config.metadata` | Record<`string`, `unknown`\> |
| `config.no_notification?` | `boolean` |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: the resulting order following the update.
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:865](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L865)

___

### decorateTotals

**decorateTotals**(`order`, `totalsFields?`): `Promise`<[`Order`](Order.md)\>

Calculate and attach the different total fields on the object

#### Parameters

| Name |
| :------ |
| `order` | [`Order`](Order.md) |
| `totalsFields?` | `string`[] |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: 
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1786](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1786)

**decorateTotals**(`order`, `context?`): `Promise`<[`Order`](Order.md)\>

Calculate and attach the different total fields on the object

#### Parameters

| Name |
| :------ |
| `order` | [`Order`](Order.md) |
| `context?` | [`TotalsContext`](../index.md#totalscontext) |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: 
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1788](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1788)

___

### decorateTotalsLegacy

`Protected` **decorateTotalsLegacy**(`order`, `totalsFields?`): `Promise`<[`Order`](Order.md)\>

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](Order.md) | An order is a purchase made by a customer. It holds details about payment and fulfillment of the order. An order may also be created from a draft order, which is created by an admin user. |
| `totalsFields` | `string`[] | [] |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: 
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1657](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1657)

___

### getFulfillmentItems

`Protected` **getFulfillmentItems**(`order`, `items`, `transformer`): `Promise`<[`LineItem`](LineItem.md)[]\>

Retrieves the order line items, given an array of items.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | the order to get line items from |
| `items` | [`FulFillmentItemType`](../index.md#fulfillmentitemtype)[] | the items to get |
| `transformer` | (`item`: `undefined` \| [`LineItem`](LineItem.md), `quantity`: `number`) => `unknown` | a function to apply to each of the items retrieved from the order, should return a line item. If the transformer returns an undefined value the line item will be filtered from the returned array. |

#### Returns

`Promise`<[`LineItem`](LineItem.md)[]\>

-`Promise`: the line items generated by the transformer.
	-`LineItem[]`: 
		-`LineItem`: 

#### Defined in

[packages/medusa/src/services/order.ts:1542](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1542)

___

### getTotalsRelations

`Private` **getTotalsRelations**(`config`): `string`[]

#### Parameters

| Name |
| :------ |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Order`](Order.md)\> |

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Defined in

[packages/medusa/src/services/order.ts:2062](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L2062)

___

### list

**list**(`selector`, `config?`): `Promise`<[`Order`](Order.md)[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Order`](Order.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Order`](Order.md)\> | the config to be used for find |

#### Returns

`Promise`<[`Order`](Order.md)[]\>

-`Promise`: the result of the find operation
	-`Order[]`: 
		-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:190](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L190)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[[`Order`](Order.md)[], `number`]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`QuerySelector`](../index.md#queryselector)<[`Order`](Order.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Order`](Order.md)\> | the config to be used for find |

#### Returns

`Promise`<[[`Order`](Order.md)[], `number`]\>

-`Promise`: the result of the find operation
	-`Order[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/order.ts:207](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L207)

___

### registerReturnReceived

**registerReturnReceived**(`orderId`, `receivedReturn`, `customRefundAmount?`): `Promise`<[`Order`](Order.md)\>

Handles receiving a return. This will create a
refund to the customer. If the returned items don't match the requested
items the return status will be updated to requires_action. This behaviour
is useful in situations where a custom refund amount is requested, but the
returned items are not matching the requested items. Setting the
allowMismatch argument to true, will process the return, ignoring any
mismatches.

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderId` | `string` | the order to return. |
| `receivedReturn` | [`Return`](Return.md) | the received return |
| `customRefundAmount?` | `number` | the custom refund amount return |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: the result of the update operation
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1987](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1987)

___

### retrieve

**retrieve**(`orderId`, `config?`): `Promise`<[`Order`](Order.md)\>

Gets an order by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderId` | `string` | id or selector of order to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Order`](Order.md)\> | config of order to retrieve |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: the order document
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:389](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L389)

___

### retrieveByCartId

**retrieveByCartId**(`cartId`, `config?`): `Promise`<[`Order`](Order.md)\>

Gets an order by cart id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | cart id to find order |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Order`](Order.md)\> | the config to be used to find order |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: the order document
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:485](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L485)

___

### retrieveByCartIdWithTotals

**retrieveByCartIdWithTotals**(`cartId`, `options?`): `Promise`<[`Order`](Order.md)\>

#### Parameters

| Name |
| :------ |
| `cartId` | `string` |
| `options` | [`FindConfig`](../interfaces/FindConfig.md)<[`Order`](Order.md)\> |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: 
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:519](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L519)

___

### retrieveByExternalId

**retrieveByExternalId**(`externalId`, `config?`): `Promise`<[`Order`](Order.md)\>

Gets an order by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `externalId` | `string` | id of order to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Order`](Order.md)\> | query config to get order by |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: the order document
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:534](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L534)

___

### retrieveLegacy

`Protected` **retrieveLegacy**(`orderIdOrSelector`, `config?`): `Promise`<[`Order`](Order.md)\>

#### Parameters

| Name |
| :------ |
| `orderIdOrSelector` | `string` \| [`Selector`](../index.md#selector)<[`Order`](Order.md)\> |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Order`](Order.md)\> |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: 
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:429](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L429)

___

### retrieveWithTotals

**retrieveWithTotals**(`orderId`, `options?`, `context?`): `Promise`<[`Order`](Order.md)\>

#### Parameters

| Name |
| :------ |
| `orderId` | `string` |
| `options` | [`FindConfig`](../interfaces/FindConfig.md)<[`Order`](Order.md)\> |
| `context` | [`TotalsContext`](../index.md#totalscontext) |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: 
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:468](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L468)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### transformQueryForTotals

`Protected` **transformQueryForTotals**(`config`): { `relations`: `undefined` \| `string`[] ; `select`: `undefined` \| keyof [`Order`](Order.md)[] ; `totalsToSelect`: `undefined` \| keyof [`Order`](Order.md)[]  }

#### Parameters

| Name |
| :------ |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Order`](Order.md)\> |

#### Returns

`object`

-``object``: (optional) 

| Name | Type |
| :------ | :------ |
| `relations` | `undefined` \| `string`[] |
| `select` | `undefined` \| keyof [`Order`](Order.md)[] |
| `totalsToSelect` | `undefined` \| keyof [`Order`](Order.md)[] |

#### Defined in

[packages/medusa/src/services/order.ts:313](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L313)

___

### update

**update**(`orderId`, `update`): `Promise`<[`Order`](Order.md)\>

Updates an order. Metadata updates should
use dedicated method, e.g. `setMetadata` etc. The function
will throw errors if metadata updates are attempted.

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderId` | `string` | the id of the order. Must be a string that can be casted to an ObjectId |
| `update` | [`UpdateOrderInput`](../index.md#updateorderinput) | an object with the update values. |

#### Returns

`Promise`<[`Order`](Order.md)\>

-`Promise`: resolves to the update result.
	-`Order`: 

#### Defined in

[packages/medusa/src/services/order.ts:1092](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1092)

___

### updateBillingAddress

`Protected` **updateBillingAddress**(`order`, `address`): `Promise`<`void`\>

Updates the order's billing address.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | the order to update |
| `address` | [`Address`](Address.md) | the value to set the billing address to |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the update operation

#### Defined in

[packages/medusa/src/services/order.ts:953](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L953)

___

### updateShippingAddress

`Protected` **updateShippingAddress**(`order`, `address`): `Promise`<`void`\>

Updates the order's shipping address.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | the order to update |
| `address` | [`Address`](Address.md) | the value to set the shipping address to |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the update operation

#### Defined in

[packages/medusa/src/services/order.ts:1000](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1000)

___

### validateFulfillmentLineItem

`Protected` **validateFulfillmentLineItem**(`item`, `quantity`): ``null`` \| [`LineItem`](LineItem.md)

Checks that a given quantity of a line item can be fulfilled. Fails if the
fulfillable quantity is lower than the requested fulfillment quantity.
Fulfillable quantity is calculated by subtracting the already fulfilled
quantity from the quantity that was originally purchased.

#### Parameters

| Name | Description |
| :------ | :------ |
| `item` | [`LineItem`](LineItem.md) | the line item to check has sufficient fulfillable quantity. |
| `quantity` | `number` | the quantity that is requested to be fulfilled. |

#### Returns

``null`` \| [`LineItem`](LineItem.md)

-```null`` \| LineItem`: (optional) a line item that has the requested fulfillment quantity
  set.

#### Defined in

[packages/medusa/src/services/order.ts:1342](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/order.ts#L1342)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`OrderService`](OrderService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`OrderService`](OrderService.md)

-`OrderService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
