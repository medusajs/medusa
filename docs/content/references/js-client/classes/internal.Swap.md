---
displayed_sidebar: jsClientSidebar
---

# Class: Swap

[internal](../modules/internal.md).Swap

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`Swap`**

## Properties

### additional\_items

• **additional\_items**: [`LineItem`](internal.LineItem.md)[]

#### Defined in

medusa/dist/models/swap.d.ts:34

___

### allow\_backorder

• **allow\_backorder**: `boolean`

#### Defined in

medusa/dist/models/swap.d.ts:47

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/swap.d.ts:50

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

medusa/dist/models/swap.d.ts:45

___

### cart

• **cart**: [`Cart`](internal.Cart.md)

#### Defined in

medusa/dist/models/swap.d.ts:43

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

medusa/dist/models/swap.d.ts:42

___

### confirmed\_at

• **confirmed\_at**: `Date`

#### Defined in

medusa/dist/models/swap.d.ts:44

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### difference\_due

• **difference\_due**: `number`

#### Defined in

medusa/dist/models/swap.d.ts:38

___

### fulfillment\_status

• **fulfillment\_status**: [`SwapFulfillmentStatus`](../enums/internal.SwapFulfillmentStatus.md)

#### Defined in

medusa/dist/models/swap.d.ts:30

___

### fulfillments

• **fulfillments**: [`Fulfillment`](internal.Fulfillment.md)[]

#### Defined in

medusa/dist/models/swap.d.ts:36

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

medusa/dist/models/swap.d.ts:48

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/swap.d.ts:49

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

medusa/dist/models/swap.d.ts:46

___

### order

• **order**: [`Order`](internal.Order.md)

#### Defined in

medusa/dist/models/swap.d.ts:33

___

### order\_id

• **order\_id**: `string`

#### Defined in

medusa/dist/models/swap.d.ts:32

___

### payment

• **payment**: [`Payment`](internal.Payment.md)

#### Defined in

medusa/dist/models/swap.d.ts:37

___

### payment\_status

• **payment\_status**: [`SwapPaymentStatus`](../enums/internal.SwapPaymentStatus.md)

#### Defined in

medusa/dist/models/swap.d.ts:31

___

### return\_order

• **return\_order**: [`Return`](internal.Return.md)

#### Defined in

medusa/dist/models/swap.d.ts:35

___

### shipping\_address

• **shipping\_address**: [`Address`](internal.Address.md)

#### Defined in

medusa/dist/models/swap.d.ts:40

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

medusa/dist/models/swap.d.ts:39

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](internal.ShippingMethod.md)[]

#### Defined in

medusa/dist/models/swap.d.ts:41

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
