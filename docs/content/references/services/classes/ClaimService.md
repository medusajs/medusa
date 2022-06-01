# Class: ClaimService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ClaimService`**

## Constructors

### constructor

• **new ClaimService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/claim.js:14](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L14)

## Properties

### addressRepo\_

• **addressRepo\_**: `any`

#### Defined in

[services/claim.js:36](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L36)

___

### claimItemService\_

• **claimItemService\_**: `any`

#### Defined in

[services/claim.js:37](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L37)

___

### claimRepository\_

• **claimRepository\_**: `any`

#### Defined in

[services/claim.js:38](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L38)

___

### eventBus\_

• **eventBus\_**: `any`

#### Defined in

[services/claim.js:39](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L39)

___

### fulfillmentProviderService\_

• **fulfillmentProviderService\_**: `any`

#### Defined in

[services/claim.js:40](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L40)

___

### fulfillmentService\_

• **fulfillmentService\_**: `any`

#### Defined in

[services/claim.js:41](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L41)

___

### inventoryService\_

• **inventoryService\_**: `any`

#### Defined in

[services/claim.js:42](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L42)

___

### lineItemService\_

• **lineItemService\_**: `any`

#### Defined in

[services/claim.js:43](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L43)

___

### paymentProviderService\_

• **paymentProviderService\_**: `any`

#### Defined in

[services/claim.js:44](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L44)

___

### regionService\_

• **regionService\_**: `any`

#### Defined in

[services/claim.js:45](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L45)

___

### returnService\_

• **returnService\_**: `any`

#### Defined in

[services/claim.js:46](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L46)

___

### shippingOptionService\_

• **shippingOptionService\_**: `any`

#### Defined in

[services/claim.js:47](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L47)

___

### taxProviderService\_

• **taxProviderService\_**: `any`

#### Defined in

[services/claim.js:48](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L48)

___

### totalsService\_

• **totalsService\_**: `any`

#### Defined in

[services/claim.js:49](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L49)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `CREATED` | `string` |
| `FULFILLMENT_CREATED` | `string` |
| `REFUND_PROCESSED` | `string` |
| `SHIPMENT_CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/claim.js:5](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L5)

## Methods

### cancel

▸ **cancel**(`id`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/claim.js:644](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L644)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillmentId` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/claim.js:512](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L512)

___

### create

▸ **create**(`data`): `any`

Creates a Claim on an Order. Claims consists of items that are claimed and
optionally items to be sent as replacement for the claimed items. The
shipping address that the new items will be shipped to

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | the object containing all data required to create a claim |

#### Returns

`any`

created claim

#### Defined in

[services/claim.js:159](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L159)

___

### createFulfillment

▸ **createFulfillment**(`id`, `config?`): `Claim`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the object containing all data required to create a claim |
| `config` | `Object` | config object |
| `config.metadata` | `any` | config metadata |
| `config.no_notification` | `undefined` \| `boolean` | config no notification |

#### Returns

`Claim`

created claim

#### Defined in

[services/claim.js:378](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L378)

___

### createShipment

▸ **createShipment**(`id`, `fulfillmentId`, `trackingLinks`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `any` | `undefined` |
| `fulfillmentId` | `any` | `undefined` |
| `trackingLinks` | `any` | `undefined` |
| `config` | `Object` | `undefined` |
| `config.metadata` | `Object` | `{}` |
| `config.no_notification` | `undefined` | `undefined` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/claim.js:577](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L577)

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

[services/claim.js:734](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L734)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | the config object containing query settings |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/claim.js:696](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L696)

___

### processRefund

▸ **processRefund**(`id`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/claim.js:535](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L535)

___

### retrieve

▸ **retrieve**(`claimId`, `config?`): `Promise`<`Order`\>

Gets an order by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `claimId` | `string` | id of order to retrieve |
| `config` | `any` | the config object containing query settings |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[services/claim.js:711](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L711)

___

### update

▸ **update**(`id`, `data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[services/claim.js:80](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L80)

___

### withTransaction

▸ **withTransaction**(`manager`): [`ClaimService`](ClaimService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `manager` | `any` |

#### Returns

[`ClaimService`](ClaimService.md)

#### Defined in

[services/claim.js:52](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L52)
