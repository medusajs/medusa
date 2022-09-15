---
displayed_sidebar: entitiesSidebar
---

# Class: LineItem

## Hierarchy

- `BaseEntity`

  ↳ **`LineItem`**

## Constructors

### constructor

• **new LineItem**()

#### Inherited from

BaseEntity.constructor

## Properties

### adjustments

• **adjustments**: [`LineItemAdjustment`](LineItemAdjustment.md)[]

#### Defined in

[models/line-item.ts:69](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L69)

___

### allow\_discounts

• **allow\_discounts**: `boolean`

#### Defined in

[models/line-item.ts:90](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L90)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/line-item.ts:37](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L37)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/line-item.ts:33](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L33)

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

#### Defined in

[models/line-item.ts:61](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L61)

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

[models/line-item.ts:57](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L57)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### description

• **description**: `string`

#### Defined in

[models/line-item.ts:75](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L75)

___

### discount\_total

• `Optional` **discount\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:130](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L130)

___

### fulfilled\_quantity

• **fulfilled\_quantity**: `number`

#### Defined in

[models/line-item.ts:110](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L110)

___

### gift\_card\_total

• `Optional` **gift\_card\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:131](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L131)

___

### has\_shipping

• **has\_shipping**: `boolean`

#### Defined in

[models/line-item.ts:93](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L93)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### includes\_tax

• **includes\_tax**: `boolean`

#### Defined in

[models/line-item.ts:122](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L122)

___

### is\_giftcard

• **is\_giftcard**: `boolean`

#### Defined in

[models/line-item.ts:84](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L84)

___

### is\_return

• **is\_return**: `boolean`

#### Defined in

[models/line-item.ts:81](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L81)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/line-item.ts:119](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L119)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/line-item.ts:45](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L45)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/line-item.ts:41](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L41)

___

### original\_tax\_total

• `Optional` **original\_tax\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:129](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L129)

___

### original\_total

• `Optional` **original\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:128](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L128)

___

### quantity

• **quantity**: `number`

#### Defined in

[models/line-item.ts:107](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L107)

___

### refundable

• `Optional` **refundable**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:124](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L124)

___

### returned\_quantity

• **returned\_quantity**: `number`

#### Defined in

[models/line-item.ts:113](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L113)

___

### shipped\_quantity

• **shipped\_quantity**: `number`

#### Defined in

[models/line-item.ts:116](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L116)

___

### should\_merge

• **should\_merge**: `boolean`

#### Defined in

[models/line-item.ts:87](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L87)

___

### subtotal

• `Optional` **subtotal**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:125](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L125)

___

### swap

• **swap**: [`Swap`](Swap.md)

#### Defined in

[models/line-item.ts:53](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L53)

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

[models/line-item.ts:49](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L49)

___

### tax\_lines

• **tax\_lines**: [`LineItemTaxLine`](LineItemTaxLine.md)[]

#### Defined in

[models/line-item.ts:64](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L64)

___

### tax\_total

• `Optional` **tax\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:126](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L126)

___

### thumbnail

• **thumbnail**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:78](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L78)

___

### title

• **title**: `string`

#### Defined in

[models/line-item.ts:72](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L72)

___

### total

• `Optional` **total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:127](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L127)

___

### unit\_price

• **unit\_price**: `number`

#### Defined in

[models/line-item.ts:96](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L96)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

• **variant**: [`ProductVariant`](ProductVariant.md)

#### Defined in

[models/line-item.ts:104](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L104)

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

[models/line-item.ts:100](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L100)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/line-item.ts:133](https://github.com/medusajs/medusa/blob/7c6521101/packages/medusa/src/models/line-item.ts#L133)
