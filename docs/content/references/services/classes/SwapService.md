# Class: SwapService

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

[services/swap.js:21](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L21)

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

[services/swap.js:9](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L9)

## Methods

### cancel

▸ **cancel**(`swapId`): `Promise`<`Swap`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` |  |

#### Returns

`Promise`<`Swap`\>

#### Defined in

[services/swap.js:790](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L790)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Swap`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` |  |

#### Returns

`Swap`

#### Defined in

[services/swap.js:983](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L983)

___

### create

▸ **create**(`order`, `returnItems`, `additionalItems`, `returnShipping`, `custom?`): `Promise`<`Swap`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |
| `returnItems` | `ReturnItem`[] |  |
| `additionalItems` | `undefined` \| `PreliminaryLineItem`[] |  |
| `returnShipping` | `any` |  |
| `custom` | `any` |  |

#### Returns

`Promise`<`Swap`\>

#### Defined in

[services/swap.js:313](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L313)

___

### createCart

▸ **createCart**(`swapId`, `customShippingOptions?`): `Promise`<`Swap`\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `swapId` | `string` | `undefined` |  |
| `customShippingOptions` | `any`[] | `[]` |  |

#### Returns

`Promise`<`Swap`\>

#### Defined in

[services/swap.js:544](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L544)

___

### createFulfillment

▸ **createFulfillment**(`swapId`, `config?`): `Promise`<`Swap`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`Swap`\>

#### Defined in

[services/swap.js:848](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L848)

___

### createShipment

▸ **createShipment**(`swapId`, `fulfillmentId`, `trackingLinks`, `config?`): `Promise`<`Swap`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` |  |
| `fulfillmentId` | `string` |  |
| `trackingLinks` | `undefined` \| `TrackingLink`[] |  |
| `config` | `any` |  |

#### Returns

`Promise`<`Swap`\>

#### Defined in

[services/swap.js:1016](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L1016)

___

### deleteMetadata

▸ **deleteMetadata**(`swapId`, `key`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` |  |
| `key` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/swap.js:1089](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L1089)

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

[services/swap.js:238](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L238)

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

[services/swap.js:395](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L395)

___

### registerCartCompletion

▸ **registerCartCompletion**(`swapId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/swap.js:659](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L659)

___

### registerReceived

▸ **registerReceived**(`id`): `Promise`<`Order`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |

#### Returns

`Promise`<`Order`\>

#### Defined in

[services/swap.js:1114](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L1114)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Swap`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`Swap`\>

#### Defined in

[services/swap.js:181](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L181)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `relations?`): `Promise`<`Swap`\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cartId` | `string` | `undefined` |  |
| `relations` | `string`[] | `[]` |  |

#### Returns

`Promise`<`Swap`\>

#### Defined in

[services/swap.js:216](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L216)

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

[services/swap.js:114](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L114)

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

[services/swap.js:511](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L511)

___

### validateReturnItems\_

▸ **validateReturnItems_**(`order`, `returnItems`): `ReturnItems`[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `OrderLike` |  |
| `returnItems` | `ReturnItem`[] |  |

#### Returns

`ReturnItems`[]

#### Defined in

[services/swap.js:269](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L269)

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

[services/swap.js:86](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/swap.js#L86)
