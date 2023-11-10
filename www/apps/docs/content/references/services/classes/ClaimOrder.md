# ClaimOrder

A Claim represents a group of faulty or missing items. It consists of claim items that refer to items in the original order that should be replaced or refunded. It also includes details related to shipping and fulfillment.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`ClaimOrder`**

## Constructors

### constructor

**new ClaimOrder**()

A Claim represents a group of faulty or missing items. It consists of claim items that refer to items in the original order that should be replaced or refunded. It also includes details related to shipping and fulfillment.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### additional\_items

 **additional\_items**: [`LineItem`](LineItem.md)[]

The details of the new items to be shipped when the claim's type is `replace`

#### Defined in

[packages/medusa/src/models/claim-order.ts:126](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L126)

___

### canceled\_at

 **canceled\_at**: `Date`

The date with timezone at which the claim was canceled.

#### Defined in

[packages/medusa/src/models/claim-order.ts:164](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L164)

___

### claim\_items

 **claim\_items**: [`ClaimItem`](ClaimItem.md)[]

The details of the items that should be replaced or refunded.

#### Defined in

[packages/medusa/src/models/claim-order.ts:123](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L123)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Overrides

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/models/claim-order.ts:167](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L167)

___

### deleted\_at

 **deleted\_at**: `Date`

The date with timezone at which the resource was deleted.

#### Overrides

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/models/claim-order.ts:173](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L173)

___

### fulfillment\_status

 **fulfillment\_status**: [`ClaimFulfillmentStatus`](../enums/ClaimFulfillmentStatus.md) = `not_fulfilled`

The claim's fulfillment status

#### Defined in

[packages/medusa/src/models/claim-order.ts:120](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L120)

___

### fulfillments

 **fulfillments**: [`Fulfillment`](Fulfillment.md)[]

The fulfillments of the new items to be shipped

#### Defined in

[packages/medusa/src/models/claim-order.ts:158](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L158)

___

### id

 **id**: `string`

The claim's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

 **idempotency\_key**: `string`

Randomly generated key used to continue the completion of the cart associated with the claim in case of failure.

#### Defined in

[packages/medusa/src/models/claim-order.ts:182](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L182)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/claim-order.ts:179](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L179)

___

### no\_notification

 **no\_notification**: `boolean`

Flag for describing whether or not notifications related to this should be send.

#### Defined in

[packages/medusa/src/models/claim-order.ts:176](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L176)

___

### order

 **order**: [`Order`](Order.md)

The details of the order that this claim was created for.

#### Defined in

[packages/medusa/src/models/claim-order.ts:137](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L137)

___

### order\_id

 **order\_id**: `string`

The ID of the order that the claim comes from.

#### Defined in

[packages/medusa/src/models/claim-order.ts:133](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L133)

___

### payment\_status

 **payment\_status**: [`ClaimPaymentStatus`](../enums/ClaimPaymentStatus.md) = `na`

The status of the claim's payment

#### Defined in

[packages/medusa/src/models/claim-order.ts:113](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L113)

___

### refund\_amount

 **refund\_amount**: `number`

The amount that will be refunded in conjunction with the claim

#### Defined in

[packages/medusa/src/models/claim-order.ts:161](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L161)

___

### return\_order

 **return\_order**: [`Return`](Return.md)

The details of the return associated with the claim if the claim's type is `replace`.

#### Defined in

[packages/medusa/src/models/claim-order.ts:140](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L140)

___

### shipping\_address

 **shipping\_address**: [`Address`](Address.md)

The details of the address that new items should be shipped to.

#### Defined in

[packages/medusa/src/models/claim-order.ts:148](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L148)

___

### shipping\_address\_id

 **shipping\_address\_id**: `string`

The ID of the address that the new items should be shipped to

#### Defined in

[packages/medusa/src/models/claim-order.ts:144](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L144)

___

### shipping\_methods

 **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

The details of the shipping methods that the claim order will be shipped with.

#### Defined in

[packages/medusa/src/models/claim-order.ts:153](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L153)

___

### type

 **type**: [`ClaimType`](../enums/ClaimType.md)

The claim's type

#### Defined in

[packages/medusa/src/models/claim-order.ts:129](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L129)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Overrides

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/models/claim-order.ts:170](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L170)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/claim-order.ts:188](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/claim-order.ts#L188)
