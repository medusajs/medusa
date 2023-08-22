---
displayed_sidebar: jsClientSidebar
---

# Class: PaymentCollection

[internal](../modules/internal.md).PaymentCollection

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`PaymentCollection`**

## Properties

### amount

• **amount**: `number`

#### Defined in

medusa/dist/models/payment-collection.d.ts:17

___

### authorized\_amount

• **authorized\_amount**: ``null`` \| `number`

#### Defined in

medusa/dist/models/payment-collection.d.ts:18

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/payment-collection.d.ts:27

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### created\_by

• **created\_by**: `string`

#### Defined in

medusa/dist/models/payment-collection.d.ts:26

___

### currency

• **currency**: [`Currency`](internal.Currency.md)

#### Defined in

medusa/dist/models/payment-collection.d.ts:22

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

medusa/dist/models/payment-collection.d.ts:21

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### description

• **description**: ``null`` \| `string`

#### Defined in

medusa/dist/models/payment-collection.d.ts:16

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/payment-collection.d.ts:25

___

### payment\_sessions

• **payment\_sessions**: [`PaymentSession`](internal.PaymentSession.md)[]

#### Defined in

medusa/dist/models/payment-collection.d.ts:23

___

### payments

• **payments**: [`Payment`](internal.Payment.md)[]

#### Defined in

medusa/dist/models/payment-collection.d.ts:24

___

### region

• **region**: [`Region`](internal.Region.md)

#### Defined in

medusa/dist/models/payment-collection.d.ts:20

___

### region\_id

• **region\_id**: `string`

#### Defined in

medusa/dist/models/payment-collection.d.ts:19

___

### status

• **status**: [`PaymentCollectionStatus`](../enums/internal.PaymentCollectionStatus.md)

#### Defined in

medusa/dist/models/payment-collection.d.ts:15

___

### type

• **type**: [`ORDER_EDIT`](../modules/internal.md#order_edit)

#### Defined in

medusa/dist/models/payment-collection.d.ts:14

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
