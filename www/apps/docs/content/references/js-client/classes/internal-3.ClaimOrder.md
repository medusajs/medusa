---
displayed_sidebar: jsClientSidebar
---

# Class: ClaimOrder

[internal](../modules/internal-3.md).ClaimOrder

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`ClaimOrder`**

## Properties

### additional\_items

• **additional\_items**: [`LineItem`](internal-3.LineItem.md)[]

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:33

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:50

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:43

___

### claim\_items

• **claim\_items**: [`ClaimItem`](internal-3.ClaimItem.md)[]

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:32

___

### created\_at

• **created\_at**: `Date`

#### Overrides

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[created_at](internal-1.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:44

___

### deleted\_at

• **deleted\_at**: `Date`

#### Overrides

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[deleted_at](internal-1.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:46

___

### fulfillment\_status

• **fulfillment\_status**: [`ClaimFulfillmentStatus`](../enums/internal-3.ClaimFulfillmentStatus.md)

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:31

___

### fulfillments

• **fulfillments**: [`Fulfillment`](internal-3.Fulfillment.md)[]

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:41

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

packages/medusa/dist/models/claim-order.d.ts:49

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:48

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:47

___

### order

• **order**: [`Order`](internal-3.Order.md)

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:36

___

### order\_id

• **order\_id**: `string`

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:35

___

### payment\_status

• **payment\_status**: [`ClaimPaymentStatus`](../enums/internal-3.ClaimPaymentStatus.md)

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:30

___

### refund\_amount

• **refund\_amount**: `number`

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:42

___

### return\_order

• **return\_order**: [`Return`](internal-3.Return.md)

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:37

___

### shipping\_address

• **shipping\_address**: [`Address`](internal-3.Address.md)

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:39

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:38

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](internal-3.ShippingMethod.md)[]

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:40

___

### type

• **type**: [`ClaimType`](../enums/internal-3.ClaimType.md)

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:34

___

### updated\_at

• **updated\_at**: `Date`

#### Overrides

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/models/claim-order.d.ts:45
