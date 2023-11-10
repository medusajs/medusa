# Return

A Return holds information about Line Items that a Customer wishes to send back, along with how the items will be returned. Returns can also be used as part of a Swap or a Claim.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`Return`**

## Constructors

### constructor

**new Return**()

A Return holds information about Line Items that a Customer wishes to send back, along with how the items will be returned. Returns can also be used as part of a Swap or a Claim.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### claim\_order

 **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

The details of the claim that the return may belong to.

#### Defined in

[packages/medusa/src/models/return.ts:74](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L74)

___

### claim\_order\_id

 **claim\_order\_id**: ``null`` \| `string`

The ID of the claim that the return may belong to.

#### Defined in

[packages/medusa/src/models/return.ts:70](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L70)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### id

 **id**: `string`

The return's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

 **idempotency\_key**: ``null`` \| `string`

Randomly generated key used to continue the completion of the return in case of failure.

#### Defined in

[packages/medusa/src/models/return.ts:109](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L109)

___

### items

 **items**: [`ReturnItem`](ReturnItem.md)[]

The details of the items that the customer is returning.

#### Defined in

[packages/medusa/src/models/return.ts:58](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L58)

___

### location\_id

 **location\_id**: ``null`` \| `string`

The ID of the stock location the return will be added back.

#### Defined in

[packages/medusa/src/models/return.ts:91](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L91)

___

### metadata

 **metadata**: ``null`` \| Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/return.ts:106](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L106)

___

### no\_notification

 **no\_notification**: ``null`` \| `boolean`

When set to true, no notification will be sent related to this return.

#### Defined in

[packages/medusa/src/models/return.ts:103](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L103)

___

### order

 **order**: [`Order`](Order.md)

The details of the order that the return was created for.

#### Defined in

[packages/medusa/src/models/return.ts:82](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L82)

___

### order\_id

 **order\_id**: ``null`` \| `string`

The ID of the order that the return was created for.

#### Defined in

[packages/medusa/src/models/return.ts:78](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L78)

___

### received\_at

 **received\_at**: `Date`

The date with timezone at which the return was received.

#### Defined in

[packages/medusa/src/models/return.ts:100](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L100)

___

### refund\_amount

 **refund\_amount**: `number`

The amount that should be refunded as a result of the return.

#### Defined in

[packages/medusa/src/models/return.ts:97](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L97)

___

### shipping\_data

 **shipping\_data**: Record<`string`, `unknown`\>

Data about the return shipment as provided by the Fulfilment Provider that handles the return shipment.

#### Defined in

[packages/medusa/src/models/return.ts:94](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L94)

___

### shipping\_method

 **shipping\_method**: [`ShippingMethod`](ShippingMethod.md)

The details of the Shipping Method that will be used to send the Return back. Can be null if the Customer will handle the return shipment themselves.

#### Defined in

[packages/medusa/src/models/return.ts:87](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L87)

___

### status

 **status**: [`ReturnStatus`](../enums/ReturnStatus.md) = `requested`

Status of the Return.

#### Defined in

[packages/medusa/src/models/return.ts:52](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L52)

___

### swap

 **swap**: [`Swap`](Swap.md)

The details of the swap that the return may belong to.

#### Defined in

[packages/medusa/src/models/return.ts:66](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L66)

___

### swap\_id

 **swap\_id**: ``null`` \| `string`

The ID of the swap that the return may belong to.

#### Defined in

[packages/medusa/src/models/return.ts:62](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L62)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[BaseEntity](BaseEntity.md).[updated_at](BaseEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/return.ts:115](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return.ts#L115)
