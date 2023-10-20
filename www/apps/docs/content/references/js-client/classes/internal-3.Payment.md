---
displayed_sidebar: jsClientSidebar
---

# Class: Payment

[internal](../modules/internal-3.md).Payment

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`Payment`**

## Properties

### amount

• **amount**: `number`

#### Defined in

packages/medusa/dist/models/payment.d.ts:13

___

### amount\_refunded

• **amount\_refunded**: `number`

#### Defined in

packages/medusa/dist/models/payment.d.ts:16

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/payment.d.ts:23

___

### canceled\_at

• **canceled\_at**: `string` \| `Date`

#### Defined in

packages/medusa/dist/models/payment.d.ts:20

___

### captured\_at

• **captured\_at**: `string` \| `Date`

#### Defined in

packages/medusa/dist/models/payment.d.ts:19

___

### cart

• **cart**: [`Cart`](internal-3.Cart.md)

#### Defined in

packages/medusa/dist/models/payment.d.ts:10

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

packages/medusa/dist/models/payment.d.ts:9

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[created_at](internal-1.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### currency

• **currency**: [`Currency`](internal-3.Currency.md)

#### Defined in

packages/medusa/dist/models/payment.d.ts:15

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

packages/medusa/dist/models/payment.d.ts:14

___

### data

• **data**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/payment.d.ts:18

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

packages/medusa/dist/models/payment.d.ts:22

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/payment.d.ts:21

___

### order

• **order**: [`Order`](internal-3.Order.md)

#### Defined in

packages/medusa/dist/models/payment.d.ts:12

___

### order\_id

• **order\_id**: `string`

#### Defined in

packages/medusa/dist/models/payment.d.ts:11

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

packages/medusa/dist/models/payment.d.ts:17

___

### swap

• **swap**: [`Swap`](internal-3.Swap.md)

#### Defined in

packages/medusa/dist/models/payment.d.ts:8

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

packages/medusa/dist/models/payment.d.ts:7

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
