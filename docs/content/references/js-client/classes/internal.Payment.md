---
displayed_sidebar: jsClientSidebar
---

# Class: Payment

[internal](../modules/internal.md).Payment

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`Payment`**

## Properties

### amount

• **amount**: `number`

#### Defined in

medusa/dist/models/payment.d.ts:13

___

### amount\_refunded

• **amount\_refunded**: `number`

#### Defined in

medusa/dist/models/payment.d.ts:16

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/payment.d.ts:23

___

### canceled\_at

• **canceled\_at**: `string` \| `Date`

#### Defined in

medusa/dist/models/payment.d.ts:20

___

### captured\_at

• **captured\_at**: `string` \| `Date`

#### Defined in

medusa/dist/models/payment.d.ts:19

___

### cart

• **cart**: [`Cart`](internal.Cart.md)

#### Defined in

medusa/dist/models/payment.d.ts:10

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

medusa/dist/models/payment.d.ts:9

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[created_at](internal.BaseEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### currency

• **currency**: [`Currency`](internal.Currency.md)

#### Defined in

medusa/dist/models/payment.d.ts:15

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

medusa/dist/models/payment.d.ts:14

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/payment.d.ts:18

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

medusa/dist/models/payment.d.ts:22

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/payment.d.ts:21

___

### order

• **order**: [`Order`](internal.Order.md)

#### Defined in

medusa/dist/models/payment.d.ts:12

___

### order\_id

• **order\_id**: `string`

#### Defined in

medusa/dist/models/payment.d.ts:11

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

medusa/dist/models/payment.d.ts:17

___

### swap

• **swap**: [`Swap`](internal.Swap.md)

#### Defined in

medusa/dist/models/payment.d.ts:8

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

medusa/dist/models/payment.d.ts:7

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
