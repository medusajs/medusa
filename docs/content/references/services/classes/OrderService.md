# Class: OrderService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`OrderService`**

## Constructors

### constructor

• **new OrderService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/order.js:25](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L25)

## Properties

### Events

▪ `Static` **Events**: `Object`

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

[services/order.js:6](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L6)

## Methods

### addShippingMethod

▸ **addShippingMethod**(`orderId`, `optionId`, `data`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderId` | `any` |
| `optionId` | `any` |
| `data` | `any` |
| `config` | `Object` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:806](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L806)

___

### archive

▸ **archive**(`orderId`): `Promise`<`any`\>

Archives an order. It only alloved, if the order has been fulfilled
and payment has been captured.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the order to archive |

#### Returns

`Promise`<`any`\>

the result of the update operation

#### Defined in

[services/order.js:1301](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L1301)

___

### cancel

▸ **cancel**(`orderId`): `Promise`<`any`\>

Cancels an order.
Throws if fulfillment process has been initiated.
Throws if payment process has been initiated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to cancel. |

#### Returns

`Promise`<`any`\>

result of the update operation.

#### Defined in

[services/order.js:952](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L952)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<`any`\>

Cancels a fulfillment (if related to an order)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the ID of the fulfillment to cancel |

#### Returns

`Promise`<`any`\>

updated order

#### Defined in

[services/order.js:1242](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L1242)

___

### capturePayment

▸ **capturePayment**(`orderId`): `Promise`<`any`\>

Captures payment for an order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to capture payment for. |

#### Returns

`Promise`<`any`\>

result of the update operation.

#### Defined in

[services/order.js:1021](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L1021)

___

### completeOrder

▸ **completeOrder**(`orderId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of the order to complete |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/order.js:429](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L429)

___

### create

▸ **create**(`data`): `Promise`<`any`\>

Creates an order

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | the data to create an order |

#### Returns

`Promise`<`any`\>

resolves to the creation result.

#### Defined in

[services/order.js:723](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L723)

___

### createFromCart

▸ **createFromCart**(`cartId`): `Promise`<`any`\>

Creates an order from a cart

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | id of the cart to create an order from |

#### Returns

`Promise`<`any`\>

resolves to the creation result.

#### Defined in

[services/order.js:465](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L465)

___

### createFulfillment

▸ **createFulfillment**(`orderId`, `itemsToFulfill`, `config?`): `Promise`<`any`\>

Creates fulfillments for an order.
In a situation where the order has more than one shipping method,
we need to partition the order items, such that they can be sent
to their respective fulfillment provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to cancel. |
| `itemsToFulfill` | `any` | items to fulfil. |
| `config` | `any` | the config to cancel. |

#### Returns

`Promise`<`any`\>

result of the update operation.

#### Defined in

[services/order.js:1121](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L1121)

___

### createRefund

▸ **createRefund**(`orderId`, `refundAmount`, `reason`, `note`, `config?`): `Promise`<`any`\>

Refunds a given amount back to the customer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of the order to refund. |
| `refundAmount` | `float` | the amount to refund. |
| `reason` | `string` | the reason to refund. |
| `note` | `undefined` \| `string` | note for refund. |
| `config` | `any` | the config for refund. |

#### Returns

`Promise`<`any`\>

the result of the refund operation.

#### Defined in

[services/order.js:1328](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L1328)

___

### createShipment

▸ **createShipment**(`orderId`, `fulfillmentId`, `trackingLinks`, `config?`): `order`

Adds a shipment to the order to indicate that an order has left the
warehouse. Will ask the fulfillment provider for any documents that may
have been created in regards to the shipment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the id of the order that has been shipped |
| `fulfillmentId` | `string` | the fulfillment that has now been shipped |
| `trackingLinks` | `undefined` \| `TrackingLink`[] | array of tracking numebers   associated with the shipment |
| `config` | `any` | the config of the order that has been shipped |

#### Returns

`order`

the resulting order following the update.

#### Defined in

[services/order.js:643](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L643)

___

### decorateTotals\_

▸ **decorateTotals_**(`order`, `totalsFields?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `order` | `any` | `undefined` |
| `totalsFields` | `any`[] | `[]` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:1377](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L1377)

___

### deleteMetadata

▸ **deleteMetadata**(`orderId`, `key`): `Promise`<`any`\>

Dedicated method to delete metadata for an order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the order to delete metadata from. |
| `key` | `string` | key for metadata field |

#### Returns

`Promise`<`any`\>

resolves to the updated result.

#### Defined in

[services/order.js:1550](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L1550)

___

### existsByCartId

▸ **existsByCartId**(`cartId`): `Promise`<`Order`\>

Checks the existence of an order by cart id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | cart id to find order |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[services/order.js:417](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L417)

___

### getFulfillmentItems\_

▸ **getFulfillmentItems_**(`order`, `items`, `transformer`): `Promise`<`LineItem`[]\>

Retrieves the order line items, given an array of items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to get line items from |
| `items` | `Object` | the items to get |
| `items.item_id` | `string` | - |
| `items.quantity` | `number` | - |
| `transformer` | `Function` | a function to apply to each of the items    retrieved from the order, should return a line item. If the transformer    returns an undefined value the line item will be filtered from the    returned array. |

#### Returns

`Promise`<`LineItem`[]\>

the line items generated by the transformer.

#### Defined in

[services/order.js:1284](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L1284)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | the config to be used for find |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/order.js:148](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L148)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<`any`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `selector` | `any` | `undefined` |
| `config` | `Object` | `undefined` |
| `config.order` | `Object` | `undefined` |
| `config.order.created_at` | `string` | `"DESC"` |
| `config.skip` | `number` | `0` |
| `config.take` | `number` | `50` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

[services/order.js:173](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L173)

___

### registerReturnReceived

▸ **registerReturnReceived**(`orderId`, `receivedReturn`, `customRefundAmount`): `Promise`<`any`\>

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
| `receivedReturn` | `any` | the received return |
| `customRefundAmount` | `float` | the custom refund amount return |

#### Returns

`Promise`<`any`\>

the result of the update operation

#### Defined in

[services/order.js:1473](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L1473)

___

### retrieve

▸ **retrieve**(`orderId`, `config?`): `Promise`<`Order`\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | id of order to retrieve |
| `config` | `any` | config of order to retrieve |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[services/order.js:305](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L305)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `config?`): `Promise`<`Order`\>

Gets an order by cart id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | cart id to find order |
| `config` | `any` | the config to be used to find order |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[services/order.js:343](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L343)

___

### retrieveByExternalId

▸ **retrieveByExternalId**(`externalId`, `config?`): `Promise`<`Order`\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalId` | `string` | id of order to retrieve |
| `config` | `any` | query config to get order by |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[services/order.js:380](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L380)

___

### transformQueryForTotals\_

▸ **transformQueryForTotals_**(`config`): { `relations`: `any` ; `select`: `any` ; `totalsToSelect`: `never`[] = [] } \| { `relations`: `any` ; `select`: `any`[] = toSelect; `totalsToSelect`: `any`  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `any` |

#### Returns

{ `relations`: `any` ; `select`: `any` ; `totalsToSelect`: `never`[] = [] } \| { `relations`: `any` ; `select`: `any`[] = toSelect; `totalsToSelect`: `any`  }

#### Defined in

[services/order.js:234](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L234)

___

### update

▸ **update**(`orderId`, `update`): `Promise`<`any`\>

Updates an order. Metadata updates should
use dedicated method, e.g. `setMetadata` etc. The function
will throw errors if metadata updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the id of the order. Must be a string that   can be casted to an ObjectId |
| `update` | `any` | an object with the update values. |

#### Returns

`Promise`<`any`\>

resolves to the update result.

#### Defined in

[services/order.js:864](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L864)

___

### updateBillingAddress\_

▸ **updateBillingAddress_**(`order`, `address`): `Promise`<`any`\>

Updates the order's billing address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `any` | the order to update |
| `address` | `any` | the value to set the billing address to |

#### Returns

`Promise`<`any`\>

the result of the update operation

#### Defined in

[services/order.js:744](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L744)

___

### updateShippingAddress\_

▸ **updateShippingAddress_**(`order`, `address`): `Promise`<`any`\>

Updates the order's shipping address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `any` | the order to update |
| `address` | `any` | the value to set the shipping address to |

#### Returns

`Promise`<`any`\>

the result of the update operation

#### Defined in

[services/order.js:779](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L779)

___

### validateFulfillmentLineItem\_

▸ **validateFulfillmentLineItem_**(`item`, `quantity`): `LineItem`

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

`LineItem`

a line item that has the requested fulfillment quantity
  set.

#### Defined in

[services/order.js:1091](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L1091)

___

### validateId\_

▸ **validateId_**(`rawId`): `string`

Used to validate order ids. Throws an error if the cast fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rawId` | `string` | the raw order id to validate. |

#### Returns

`string`

the validated id

#### Defined in

[services/order.js:139](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L139)

___

### withTransaction

▸ **withTransaction**(`manager`): [`OrderService`](OrderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `manager` | `any` |

#### Returns

[`OrderService`](OrderService.md)

#### Defined in

[services/order.js:102](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/order.js#L102)
