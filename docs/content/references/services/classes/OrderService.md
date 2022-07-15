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

[services/order.js:25](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L25)

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

[services/order.js:6](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L6)

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

[services/order.js:806](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L806)

___

### archive

▸ **archive**(`orderId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:1302](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L1302)

___

### cancel

▸ **cancel**(`orderId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:952](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L952)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:1243](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L1243)

___

### capturePayment

▸ **capturePayment**(`orderId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:1021](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L1021)

___

### completeOrder

▸ **completeOrder**(`orderId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:429](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L429)

___

### create

▸ **create**(`data`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:723](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L723)

___

### createFromCart

▸ **createFromCart**(`cartId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:465](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L465)

___

### createFulfillment

▸ **createFulfillment**(`orderId`, `itemsToFulfill`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `itemsToFulfill` | `any` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:1121](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L1121)

___

### createRefund

▸ **createRefund**(`orderId`, `refundAmount`, `reason`, `note`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `refundAmount` | `float` |  |
| `reason` | `string` |  |
| `note` | `undefined` \| `string` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:1329](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L1329)

___

### createShipment

▸ **createShipment**(`orderId`, `fulfillmentId`, `trackingLinks`, `config?`): `order`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `fulfillmentId` | `string` |  |
| `trackingLinks` | `undefined` \| `TrackingLink`[] |  |
| `config` | `any` |  |

#### Returns

`order`

#### Defined in

[services/order.js:643](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L643)

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

[services/order.js:1378](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L1378)

___

### deleteMetadata

▸ **deleteMetadata**(`orderId`, `key`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `key` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:1553](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L1553)

___

### existsByCartId

▸ **existsByCartId**(`cartId`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.js:417](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L417)

___

### getFulfillmentItems\_

▸ **getFulfillmentItems_**(`order`, `items`, `transformer`): `Promise`<`LineItem`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |
| `items` | `Object` |  |
| `items.item_id` | `string` | - |
| `items.quantity` | `number` | - |
| `transformer` | `Function` |  |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[services/order.js:1285](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L1285)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:148](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L148)

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

[services/order.js:173](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L173)

___

### registerReturnReceived

▸ **registerReturnReceived**(`orderId`, `receivedReturn`, `customRefundAmount`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `receivedReturn` | `any` |  |
| `customRefundAmount` | `float` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:1476](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L1476)

___

### retrieve

▸ **retrieve**(`orderId`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.js:305](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L305)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.js:343](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L343)

___

### retrieveByExternalId

▸ **retrieveByExternalId**(`externalId`, `config?`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalId` | `string` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/order.js:380](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L380)

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

[services/order.js:234](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L234)

___

### update

▸ **update**(`orderId`, `update`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` |  |
| `update` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:864](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L864)

___

### updateBillingAddress\_

▸ **updateBillingAddress_**(`order`, `address`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `any` |  |
| `address` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:744](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L744)

___

### updateShippingAddress\_

▸ **updateShippingAddress_**(`order`, `address`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `any` |  |
| `address` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/order.js:779](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L779)

___

### validateFulfillmentLineItem\_

▸ **validateFulfillmentLineItem_**(`item`, `quantity`): `LineItem`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `LineItem` |  |
| `quantity` | `number` |  |

#### Returns

`LineItem`

#### Defined in

[services/order.js:1091](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L1091)

___

### validateId\_

▸ **validateId_**(`rawId`): `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rawId` | `string` |  |

#### Returns

`string`

#### Defined in

[services/order.js:139](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L139)

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

[services/order.js:102](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/order.js#L102)
