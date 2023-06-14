---
displayed_sidebar: jsClientSidebar
---

# Class: PaymentSession

[internal](../modules/internal.md).PaymentSession

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`PaymentSession`**

## Properties

### amount

• **amount**: `number`

#### Defined in

medusa/dist/models/payment-session.d.ts:18

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/payment-session.d.ts:20

___

### cart

• **cart**: [`Cart`](internal.Cart.md)

#### Defined in

medusa/dist/models/payment-session.d.ts:12

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

medusa/dist/models/payment-session.d.ts:11

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

medusa/dist/models/payment-session.d.ts:16

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

medusa/dist/models/payment-session.d.ts:17

___

### is\_selected

• **is\_selected**: ``null`` \| `boolean`

#### Defined in

medusa/dist/models/payment-session.d.ts:14

___

### payment\_authorized\_at

• **payment\_authorized\_at**: `Date`

#### Defined in

medusa/dist/models/payment-session.d.ts:19

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

medusa/dist/models/payment-session.d.ts:13

___

### status

• **status**: `string`

#### Defined in

medusa/dist/models/payment-session.d.ts:15

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
