# Fulfillment

A Fulfillment is created once an admin can prepare the purchased goods. Fulfillments will eventually be shipped and hold information about how to track shipments. Fulfillments are created through a fulfillment provider, which typically integrates a third-party shipping service. Fulfillments can be associated with orders, claims, swaps, and returns.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`Fulfillment`**

## Constructors

### constructor

**new Fulfillment**()

A Fulfillment is created once an admin can prepare the purchased goods. Fulfillments will eventually be shipped and hold information about how to track shipments. Fulfillments are created through a fulfillment provider, which typically integrates a third-party shipping service. Fulfillments can be associated with orders, claims, swaps, and returns.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### canceled\_at

 **canceled\_at**: `Date`

The date with timezone at which the Fulfillment was canceled.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:82](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L82)

___

### claim\_order

 **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

The details of the claim that the fulfillment may belong to.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:29](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L29)

___

### claim\_order\_id

 **claim\_order\_id**: `string`

The ID of the Claim that the Fulfillment belongs to.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L25)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### data

 **data**: Record<`string`, `unknown`\>

This contains all the data necessary for the Fulfillment provider to handle the fulfillment.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:76](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L76)

___

### id

 **id**: `string`

The fulfillment's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

 **idempotency\_key**: `string`

Randomly generated key used to continue the completion of the fulfillment in case of failure.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:88](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L88)

___

### items

 **items**: [`FulfillmentItem`](FulfillmentItem.md)[]

The Fulfillment Items in the Fulfillment. These hold information about how many of each Line Item has been fulfilled.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:65](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L65)

___

### location\_id

 **location\_id**: ``null`` \| `string`

The ID of the stock location the fulfillment will be shipped from

#### Defined in

[packages/medusa/src/models/fulfillment.ts:55](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L55)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/fulfillment.ts:85](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L85)

___

### no\_notification

 **no\_notification**: `boolean`

Flag for describing whether or not notifications related to this should be sent.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:48](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L48)

___

### order

 **order**: [`Order`](Order.md)

The details of the order that the fulfillment may belong to.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:45](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L45)

___

### order\_id

 **order\_id**: `string`

The ID of the Order that the Fulfillment belongs to.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L41)

___

### provider

 **provider**: [`FulfillmentProvider`](FulfillmentProvider.md)

The details of the fulfillment provider responsible for handling the fulfillment.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:59](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L59)

___

### provider\_id

 **provider\_id**: `string`

The ID of the Fulfillment Provider responsible for handling the fulfillment.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:52](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L52)

___

### shipped\_at

 **shipped\_at**: `Date`

The date with timezone at which the Fulfillment was shipped.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:79](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L79)

___

### swap

 **swap**: [`Swap`](Swap.md)

The details of the swap that the fulfillment may belong to.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L37)

___

### swap\_id

 **swap\_id**: `string`

The ID of the Swap that the Fulfillment belongs to.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:33](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L33)

___

### tracking\_links

 **tracking\_links**: [`TrackingLink`](TrackingLink.md)[]

The Tracking Links that can be used to track the status of the Fulfillment. These will usually be provided by the Fulfillment Provider.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:70](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L70)

___

### tracking\_numbers

 **tracking\_numbers**: `string`[]

The tracking numbers that can be used to track the status of the fulfillment.

#### Defined in

[packages/medusa/src/models/fulfillment.ts:73](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L73)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[BaseEntity](BaseEntity.md).[updated_at](BaseEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/fulfillment.ts:94](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/fulfillment.ts#L94)
