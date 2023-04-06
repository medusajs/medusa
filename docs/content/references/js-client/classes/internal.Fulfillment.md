---
displayed_sidebar: jsClientSidebar
---

# Class: Fulfillment

[internal](../modules/internal.md).Fulfillment

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`Fulfillment`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/fulfillment.d.ts:26

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

medusa/dist/models/fulfillment.d.ts:23

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](internal.ClaimOrder.md)

#### Defined in

medusa/dist/models/fulfillment.d.ts:10

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

medusa/dist/models/fulfillment.d.ts:9

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[created_at](internal.BaseEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/fulfillment.d.ts:21

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[id](internal.BaseEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

medusa/dist/models/fulfillment.d.ts:25

___

### items

• **items**: [`FulfillmentItem`](internal.FulfillmentItem.md)[]

#### Defined in

medusa/dist/models/fulfillment.d.ts:18

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/fulfillment.d.ts:24

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

medusa/dist/models/fulfillment.d.ts:15

___

### order

• **order**: [`Order`](internal.Order.md)

#### Defined in

medusa/dist/models/fulfillment.d.ts:14

___

### order\_id

• **order\_id**: `string`

#### Defined in

medusa/dist/models/fulfillment.d.ts:13

___

### provider

• **provider**: [`FulfillmentProvider`](internal.FulfillmentProvider.md)

#### Defined in

medusa/dist/models/fulfillment.d.ts:17

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

medusa/dist/models/fulfillment.d.ts:16

___

### shipped\_at

• **shipped\_at**: `Date`

#### Defined in

medusa/dist/models/fulfillment.d.ts:22

___

### swap

• **swap**: [`Swap`](internal.Swap.md)

#### Defined in

medusa/dist/models/fulfillment.d.ts:12

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

medusa/dist/models/fulfillment.d.ts:11

___

### tracking\_links

• **tracking\_links**: [`TrackingLink`](internal.TrackingLink.md)[]

#### Defined in

medusa/dist/models/fulfillment.d.ts:19

___

### tracking\_numbers

• **tracking\_numbers**: `string`[]

#### Defined in

medusa/dist/models/fulfillment.d.ts:20

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
