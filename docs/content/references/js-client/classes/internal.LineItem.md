---
displayed_sidebar: jsClientSidebar
---

# Class: LineItem

[internal](../modules/internal.md).LineItem

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`LineItem`**

## Properties

### adjustments

• **adjustments**: [`LineItemAdjustment`](internal.LineItemAdjustment.md)[]

#### Defined in

medusa/dist/models/line-item.d.ts:19

___

### allow\_discounts

• **allow\_discounts**: `boolean`

#### Defined in

medusa/dist/models/line-item.d.ts:26

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/line-item.d.ts:44

___

### cart

• **cart**: [`Cart`](internal.Cart.md)

#### Defined in

medusa/dist/models/line-item.d.ts:11

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

medusa/dist/models/line-item.d.ts:10

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](internal.ClaimOrder.md)

#### Defined in

medusa/dist/models/line-item.d.ts:17

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

medusa/dist/models/line-item.d.ts:16

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[created_at](internal.BaseEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### description

• **description**: `string`

#### Defined in

medusa/dist/models/line-item.d.ts:21

___

### discount\_total

• `Optional` **discount\_total**: ``null`` \| `number`

#### Defined in

medusa/dist/models/line-item.d.ts:42

___

### fulfilled\_quantity

• **fulfilled\_quantity**: `number`

#### Defined in

medusa/dist/models/line-item.d.ts:32

___

### gift\_card\_total

• `Optional` **gift\_card\_total**: ``null`` \| `number`

#### Defined in

medusa/dist/models/line-item.d.ts:43

___

### has\_shipping

• **has\_shipping**: `boolean`

#### Defined in

medusa/dist/models/line-item.d.ts:27

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[id](internal.BaseEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### is\_giftcard

• **is\_giftcard**: `boolean`

#### Defined in

medusa/dist/models/line-item.d.ts:24

___

### is\_return

• **is\_return**: `boolean`

#### Defined in

medusa/dist/models/line-item.d.ts:23

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/line-item.d.ts:35

___

### order

• **order**: [`Order`](internal.Order.md)

#### Defined in

medusa/dist/models/line-item.d.ts:13

___

### order\_id

• **order\_id**: `string`

#### Defined in

medusa/dist/models/line-item.d.ts:12

___

### original\_tax\_total

• `Optional` **original\_tax\_total**: ``null`` \| `number`

#### Defined in

medusa/dist/models/line-item.d.ts:41

___

### original\_total

• `Optional` **original\_total**: ``null`` \| `number`

#### Defined in

medusa/dist/models/line-item.d.ts:40

___

### quantity

• **quantity**: `number`

#### Defined in

medusa/dist/models/line-item.d.ts:31

___

### refundable

• `Optional` **refundable**: ``null`` \| `number`

#### Defined in

medusa/dist/models/line-item.d.ts:36

___

### returned\_quantity

• **returned\_quantity**: `number`

#### Defined in

medusa/dist/models/line-item.d.ts:33

___

### shipped\_quantity

• **shipped\_quantity**: `number`

#### Defined in

medusa/dist/models/line-item.d.ts:34

___

### should\_merge

• **should\_merge**: `boolean`

#### Defined in

medusa/dist/models/line-item.d.ts:25

___

### subtotal

• `Optional` **subtotal**: ``null`` \| `number`

#### Defined in

medusa/dist/models/line-item.d.ts:37

___

### swap

• **swap**: [`Swap`](internal.Swap.md)

#### Defined in

medusa/dist/models/line-item.d.ts:15

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

medusa/dist/models/line-item.d.ts:14

___

### tax\_lines

• **tax\_lines**: [`LineItemTaxLine`](internal.LineItemTaxLine.md)[]

#### Defined in

medusa/dist/models/line-item.d.ts:18

___

### tax\_total

• `Optional` **tax\_total**: ``null`` \| `number`

#### Defined in

medusa/dist/models/line-item.d.ts:38

___

### thumbnail

• **thumbnail**: ``null`` \| `string`

#### Defined in

medusa/dist/models/line-item.d.ts:22

___

### title

• **title**: `string`

#### Defined in

medusa/dist/models/line-item.d.ts:20

___

### total

• `Optional` **total**: ``null`` \| `number`

#### Defined in

medusa/dist/models/line-item.d.ts:39

___

### unit\_price

• **unit\_price**: `number`

#### Defined in

medusa/dist/models/line-item.d.ts:28

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7

___

### variant

• **variant**: [`ProductVariant`](internal.ProductVariant.md)

#### Defined in

medusa/dist/models/line-item.d.ts:30

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

medusa/dist/models/line-item.d.ts:29
