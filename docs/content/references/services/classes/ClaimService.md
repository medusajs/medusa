# Class: ClaimService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ClaimService`**

## Constructors

### constructor

• **new ClaimService**(`__namedParameters`)

#### Parameters

| Name                | Type     |
| :------------------ | :------- |
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

---

### claimItemService\_

• **claimItemService\_**: `any`

#### Defined in

[services/claim.js:37](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L37)

---

### claimRepository\_

• **claimRepository\_**: `any`

#### Defined in

[services/claim.js:38](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L38)

---

### eventBus\_

• **eventBus\_**: `any`

#### Defined in

[services/claim.js:39](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L39)

---

### fulfillmentProviderService\_

• **fulfillmentProviderService\_**: `any`

#### Defined in

[services/claim.js:40](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L40)

---

### fulfillmentService\_

• **fulfillmentService\_**: `any`

#### Defined in

[services/claim.js:41](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L41)

---

### inventoryService\_

• **inventoryService\_**: `any`

#### Defined in

[services/claim.js:42](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L42)

---

### lineItemService\_

• **lineItemService\_**: `any`

#### Defined in

[services/claim.js:43](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L43)

---

### paymentProviderService\_

• **paymentProviderService\_**: `any`

#### Defined in

[services/claim.js:44](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L44)

---

### regionService\_

• **regionService\_**: `any`

#### Defined in

[services/claim.js:45](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L45)

---

### returnService\_

• **returnService\_**: `any`

#### Defined in

[services/claim.js:46](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L46)

---

### shippingOptionService\_

• **shippingOptionService\_**: `any`

#### Defined in

[services/claim.js:47](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L47)

---

### taxProviderService\_

• **taxProviderService\_**: `any`

#### Defined in

[services/claim.js:48](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L48)

---

### totalsService\_

• **totalsService\_**: `any`

#### Defined in

[services/claim.js:49](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L49)

---

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name                  | Type     |
| :-------------------- | :------- |
| `CANCELED`            | `string` |
| `CREATED`             | `string` |
| `FULFILLMENT_CREATED` | `string` |
| `REFUND_PROCESSED`    | `string` |
| `SHIPMENT_CREATED`    | `string` |
| `UPDATED`             | `string` |

#### Defined in

[services/claim.js:5](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L5)

## Methods

### cancel

▸ **cancel**(`id`): `Promise`<`any`\>

#### Parameters

| Name | Type  |
| :--- | :---- |
| `id` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/claim.js:644](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L644)

---

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<`any`\>

#### Parameters

| Name            | Type  |
| :-------------- | :---- |
| `fulfillmentId` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/claim.js:512](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L512)

---

### create

▸ **create**(`data`): `any`

Creates a Claim on an Order. Claims consists of items that are claimed and
optionally items to be sent as replacement for the claimed items. The
shipping address that the new items will be shipped to

#### Parameters

| Name   | Type  | Description                                               |
| :----- | :---- | :-------------------------------------------------------- |
| `data` | `any` | the object containing all data required to create a claim |

#### Returns

`any`

created claim

#### Defined in

[services/claim.js:159](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L159)

---

### createFulfillment

▸ **createFulfillment**(`id`, `config?`): `Claim`

#### Parameters

| Name                     | Type                     | Description                                               |
| :----------------------- | :----------------------- | :-------------------------------------------------------- |
| `id`                     | `string`                 | the object containing all data required to create a claim |
| `config`                 | `Object`                 | config object                                             |
| `config.metadata`        | `any`                    | config metadata                                           |
| `config.no_notification` | `undefined` \| `boolean` | config no notification                                    |

#### Returns

`Claim`

created claim

#### Defined in

[services/claim.js:378](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L378)

---

### createShipment

▸ **createShipment**(`id`, `fulfillmentId`, `trackingLinks`, `config?`): `Promise`<`any`\>

#### Parameters

| Name                     | Type        | Default value |
| :----------------------- | :---------- | :------------ |
| `id`                     | `any`       | `undefined`   |
| `fulfillmentId`          | `any`       | `undefined`   |
| `trackingLinks`          | `any`       | `undefined`   |
| `config`                 | `Object`    | `undefined`   |
| `config.metadata`        | `Object`    | `{}`          |
| `config.no_notification` | `undefined` | `undefined`   |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/claim.js:577](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L577)

---

### deleteMetadata

▸ **deleteMetadata**(`orderId`, `key`): `Promise`<`any`\>

Dedicated method to delete metadata for an order.

#### Parameters

| Name      | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `orderId` | `string` | the order to delete metadata from. |
| `key`     | `string` | key for metadata field             |

#### Returns

`Promise`<`any`\>

resolves to the updated result.

#### Defined in

[services/claim.js:734](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L734)

---

### list

▸ **list**(`selector`, `config?`): `Promise`<`any`\>

#### Parameters

| Name       | Type  | Description                                 |
| :--------- | :---- | :------------------------------------------ |
| `selector` | `any` | the query object for find                   |
| `config`   | `any` | the config object containing query settings |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/claim.js:696](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L696)

---

### processRefund

▸ **processRefund**(`id`): `Promise`<`any`\>

#### Parameters

| Name | Type  |
| :--- | :---- |
| `id` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/claim.js:535](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L535)

---

### retrieve

▸ **retrieve**(`claimId`, `config?`): `Promise`<`Order`\>

Gets an order by id.

#### Parameters

| Name      | Type     | Description                                 |
| :-------- | :------- | :------------------------------------------ |
| `claimId` | `string` | id of order to retrieve                     |
| `config`  | `any`    | the config object containing query settings |

#### Returns

`Promise`<`Order`\>

the order document

#### Defined in

[services/claim.js:711](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L711)

---

### update

▸ **update**(`id`, `data`): `any`

#### Parameters

| Name   | Type  |
| :----- | :---- |
| `id`   | `any` |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[services/claim.js:80](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L80)

---

### withTransaction

▸ **withTransaction**(`manager`): [`ClaimService`](ClaimService.md)

#### Parameters

| Name      | Type  |
| :-------- | :---- |
| `manager` | `any` |

#### Returns

[`ClaimService`](ClaimService.md)

#### Defined in

[services/claim.js:52](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim.js#L52)
