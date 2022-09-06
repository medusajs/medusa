---
displayed_sidebar: jsClientSidebar
---

# Class: ClaimOrder

[internal](../modules/internal.md).ClaimOrder

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`ClaimOrder`**

## Properties

### additional\_items

• **additional\_items**: [`LineItem`](internal.LineItem.md)[]

#### Defined in

medusa/dist/models/claim-order.d.ts:33

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/claim-order.d.ts:50

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

medusa/dist/models/claim-order.d.ts:43

___

### claim\_items

• **claim\_items**: [`ClaimItem`](internal.ClaimItem.md)[]

#### Defined in

medusa/dist/models/claim-order.d.ts:32

___

### created\_at

• **created\_at**: `Date`

#### Overrides

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/models/claim-order.d.ts:44

___

### deleted\_at

• **deleted\_at**: `Date`

#### Overrides

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/models/claim-order.d.ts:46

___

### fulfillment\_status

• **fulfillment\_status**: [`ClaimFulfillmentStatus`](../enums/internal.ClaimFulfillmentStatus.md)

#### Defined in

medusa/dist/models/claim-order.d.ts:31

___

### fulfillments

• **fulfillments**: [`Fulfillment`](internal.Fulfillment.md)[]

#### Defined in

medusa/dist/models/claim-order.d.ts:41

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

medusa/dist/models/claim-order.d.ts:49

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/claim-order.d.ts:48

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

medusa/dist/models/claim-order.d.ts:47

___

### order

• **order**: [`Order`](internal.Order.md)

#### Defined in

medusa/dist/models/claim-order.d.ts:36

___

### order\_id

• **order\_id**: `string`

#### Defined in

medusa/dist/models/claim-order.d.ts:35

___

### payment\_status

• **payment\_status**: [`ClaimPaymentStatus`](../enums/internal.ClaimPaymentStatus.md)

#### Defined in

medusa/dist/models/claim-order.d.ts:30

___

### refund\_amount

• **refund\_amount**: `number`

#### Defined in

medusa/dist/models/claim-order.d.ts:42

___

### return\_order

• **return\_order**: [`Return`](internal.Return.md)

#### Defined in

medusa/dist/models/claim-order.d.ts:37

___

### shipping\_address

• **shipping\_address**: [`Address`](internal.Address.md)

#### Defined in

medusa/dist/models/claim-order.d.ts:39

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

medusa/dist/models/claim-order.d.ts:38

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](internal.ShippingMethod.md)[]

#### Defined in

medusa/dist/models/claim-order.d.ts:40

___

### type

• **type**: [`ClaimType`](../enums/internal.ClaimType.md)

#### Defined in

medusa/dist/models/claim-order.d.ts:34

___

### updated\_at

• **updated\_at**: `Date`

#### Overrides

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/models/claim-order.d.ts:45
