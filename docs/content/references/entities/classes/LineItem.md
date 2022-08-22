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

[models/line-item.ts:67](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L67)

___

### allow\_discounts

• **allow\_discounts**: `boolean`

#### Defined in

[models/line-item.ts:88](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L88)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/line-item.ts:35](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L35)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/line-item.ts:31](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L31)

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

#### Defined in

[models/line-item.ts:59](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L59)

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

[models/line-item.ts:55](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L55)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### description

• **description**: `string`

#### Defined in

[models/line-item.ts:73](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L73)

___

### discount\_total

• `Optional` **discount\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:125](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L125)

___

### fulfilled\_quantity

• **fulfilled\_quantity**: `number`

#### Defined in

[models/line-item.ts:108](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L108)

___

### gift\_card\_total

• `Optional` **gift\_card\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:126](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L126)

___

### has\_shipping

• **has\_shipping**: `boolean`

#### Defined in

[models/line-item.ts:91](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L91)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### is\_giftcard

• **is\_giftcard**: `boolean`

#### Defined in

[models/line-item.ts:82](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L82)

___

### is\_return

• **is\_return**: `boolean`

#### Defined in

[models/line-item.ts:79](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L79)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/line-item.ts:117](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L117)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/line-item.ts:43](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L43)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/line-item.ts:39](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L39)

___

### original\_tax\_total

• `Optional` **original\_tax\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:124](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L124)

___

### original\_total

• `Optional` **original\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:123](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L123)

___

### quantity

• **quantity**: `number`

#### Defined in

[models/line-item.ts:105](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L105)

___

### refundable

• `Optional` **refundable**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:119](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L119)

___

### returned\_quantity

• **returned\_quantity**: `number`

#### Defined in

[models/line-item.ts:111](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L111)

___

### shipped\_quantity

• **shipped\_quantity**: `number`

#### Defined in

[models/line-item.ts:114](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L114)

___

### should\_merge

• **should\_merge**: `boolean`

#### Defined in

[models/line-item.ts:85](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L85)

___

### subtotal

• `Optional` **subtotal**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:120](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L120)

___

### swap

• **swap**: [`Swap`](Swap.md)

#### Defined in

[models/line-item.ts:51](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L51)

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

[models/line-item.ts:47](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L47)

___

### tax\_lines

• **tax\_lines**: [`LineItemTaxLine`](LineItemTaxLine.md)[]

#### Defined in

[models/line-item.ts:62](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L62)

___

### tax\_total

• `Optional` **tax\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:121](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L121)

___

### thumbnail

• **thumbnail**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:76](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L76)

___

### title

• **title**: `string`

#### Defined in

[models/line-item.ts:70](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L70)

___

### total

• `Optional` **total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:122](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L122)

___

### unit\_price

• **unit\_price**: `number`

#### Defined in

[models/line-item.ts:94](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L94)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

• **variant**: [`ProductVariant`](ProductVariant.md)

#### Defined in

[models/line-item.ts:102](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L102)

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

[models/line-item.ts:98](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L98)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/line-item.ts:128](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/line-item.ts#L128)
