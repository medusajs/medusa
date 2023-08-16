---
displayed_sidebar: jsClientSidebar
---

# Class: Refund

[internal](../modules/internal.md).Refund

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`Refund`**

## Properties

### amount

• **amount**: `number`

#### Defined in

medusa/dist/models/refund.d.ts:16

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/refund.d.ts:21

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

medusa/dist/models/refund.d.ts:20

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/refund.d.ts:19

___

### note

• **note**: `string`

#### Defined in

medusa/dist/models/refund.d.ts:17

___

### order

• **order**: [`Order`](internal.Order.md)

#### Defined in

medusa/dist/models/refund.d.ts:14

___

### order\_id

• **order\_id**: `string`

#### Defined in

medusa/dist/models/refund.d.ts:12

___

### payment

• **payment**: [`Payment`](internal.Payment.md)

#### Defined in

medusa/dist/models/refund.d.ts:15

___

### payment\_id

• **payment\_id**: `string`

#### Defined in

medusa/dist/models/refund.d.ts:13

___

### reason

• **reason**: `string`

#### Defined in

medusa/dist/models/refund.d.ts:18

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
