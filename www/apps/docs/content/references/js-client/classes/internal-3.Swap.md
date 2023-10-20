---
displayed_sidebar: jsClientSidebar
---

# Class: Swap

[internal](../modules/internal-3.md).Swap

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`Swap`**

## Properties

### additional\_items

• **additional\_items**: [`LineItem`](internal-3.LineItem.md)[]

#### Defined in

packages/medusa/dist/models/swap.d.ts:34

___

### allow\_backorder

• **allow\_backorder**: `boolean`

#### Defined in

packages/medusa/dist/models/swap.d.ts:47

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/swap.d.ts:50

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

packages/medusa/dist/models/swap.d.ts:45

___

### cart

• **cart**: [`Cart`](internal-3.Cart.md)

#### Defined in

packages/medusa/dist/models/swap.d.ts:43

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

packages/medusa/dist/models/swap.d.ts:42

___

### confirmed\_at

• **confirmed\_at**: `Date`

#### Defined in

packages/medusa/dist/models/swap.d.ts:44

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[created_at](internal-1.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[deleted_at](internal-1.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### difference\_due

• **difference\_due**: `number`

#### Defined in

packages/medusa/dist/models/swap.d.ts:38

___

### fulfillment\_status

• **fulfillment\_status**: [`SwapFulfillmentStatus`](../enums/internal-3.SwapFulfillmentStatus.md)

#### Defined in

packages/medusa/dist/models/swap.d.ts:30

___

### fulfillments

• **fulfillments**: [`Fulfillment`](internal-3.Fulfillment.md)[]

#### Defined in

packages/medusa/dist/models/swap.d.ts:36

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

packages/medusa/dist/models/swap.d.ts:48

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/swap.d.ts:49

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/models/swap.d.ts:46

___

### order

• **order**: [`Order`](internal-3.Order.md)

#### Defined in

packages/medusa/dist/models/swap.d.ts:33

___

### order\_id

• **order\_id**: `string`

#### Defined in

packages/medusa/dist/models/swap.d.ts:32

___

### payment

• **payment**: [`Payment`](internal-3.Payment.md)

#### Defined in

packages/medusa/dist/models/swap.d.ts:37

___

### payment\_status

• **payment\_status**: [`SwapPaymentStatus`](../enums/internal-3.SwapPaymentStatus.md)

#### Defined in

packages/medusa/dist/models/swap.d.ts:31

___

### return\_order

• **return\_order**: [`Return`](internal-3.Return.md)

#### Defined in

packages/medusa/dist/models/swap.d.ts:35

___

### shipping\_address

• **shipping\_address**: [`Address`](internal-3.Address.md)

#### Defined in

packages/medusa/dist/models/swap.d.ts:40

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

packages/medusa/dist/models/swap.d.ts:39

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](internal-3.ShippingMethod.md)[]

#### Defined in

packages/medusa/dist/models/swap.d.ts:41

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
