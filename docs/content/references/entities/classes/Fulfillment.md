---
displayed_sidebar: entitiesSidebar
---

# Class: Fulfillment

## Hierarchy

- `BaseEntity`

  ↳ **`Fulfillment`**

## Constructors

### constructor

• **new Fulfillment**()

#### Inherited from

BaseEntity.constructor

## Properties

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

[models/fulfillment.ts:79](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L79)

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

#### Defined in

[models/fulfillment.ts:29](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L29)

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

[models/fulfillment.ts:25](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L25)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/fulfillment.ts:73](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L73)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/fulfillment.ts:85](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L85)

___

### items

• **items**: [`FulfillmentItem`](FulfillmentItem.md)[]

#### Defined in

[models/fulfillment.ts:62](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L62)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/fulfillment.ts:82](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L82)

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

[models/fulfillment.ts:48](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L48)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/fulfillment.ts:45](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L45)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/fulfillment.ts:41](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L41)

___

### provider

• **provider**: [`FulfillmentProvider`](FulfillmentProvider.md)

#### Defined in

[models/fulfillment.ts:56](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L56)

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

[models/fulfillment.ts:52](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L52)

___

### shipped\_at

• **shipped\_at**: `Date`

#### Defined in

[models/fulfillment.ts:76](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L76)

___

### swap

• **swap**: [`Swap`](Swap.md)

#### Defined in

[models/fulfillment.ts:37](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L37)

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

[models/fulfillment.ts:33](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L33)

___

### tracking\_links

• **tracking\_links**: [`TrackingLink`](TrackingLink.md)[]

#### Defined in

[models/fulfillment.ts:67](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L67)

___

### tracking\_numbers

• **tracking\_numbers**: `string`[]

#### Defined in

[models/fulfillment.ts:70](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L70)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/fulfillment.ts:87](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/fulfillment.ts#L87)
