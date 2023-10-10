---
displayed_sidebar: jsClientSidebar
---

# Class: Fulfillment

[internal](../modules/internal-3.md).Fulfillment

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`Fulfillment`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:27

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:24

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](internal-3.ClaimOrder.md)

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:10

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:9

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[created_at](internal-1.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### data

• **data**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:22

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[id](internal-1.BaseEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:26

___

### items

• **items**: [`FulfillmentItem`](internal-3.FulfillmentItem.md)[]

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:19

___

### location\_id

• **location\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:17

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:25

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:15

___

### order

• **order**: [`Order`](internal-3.Order.md)

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:14

___

### order\_id

• **order\_id**: `string`

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:13

___

### provider

• **provider**: [`FulfillmentProvider`](internal-3.FulfillmentProvider.md)

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:18

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:16

___

### shipped\_at

• **shipped\_at**: `Date`

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:23

___

### swap

• **swap**: [`Swap`](internal-3.Swap.md)

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:12

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:11

___

### tracking\_links

• **tracking\_links**: [`TrackingLink`](internal-3.TrackingLink.md)[]

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:20

___

### tracking\_numbers

• **tracking\_numbers**: `string`[]

#### Defined in

packages/medusa/dist/models/fulfillment.d.ts:21

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
