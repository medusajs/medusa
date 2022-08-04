# Class: OrderService

## Hierarchy

- `TransactionBaseService`<[`OrderService`](OrderService.md)\>

  ↳ **`OrderService`**

## Constructors

### constructor

• **new OrderService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;OrderService\&gt;.constructor

#### Defined in

[packages/medusa/src/services/order.ts:107](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L107)

## Properties

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: typeof `AddressRepository`

#### Defined in

[packages/medusa/src/services/order.ts:101](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L101)

___

### cartService\_

• `Protected` `Readonly` **cartService\_**: [`CartService`](CartService.md)

#### Defined in

[packages/medusa/src/services/order.ts:100](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L100)

___

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:12](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L12)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/order.ts:90](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L90)

___

### discountService\_

• `Protected` `Readonly` **discountService\_**: [`DiscountService`](DiscountService.md)

#### Defined in

[packages/medusa/src/services/order.ts:94](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L94)

___

### draftOrderService\_

• `Protected` `Readonly` **draftOrderService\_**: [`DraftOrderService`](DraftOrderService.md)

#### Defined in

[packages/medusa/src/services/order.ts:103](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L103)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/order.ts:105](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L105)

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[packages/medusa/src/services/order.ts:95](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L95)

___

### fulfillmentService\_

• `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](FulfillmentService.md)

#### Defined in

[packages/medusa/src/services/order.ts:96](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L96)

___

### giftCardService\_

• `Protected` `Readonly` **giftCardService\_**: [`GiftCardService`](GiftCardService.md)

#### Defined in

[packages/medusa/src/services/order.ts:102](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L102)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: [`InventoryService`](InventoryService.md)

#### Defined in

[packages/medusa/src/services/order.ts:104](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L104)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/order.ts:97](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L97)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/order.ts:86](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L86)

___

### orderRepository\_

• `Protected` `Readonly` **orderRepository\_**: typeof `OrderRepository`

#### Defined in

[packages/medusa/src/services/order.ts:89](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L89)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[packages/medusa/src/services/order.ts:91](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L91)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/order.ts:99](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L99)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/order.ts:92](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L92)

___

### shippingProfileService\_

• `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](ShippingProfileService.md)

#### Defined in

[packages/medusa/src/services/order.ts:93](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L93)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/order.ts:98](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L98)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/order.ts:87](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L87)

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

[packages/medusa/src/services/order.ts:67](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L67)

## Methods

### addShippingMethod

▸ **addShippingMethod**(`orderId`, `optionId`, `data?`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderId` | `string` |
| `optionId` | `string` |
| `data?` | `Record`<`string`, `unknown`\> |
| `config` | `CreateShippingMethodDto` |

#### Returns

`Promise`<`Order`\>

#### Defined in

[packages/medusa/src/services/order.ts:813](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L813)

___

### archive

▸ **archive**(`orderId`): `Promise`<`Order`\>

Archives an order. It only alloved, if the order has been fulfilled
and payment has been captured.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the order to archive |

#### Returns

`Promise`<`Order`\>

the result of the update operation

#### Defined in

[packages/medusa/src/services/order.ts:1337](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L1337)

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

TransactionBaseService.atomicPhase\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### cancel

▸ **cancel**(`orderId`): `Promise`<`Order`\>

Cancels an order.
Throws if fulfillment process has been initiated.
Throws if payment process has been initiated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to cancel. |

#### Returns

`Promise`<`Order`\>

result of the update operation.

#### Defined in

[packages/medusa/src/services/order.ts:964](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L964)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<`Order`\>

Cancels a fulfillment (if related to an order)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the ID of the fulfillment to cancel |

#### Returns

`Promise`<`Order`\>

updated order

#### Defined in

[packages/medusa/src/services/order.ts:1274](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L1274)

___

### capturePayment

▸ **capturePayment**(`orderId`): `Promise`<`Order`\>

Captures payment for an order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to capture payment for. |

#### Returns

`Promise`<`Order`\>

result of the update operation.

#### Defined in

[packages/medusa/src/services/order.ts:1043](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L1043)

___

### completeOrder

▸ **completeOrder**(`orderId`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of the order to complete |

#### Returns

`Promise`<`Order`\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/order.ts:451](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L451)

___

### createFromCart

▸ **createFromCart**(`cartId`): `Promise`<`Order`\>

Creates an order from a cart

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | id of the cart to create an order from |

#### Returns

`Promise`<`Order`\>

resolves to the creation result.

#### Defined in

[packages/medusa/src/services/order.ts:479](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L479)

___

### createFulfillment

▸ **createFulfillment**(`orderId`, `itemsToFulfill`, `config?`): `Promise`<`Order`\>

Creates fulfillments for an order.
In a situation where the order has more than one shipping method,
we need to partition the order items, such that they can be sent
to their respective fulfillment provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to cancel. |
| `itemsToFulfill` | `FulFillmentItemType`[] | items to fulfil. |
| `config` | `Object` | the config to cancel. |
| `config.metadata?` | `Record`<`string`, `unknown`\> | - |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<`Order`\>

result of the update operation.

#### Defined in

[packages/medusa/src/services/order.ts:1146](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L1146)

___

### createRefund

▸ **createRefund**(`orderId`, `refundAmount`, `reason`, `note?`, `config?`): `Promise`<`Order`\>

Refunds a given amount back to the customer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of the order to refund. |
| `refundAmount` | `number` | the amount to refund. |
| `reason` | `string` | the reason to refund. |
| `note?` | `string` | note for refund. |
| `config` | `Object` | the config for refund. |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<`Order`\>

the result of the refund operation.

#### Defined in

[packages/medusa/src/services/order.ts:1363](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L1363)

___

### createShipment

▸ **createShipment**(`orderId`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<`Order`\>

Adds a shipment to the order to indicate that an order has left the
warehouse. Will ask the fulfillment provider for any documents that may
have been created in regards to the shipment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the id of the order that has been shipped |
| `fulfillmentId` | `string` | the fulfillment that has now been shipped |
| `trackingLinks?` | `TrackingLink`[] | array of tracking numebers   associated with the shipment |
| `config` | `Object` | the config of the order that has been shipped |
| `config.metadata` | `Record`<`string`, `unknown`\> | - |
| `config.no_notification?` | `boolean` | - |

#### Returns

`Promise`<`Order`\>

the resulting order following the update.

#### Defined in

[packages/medusa/src/services/order.ts:655](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L655)

___

### decorateTotals

▸ `Protected` **decorateTotals**(`order`, `totalsFields?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `order` | `Order` | `undefined` |
| `totalsFields` | `string`[] | `[]` |

#### Returns

`Promise`<`Order`\>

#### Defined in

[packages/medusa/src/services/order.ts:1412](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L1412)

___

### existsByCartId

▸ **existsByCartId**(`cartId`): `Promise`<`boolean`\>

Checks the existence of an order by cart id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | cart id to find order |

#### Returns

`Promise`<`boolean`\>

the order document

#### Defined in

[packages/medusa/src/services/order.ts:442](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L442)

___

### getFulfillmentItems

▸ `Protected` **getFulfillmentItems**(`order`, `items`, `transformer`): `Promise`<`LineItem`[]\>

Retrieves the order line items, given an array of items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to get line items from |
| `items` | `FulFillmentItemType`[] | the items to get |
| `transformer` | (`item`: `undefined` \| `LineItem`, `quantity`: `number`) => `unknown` | a function to apply to each of the items    retrieved from the order, should return a line item. If the transformer    returns an undefined value the line item will be filtered from the    returned array. |

#### Returns

`Promise`<`LineItem`[]\>

the line items generated by the transformer.

#### Defined in

[packages/medusa/src/services/order.ts:1316](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L1316)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Order`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Order`\> | the query object for find |
| `config` | `FindConfig`<`Order`\> | the config to be used for find |

#### Returns

`Promise`<`Order`[]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/order.ts:155](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L155)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`Order`[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `QuerySelector`<`Order`\> |
| `config` | `FindConfig`<`Order`\> |

#### Returns

`Promise`<[`Order`[], `number`]\>

#### Defined in

[packages/medusa/src/services/order.ts:184](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L184)

___

### registerReturnReceived

▸ **registerReturnReceived**(`orderId`, `receivedReturn`, `customRefundAmount?`): `Promise`<`Order`\>

Handles receiving a return. This will create a
refund to the customer. If the returned items don't match the requested
items the return status will be updated to requires_action. This behaviour
is useful in sitautions where a custom refund amount is requested, but the
retuned items are not matching the requested items. Setting the
allowMismatch argument to true, will process the return, ignoring any
mismatches.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the order to return. |
| `receivedReturn` | `Return` | the received return |
| `customRefundAmount?` | `number` | the custom refund amount return |

#### Returns

`Promise`<`Order`\>

the result of the update operation

#### Defined in

[packages/medusa/src/services/order.ts:1515](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L1515)

___

### retrieve

▸ **retrieve**(`orderId`, `config?`): `Promise`<`Order`\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to retrieve |
| `config` | `FindConfig`<`Order`\> | config of order to retrieve |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[packages/medusa/src/services/order.ts:324](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L324)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `config?`): `Promise`<`Order`\>

Gets an order by cart id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | cart id to find order |
| `config` | `FindConfig`<`Order`\> | the config to be used to find order |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[packages/medusa/src/services/order.ts:364](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L364)

___

### retrieveByExternalId

▸ **retrieveByExternalId**(`externalId`, `config?`): `Promise`<`Order`\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalId` | `string` | id of order to retrieve |
| `config` | `FindConfig`<`Order`\> | query config to get order by |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[packages/medusa/src/services/order.ts:403](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L403)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### transformQueryForTotals

▸ `Protected` **transformQueryForTotals**(`config`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `FindConfig`<`Order`\> |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `relations` | `undefined` \| `string`[] |
| `select` | `undefined` \| keyof `Order`[] |
| `totalsToSelect` | `undefined` \| keyof `Order`[] |

#### Defined in

[packages/medusa/src/services/order.ts:249](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L249)

___

### update

▸ **update**(`orderId`, `update`): `Promise`<`Order`\>

Updates an order. Metadata updates should
use dedicated method, e.g. `setMetadata` etc. The function
will throw errors if metadata updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the id of the order. Must be a string that   can be casted to an ObjectId |
| `update` | `UpdateOrderInput` | an object with the update values. |

#### Returns

`Promise`<`Order`\>

resolves to the update result.

#### Defined in

[packages/medusa/src/services/order.ts:876](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L876)

___

### updateBillingAddress

▸ `Protected` **updateBillingAddress**(`order`, `address`): `Promise`<`void`\>

Updates the order's billing address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to update |
| `address` | `Address` | the value to set the billing address to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[packages/medusa/src/services/order.ts:741](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L741)

___

### updateShippingAddress

▸ `Protected` **updateShippingAddress**(`order`, `address`): `Promise`<`void`\>

Updates the order's shipping address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to update |
| `address` | `Address` | the value to set the shipping address to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[packages/medusa/src/services/order.ts:781](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L781)

___

### validateFulfillmentLineItem

▸ `Protected` **validateFulfillmentLineItem**(`item`, `quantity`): ``null`` \| `LineItem`

Checks that a given quantity of a line item can be fulfilled. Fails if the
fulfillable quantity is lower than the requested fulfillment quantity.
Fulfillable quantity is calculated by subtracting the already fulfilled
quantity from the quantity that was originally purchased.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `LineItem` | the line item to check has sufficient fulfillable   quantity. |
| `quantity` | `number` | the quantity that is requested to be fulfilled. |

#### Returns

``null`` \| `LineItem`

a line item that has the requested fulfillment quantity
  set.

#### Defined in

[packages/medusa/src/services/order.ts:1113](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/order.ts#L1113)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`OrderService`](OrderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`OrderService`](OrderService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
