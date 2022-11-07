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

medusa/dist/models/payment-collection.d.ts:22

___

### authorized\_amount

• **authorized\_amount**: `number`

#### Defined in

medusa/dist/models/payment-collection.d.ts:23

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/payment-collection.d.ts:34

___

### captured\_amount

• **captured\_amount**: `number`

#### Defined in

medusa/dist/models/payment-collection.d.ts:24

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

medusa/dist/models/payment-collection.d.ts:33

___

### currency

• **currency**: [`Currency`](internal.Currency.md)

#### Defined in

medusa/dist/models/payment-collection.d.ts:29

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

medusa/dist/models/payment-collection.d.ts:28

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### description

• **description**: `string`

#### Defined in

medusa/dist/models/payment-collection.d.ts:21

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

medusa/dist/models/payment-collection.d.ts:32

___

### payment\_sessions

• **payment\_sessions**: [`PaymentSession`](internal.PaymentSession.md)[]

#### Defined in

medusa/dist/models/payment-collection.d.ts:30

___

### payments

• **payments**: [`Payment`](internal.Payment.md)[]

#### Defined in

medusa/dist/models/payment-collection.d.ts:31

___

### refunded\_amount

• **refunded\_amount**: `number`

#### Defined in

medusa/dist/models/payment-collection.d.ts:25

___

### region

• **region**: [`Region`](internal.Region.md)

#### Defined in

medusa/dist/models/payment-collection.d.ts:27

___

### region\_id

• **region\_id**: `string`

#### Defined in

medusa/dist/models/payment-collection.d.ts:26

___

### status

• **status**: [`PaymentCollectionStatus`](../enums/internal.PaymentCollectionStatus.md)

#### Defined in

medusa/dist/models/payment-collection.d.ts:20

___

### type

• **type**: [`ORDER_EDIT`](../modules/internal.md#order_edit)

#### Defined in

medusa/dist/models/payment-collection.d.ts:19

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
