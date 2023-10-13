---
displayed_sidebar: jsClientSidebar
---

# Class: LineItem

[internal](../modules/internal-3.md).LineItem

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`LineItem`**

## Properties

### adjustments

• **adjustments**: [`LineItemAdjustment`](internal-3.LineItemAdjustment.md)[]

#### Defined in

packages/medusa/dist/models/line-item.d.ts:20

___

### allow\_discounts

• **allow\_discounts**: `boolean`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:30

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:51

___

### cart

• **cart**: [`Cart`](internal-3.Cart.md)

#### Defined in

packages/medusa/dist/models/line-item.d.ts:12

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:11

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](internal-3.ClaimOrder.md)

#### Defined in

packages/medusa/dist/models/line-item.d.ts:18

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:17

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[created_at](internal-1.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### description

• **description**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:25

___

### discount\_total

• `Optional` **discount\_total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:48

___

### fulfilled\_quantity

• **fulfilled\_quantity**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:37

___

### gift\_card\_total

• `Optional` **gift\_card\_total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:50

___

### has\_shipping

• **has\_shipping**: ``null`` \| `boolean`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:31

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[id](internal-1.BaseEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### includes\_tax

• **includes\_tax**: `boolean`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:41

___

### is\_giftcard

• **is\_giftcard**: `boolean`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:28

___

### is\_return

• **is\_return**: `boolean`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:27

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/line-item.d.ts:40

___

### order

• **order**: [`Order`](internal-3.Order.md)

#### Defined in

packages/medusa/dist/models/line-item.d.ts:14

___

### order\_edit

• `Optional` **order\_edit**: ``null`` \| [`OrderEdit`](internal-3.OrderEdit.md)

#### Defined in

packages/medusa/dist/models/line-item.d.ts:23

___

### order\_edit\_id

• `Optional` **order\_edit\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:22

___

### order\_id

• **order\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:13

___

### original\_item\_id

• `Optional` **original\_item\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:21

___

### original\_tax\_total

• `Optional` **original\_tax\_total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:47

___

### original\_total

• `Optional` **original\_total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:46

___

### product\_id

• **product\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:35

___

### quantity

• **quantity**: `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:36

___

### raw\_discount\_total

• `Optional` **raw\_discount\_total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:49

___

### refundable

• `Optional` **refundable**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:42

___

### returned\_quantity

• **returned\_quantity**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:38

___

### shipped\_quantity

• **shipped\_quantity**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:39

___

### should\_merge

• **should\_merge**: `boolean`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:29

___

### subtotal

• `Optional` **subtotal**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:43

___

### swap

• **swap**: [`Swap`](internal-3.Swap.md)

#### Defined in

packages/medusa/dist/models/line-item.d.ts:16

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:15

___

### tax\_lines

• **tax\_lines**: [`LineItemTaxLine`](internal-3.LineItemTaxLine.md)[]

#### Defined in

packages/medusa/dist/models/line-item.d.ts:19

___

### tax\_total

• `Optional` **tax\_total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:44

___

### thumbnail

• **thumbnail**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:26

___

### title

• **title**: `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:24

___

### total

• `Optional` **total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:45

___

### unit\_price

• **unit\_price**: `number`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:32

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7

___

### variant

• **variant**: [`ProductVariant`](internal-3.ProductVariant.md)

#### Defined in

packages/medusa/dist/models/line-item.d.ts:34

___

### variant\_id

• **variant\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:33

## Methods

### afterUpdateOrLoad

▸ **afterUpdateOrLoad**(): `void`

#### Returns

`void`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:53

___

### beforeUpdate

▸ **beforeUpdate**(): `void`

#### Returns

`void`

#### Defined in

packages/medusa/dist/models/line-item.d.ts:52
