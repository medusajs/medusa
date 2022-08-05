---
displayed_sidebar: jsClientSidebar
---

# Class: DraftOrder

[internal](../modules/internal.md).DraftOrder

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`DraftOrder`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/draft-order.d.ts:20

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

medusa/dist/models/draft-order.d.ts:15

___

### cart

• **cart**: [`Cart`](internal.Cart.md)

#### Defined in

medusa/dist/models/draft-order.d.ts:12

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

medusa/dist/models/draft-order.d.ts:11

___

### completed\_at

• **completed\_at**: `Date`

#### Defined in

medusa/dist/models/draft-order.d.ts:16

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[created_at](internal.BaseEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### display\_id

• **display\_id**: `number`

#### Defined in

medusa/dist/models/draft-order.d.ts:10

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

medusa/dist/models/draft-order.d.ts:19

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/draft-order.d.ts:18

___

### no\_notification\_order

• **no\_notification\_order**: `boolean`

#### Defined in

medusa/dist/models/draft-order.d.ts:17

___

### order

• **order**: [`Order`](internal.Order.md)

#### Defined in

medusa/dist/models/draft-order.d.ts:14

___

### order\_id

• **order\_id**: `string`

#### Defined in

medusa/dist/models/draft-order.d.ts:13

___

### status

• **status**: [`DraftOrderStatus`](../enums/internal.DraftOrderStatus.md)

#### Defined in

medusa/dist/models/draft-order.d.ts:9

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
