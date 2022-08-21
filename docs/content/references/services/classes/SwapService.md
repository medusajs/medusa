# Class: SwapService

Handles swaps

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`SwapService`**

## Constructors

### constructor

• **new SwapService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[packages/medusa/src/services/swap.js:21](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L21)

## Properties

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

[packages/medusa/src/services/swap.js:9](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L9)

## Methods

### cancel

▸ **cancel**(`swapId`): `Promise`<`Swap`\>

Cancels a given swap if possible. A swap can only be canceled if all
related returns, fulfillments, and payments have been canceled. If a swap
is associated with a refund, it cannot be canceled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to cancel. |

#### Returns

`Promise`<`Swap`\>

the canceled swap.

#### Defined in

[packages/medusa/src/services/swap.js:792](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L792)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Swap`

Cancels a fulfillment (if related to a swap)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` | the ID of the fulfillment to cancel |

#### Returns

`Swap`

updated swap

#### Defined in

[packages/medusa/src/services/swap.js:985](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L985)

___

### create

▸ **create**(`order`, `returnItems`, `additionalItems`, `returnShipping`, `custom?`): `Promise`<`Swap`\>

Creates a swap from an order, with given return items, additional items
and an optional return shipping method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to base the swap off. |
| `returnItems` | `ReturnItem`[] | the items to return in the swap. |
| `additionalItems` | `undefined` \| `PreliminaryLineItem`[] | the items to send to  the customer. |
| `returnShipping` | `any` | an optional shipping method for  returning the returnItems. |
| `custom` | `any` | contains relevant custom information. This object may  include no_notification which will disable sending notification when creating  swap. If set, it overrules the attribute inherited from the order. |

#### Returns

`Promise`<`Swap`\>

the newly created swap.

#### Defined in

[packages/medusa/src/services/swap.js:315](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L315)

___

### createCart

▸ **createCart**(`swapId`, `customShippingOptions?`): `Promise`<`Swap`\>

Creates a cart from the given swap and order. The cart can be used to pay
for differences associated with the swap. The swap represented by the
swapId must belong to the order. Fails if there is already a cart on the
swap.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `swapId` | `string` | `undefined` | the id of the swap to create the cart from |
| `customShippingOptions` | `any`[] | `[]` | the shipping options |

#### Returns

`Promise`<`Swap`\>

the swap with its cart_id prop set to the id of
  the new cart.

#### Defined in

[packages/medusa/src/services/swap.js:546](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L546)

___

### createFulfillment

▸ **createFulfillment**(`swapId`, `config?`): `Promise`<`Swap`\>

Fulfills the addtional items associated with the swap. Will call the
fulfillment providers associated with the shipping methods.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to fulfill, |
| `config` | `any` | optional configurations, includes optional metadata to attach to the shipment, and a no_notification flag. |

#### Returns

`Promise`<`Swap`\>

the updated swap with new status and fulfillments.

#### Defined in

[packages/medusa/src/services/swap.js:850](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L850)

___

### createShipment

▸ **createShipment**(`swapId`, `fulfillmentId`, `trackingLinks`, `config?`): `Promise`<`Swap`\>

Marks a fulfillment as shipped and attaches tracking numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap that has been shipped. |
| `fulfillmentId` | `string` | the id of the specific fulfillment that   has been shipped |
| `trackingLinks` | `undefined` \| `TrackingLink`[] | the tracking numbers associated   with the shipment |
| `config` | `any` | optional configurations, includes optional metadata to attach to the shipment, and a noNotification flag. |

#### Returns

`Promise`<`Swap`\>

the updated swap with new fulfillments and status.

#### Defined in

[packages/medusa/src/services/swap.js:1018](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L1018)

___

### deleteMetadata

▸ **deleteMetadata**(`swapId`, `key`): `Promise`<`any`\>

Dedicated method to delete metadata for a swap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the order to delete metadata from. |
| `key` | `string` | key for metadata field |

#### Returns

`Promise`<`any`\>

resolves to the updated result.

#### Defined in

[packages/medusa/src/services/swap.js:1091](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L1091)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/swap.js:240](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L240)

___

### processDifference

▸ **processDifference**(`swapId`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapId` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/medusa/src/services/swap.js:397](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L397)

___

### registerCartCompletion

▸ **registerCartCompletion**(`swapId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | The id of the swap |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/medusa/src/services/swap.js:661](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L661)

___

### registerReceived

▸ **registerReceived**(`id`): `Promise`<`Order`\>

Registers the swap return items as received so that they cannot be used
as a part of other swaps/returns.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the order with the swap. |

#### Returns

`Promise`<`Order`\>

the resulting order

#### Defined in

[packages/medusa/src/services/swap.js:1116](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L1116)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Swap`\>

Retrieves a swap with the given id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the swap to retrieve |
| `config` | `any` | the configuration to retrieve the swap |

#### Returns

`Promise`<`Swap`\>

the swap

#### Defined in

[packages/medusa/src/services/swap.js:181](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L181)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `relations?`): `Promise`<`Swap`\>

Retrieves a swap based on its associated cart id

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cartId` | `string` | `undefined` | the cart id that the swap's cart has |
| `relations` | `string`[] | `[]` | the relations to retrieve swap |

#### Returns

`Promise`<`Swap`\>

the swap

#### Defined in

[packages/medusa/src/services/swap.js:218](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L218)

___

### transformQueryForCart\_

▸ **transformQueryForCart_**(`config`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `any` |

#### Returns

`any`

#### Defined in

[packages/medusa/src/services/swap.js:114](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L114)

___

### update

▸ **update**(`swapId`, `update`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapId` | `any` |
| `update` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/medusa/src/services/swap.js:513](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L513)

___

### validateReturnItems\_

▸ **validateReturnItems_**(`order`, `returnItems`): `ReturnItems`[]

Goes through a list of return items to ensure that they exist on the
original order. If the item exists it is verified that the quantity to
return is not higher than the original quantity ordered.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `OrderLike` | the order to return from |
| `returnItems` | `ReturnItem`[] | the items to return |

#### Returns

`ReturnItems`[]

the validated returnItems

#### Defined in

[packages/medusa/src/services/swap.js:271](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L271)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`SwapService`](SwapService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`SwapService`](SwapService.md)

#### Defined in

[packages/medusa/src/services/swap.js:86](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/swap.js#L86)
