---
displayed_sidebar: jsClientSidebar
---

# Class: Return

[internal](../modules/internal.md).Return

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`Return`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/return.d.ts:29

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](internal.ClaimOrder.md)

#### Defined in

medusa/dist/models/return.d.ts:19

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

medusa/dist/models/return.d.ts:18

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[created_at](internal.BaseEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

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

medusa/dist/models/return.d.ts:28

___

### items

• **items**: [`ReturnItem`](internal.ReturnItem.md)[]

#### Defined in

medusa/dist/models/return.d.ts:15

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/return.d.ts:27

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

medusa/dist/models/return.d.ts:26

___

### order

• **order**: [`Order`](internal.Order.md)

#### Defined in

medusa/dist/models/return.d.ts:21

___

### order\_id

• **order\_id**: `string`

#### Defined in

medusa/dist/models/return.d.ts:20

___

### received\_at

• **received\_at**: `Date`

#### Defined in

medusa/dist/models/return.d.ts:25

___

### refund\_amount

• **refund\_amount**: `number`

#### Defined in

medusa/dist/models/return.d.ts:24

___

### shipping\_data

• **shipping\_data**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/return.d.ts:23

___

### shipping\_method

• **shipping\_method**: [`ShippingMethod`](internal.ShippingMethod.md)

#### Defined in

medusa/dist/models/return.d.ts:22

___

### status

• **status**: [`ReturnStatus`](../enums/internal.ReturnStatus.md)

#### Defined in

medusa/dist/models/return.d.ts:14

___

### swap

• **swap**: [`Swap`](internal.Swap.md)

#### Defined in

medusa/dist/models/return.d.ts:17

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

medusa/dist/models/return.d.ts:16

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
