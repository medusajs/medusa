---
displayed_sidebar: jsClientSidebar
---

# Class: LineItem

[internal](../modules/internal.md).LineItem

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`LineItem`**

## Properties

### adjustments

• **adjustments**: [`LineItemAdjustment`](internal.LineItemAdjustment.md)[]

#### Defined in

packages/medusa/dist/models/line-item.d.ts:19

___

### allow\_discounts

• **allow\_discounts**: `boolean`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:26

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:37

___

### cart

• **cart**: [`Cart`](internal.Cart.md)

#### Defined in

packages/medusa/dist/models/line-item.d.ts:11

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:10

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](internal.ClaimOrder.md)

#### Defined in

packages/medusa/dist/models/line-item.d.ts:17

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:16

___

### created\_at

• **created\_at**: [`Date`](../modules/internal.md#date)

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[created_at](internal.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### description

• **description**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:21

___

### fulfilled\_quantity

• **fulfilled\_quantity**: `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:32

___

### has\_shipping

• **has\_shipping**: `boolean`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:27

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[id](internal.BaseEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### is\_giftcard

• **is\_giftcard**: `boolean`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:24

___

### is\_return

• **is\_return**: `boolean`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:23

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/line-item.d.ts:35

___

### order

• **order**: [`Order`](internal.Order.md)

#### Defined in

packages/medusa/dist/models/line-item.d.ts:13

___

### order\_id

• **order\_id**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:12

___

### quantity

• **quantity**: `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:31

___

### refundable

• **refundable**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:36

___

### returned\_quantity

• **returned\_quantity**: `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:33

___

### shipped\_quantity

• **shipped\_quantity**: `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:34

___

### should\_merge

• **should\_merge**: `boolean`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:25

___

### swap

• **swap**: [`Swap`](internal.Swap.md)

#### Defined in

packages/medusa/dist/models/line-item.d.ts:15

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:14

___

### tax\_lines

• **tax\_lines**: [`LineItemTaxLine`](internal.LineItemTaxLine.md)[]

#### Defined in

packages/medusa/dist/models/line-item.d.ts:18

___

### thumbnail

• **thumbnail**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:22

___

### title

• **title**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:20

___

### unit\_price

• **unit\_price**: `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:28

___

### updated\_at

• **updated\_at**: [`Date`](../modules/internal.md#date)

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7

___

### variant

• **variant**: [`ProductVariant`](internal.ProductVariant.md)

#### Defined in

packages/medusa/dist/models/line-item.d.ts:30

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:29
