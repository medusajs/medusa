---
displayed_sidebar: jsClientSidebar
---

# Class: PaymentSession

[internal](../modules/internal-3.md).PaymentSession

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`PaymentSession`**

## Properties

### amount

• **amount**: `number`

#### Defined in

packages/medusa/dist/models/payment-session.d.ts:19

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/payment-session.d.ts:21

___

### cart

• **cart**: [`Cart`](internal-3.Cart.md)

#### Defined in

packages/medusa/dist/models/payment-session.d.ts:12

___

### cart\_id

• **cart\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/payment-session.d.ts:11

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

packages/medusa/dist/models/payment-session.d.ts:17

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

packages/medusa/dist/models/payment-session.d.ts:18

___

### is\_initiated

• **is\_initiated**: `boolean`

#### Defined in

packages/medusa/dist/models/payment-session.d.ts:15

___

### is\_selected

• **is\_selected**: ``null`` \| `boolean`

#### Defined in

packages/medusa/dist/models/payment-session.d.ts:14

___

### payment\_authorized\_at

• **payment\_authorized\_at**: `Date`

#### Defined in

packages/medusa/dist/models/payment-session.d.ts:20

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

packages/medusa/dist/models/payment-session.d.ts:13

___

### status

• **status**: `string`

#### Defined in

packages/medusa/dist/models/payment-session.d.ts:16

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
