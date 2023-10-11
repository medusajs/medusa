---
displayed_sidebar: jsClientSidebar
---

# Class: Return

[internal](../modules/internal-3.md).Return

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`Return`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/return.d.ts:30

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](internal-3.ClaimOrder.md)

#### Defined in

packages/medusa/dist/models/return.d.ts:19

___

### claim\_order\_id

• **claim\_order\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/return.d.ts:18

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[created_at](internal-1.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[id](internal-1.BaseEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### idempotency\_key

• **idempotency\_key**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/return.d.ts:29

___

### items

• **items**: [`ReturnItem`](internal-3.ReturnItem.md)[]

#### Defined in

packages/medusa/dist/models/return.d.ts:15

___

### location\_id

• **location\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/return.d.ts:23

___

### metadata

• **metadata**: ``null`` \| [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/return.d.ts:28

___

### no\_notification

• **no\_notification**: ``null`` \| `boolean`

#### Defined in

packages/medusa/dist/models/return.d.ts:27

___

### order

• **order**: [`Order`](internal-3.Order.md)

#### Defined in

packages/medusa/dist/models/return.d.ts:21

___

### order\_id

• **order\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/return.d.ts:20

___

### received\_at

• **received\_at**: `Date`

#### Defined in

packages/medusa/dist/models/return.d.ts:26

___

### refund\_amount

• **refund\_amount**: `number`

#### Defined in

packages/medusa/dist/models/return.d.ts:25

___

### shipping\_data

• **shipping\_data**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/return.d.ts:24

___

### shipping\_method

• **shipping\_method**: [`ShippingMethod`](internal-3.ShippingMethod.md)

#### Defined in

packages/medusa/dist/models/return.d.ts:22

___

### status

• **status**: [`ReturnStatus`](../enums/internal-3.ReturnStatus.md)

#### Defined in

packages/medusa/dist/models/return.d.ts:14

___

### swap

• **swap**: [`Swap`](internal-3.Swap.md)

#### Defined in

packages/medusa/dist/models/return.d.ts:17

___

### swap\_id

• **swap\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/return.d.ts:16

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
