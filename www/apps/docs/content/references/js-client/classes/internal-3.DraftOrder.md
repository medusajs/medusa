---
displayed_sidebar: jsClientSidebar
---

# Class: DraftOrder

[internal](../modules/internal-3.md).DraftOrder

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`DraftOrder`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/draft-order.d.ts:20

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

packages/medusa/dist/models/draft-order.d.ts:15

___

### cart

• **cart**: [`Cart`](internal-3.Cart.md)

#### Defined in

packages/medusa/dist/models/draft-order.d.ts:12

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

packages/medusa/dist/models/draft-order.d.ts:11

___

### completed\_at

• **completed\_at**: `Date`

#### Defined in

packages/medusa/dist/models/draft-order.d.ts:16

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[created_at](internal-1.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### display\_id

• **display\_id**: `number`

#### Defined in

packages/medusa/dist/models/draft-order.d.ts:10

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

packages/medusa/dist/models/draft-order.d.ts:19

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/draft-order.d.ts:18

___

### no\_notification\_order

• **no\_notification\_order**: `boolean`

#### Defined in

packages/medusa/dist/models/draft-order.d.ts:17

___

### order

• **order**: [`Order`](internal-3.Order.md)

#### Defined in

packages/medusa/dist/models/draft-order.d.ts:14

___

### order\_id

• **order\_id**: `string`

#### Defined in

packages/medusa/dist/models/draft-order.d.ts:13

___

### status

• **status**: [`DraftOrderStatus`](../enums/internal-3.DraftOrderStatus.md)

#### Defined in

packages/medusa/dist/models/draft-order.d.ts:9

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
