---
displayed_sidebar: entitiesSidebar
---

# Class: ClaimOrder

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`ClaimOrder`**

## Constructors

### constructor

• **new ClaimOrder**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### additional\_items

• **additional\_items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/claim-order.ts:69](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L69)

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

[models/claim-order.ts:107](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L107)

___

### claim\_items

• **claim\_items**: [`ClaimItem`](ClaimItem.md)[]

#### Defined in

[models/claim-order.ts:66](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L66)

___

### created\_at

• **created\_at**: `Date`

#### Overrides

SoftDeletableEntity.created\_at

#### Defined in

[models/claim-order.ts:110](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L110)

___

### deleted\_at

• **deleted\_at**: `Date`

#### Overrides

SoftDeletableEntity.deleted\_at

#### Defined in

[models/claim-order.ts:116](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L116)

___

### fulfillment\_status

• **fulfillment\_status**: [`ClaimFulfillmentStatus`](../enums/ClaimFulfillmentStatus.md)

#### Defined in

[models/claim-order.ts:63](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L63)

___

### fulfillments

• **fulfillments**: [`Fulfillment`](Fulfillment.md)[]

#### Defined in

[models/claim-order.ts:101](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L101)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/claim-order.ts:125](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L125)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/claim-order.ts:122](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L122)

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

[models/claim-order.ts:119](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L119)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/claim-order.ts:80](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L80)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/claim-order.ts:76](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L76)

___

### payment\_status

• **payment\_status**: [`ClaimPaymentStatus`](../enums/ClaimPaymentStatus.md)

#### Defined in

[models/claim-order.ts:56](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L56)

___

### refund\_amount

• **refund\_amount**: `number`

#### Defined in

[models/claim-order.ts:104](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L104)

___

### return\_order

• **return\_order**: [`Return`](Return.md)

#### Defined in

[models/claim-order.ts:83](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L83)

___

### shipping\_address

• **shipping\_address**: [`Address`](Address.md)

#### Defined in

[models/claim-order.ts:91](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L91)

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

[models/claim-order.ts:87](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L87)

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

#### Defined in

[models/claim-order.ts:96](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L96)

___

### type

• **type**: [`ClaimType`](../enums/ClaimType.md)

#### Defined in

[models/claim-order.ts:72](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L72)

___

### updated\_at

• **updated\_at**: `Date`

#### Overrides

SoftDeletableEntity.updated\_at

#### Defined in

[models/claim-order.ts:113](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L113)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/claim-order.ts:127](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-order.ts#L127)
