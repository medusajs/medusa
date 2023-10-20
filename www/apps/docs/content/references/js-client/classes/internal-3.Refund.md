---
displayed_sidebar: jsClientSidebar
---

# Class: Refund

[internal](../modules/internal-3.md).Refund

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`Refund`**

## Properties

### amount

• **amount**: `number`

#### Defined in

packages/medusa/dist/models/refund.d.ts:16

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/refund.d.ts:21

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

• **idempotency\_key**: `string`

#### Defined in

packages/medusa/dist/models/refund.d.ts:20

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/refund.d.ts:19

___

### note

• **note**: `string`

#### Defined in

packages/medusa/dist/models/refund.d.ts:17

___

### order

• **order**: [`Order`](internal-3.Order.md)

#### Defined in

packages/medusa/dist/models/refund.d.ts:14

___

### order\_id

• **order\_id**: `string`

#### Defined in

packages/medusa/dist/models/refund.d.ts:12

___

### payment

• **payment**: [`Payment`](internal-3.Payment.md)

#### Defined in

packages/medusa/dist/models/refund.d.ts:15

___

### payment\_id

• **payment\_id**: `string`

#### Defined in

packages/medusa/dist/models/refund.d.ts:13

___

### reason

• **reason**: `string`

#### Defined in

packages/medusa/dist/models/refund.d.ts:18

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
