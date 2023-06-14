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

[models/line-item.ts:85](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L85)

___

### allow\_discounts

• **allow\_discounts**: `boolean`

#### Defined in

[models/line-item.ts:127](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L127)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/line-item.ts:53](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L53)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/line-item.ts:49](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L49)

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

#### Defined in

[models/line-item.ts:77](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L77)

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

[models/line-item.ts:73](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L73)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### description

• **description**: `string`

#### Defined in

[models/line-item.ts:112](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L112)

___

### discount\_total

• `Optional` **discount\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:167](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L167)

___

### fulfilled\_quantity

• **fulfilled\_quantity**: `number`

#### Defined in

[models/line-item.ts:147](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L147)

___

### gift\_card\_total

• `Optional` **gift\_card\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:168](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L168)

___

### has\_shipping

• **has\_shipping**: `boolean`

#### Defined in

[models/line-item.ts:130](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L130)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### includes\_tax

• **includes\_tax**: `boolean`

#### Defined in

[models/line-item.ts:159](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L159)

___

### is\_giftcard

• **is\_giftcard**: `boolean`

#### Defined in

[models/line-item.ts:121](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L121)

___

### is\_return

• **is\_return**: `boolean`

#### Defined in

[models/line-item.ts:118](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L118)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/line-item.ts:156](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L156)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/line-item.ts:61](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L61)

___

### order\_edit

• `Optional` **order\_edit**: ``null`` \| [`OrderEdit`](OrderEdit.md)

#### Defined in

[models/line-item.ts:106](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L106)

___

### order\_edit\_id

• `Optional` **order\_edit\_id**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:97](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L97)

___

### order\_id

• **order\_id**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:57](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L57)

___

### original\_item\_id

• `Optional` **original\_item\_id**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:91](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L91)

___

### original\_tax\_total

• `Optional` **original\_tax\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:166](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L166)

___

### original\_total

• `Optional` **original\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:165](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L165)

___

### quantity

• **quantity**: `number`

#### Defined in

[models/line-item.ts:144](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L144)

___

### refundable

• `Optional` **refundable**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:161](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L161)

___

### returned\_quantity

• **returned\_quantity**: `number`

#### Defined in

[models/line-item.ts:150](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L150)

___

### shipped\_quantity

• **shipped\_quantity**: `number`

#### Defined in

[models/line-item.ts:153](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L153)

___

### should\_merge

• **should\_merge**: `boolean`

#### Defined in

[models/line-item.ts:124](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L124)

___

### subtotal

• `Optional` **subtotal**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:162](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L162)

___

### swap

• **swap**: [`Swap`](Swap.md)

#### Defined in

[models/line-item.ts:69](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L69)

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

[models/line-item.ts:65](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L65)

___

### tax\_lines

• **tax\_lines**: [`LineItemTaxLine`](LineItemTaxLine.md)[]

#### Defined in

[models/line-item.ts:80](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L80)

___

### tax\_total

• `Optional` **tax\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:163](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L163)

___

### thumbnail

• **thumbnail**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:115](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L115)

___

### title

• **title**: `string`

#### Defined in

[models/line-item.ts:109](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L109)

___

### total

• `Optional` **total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:164](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L164)

___

### unit\_price

• **unit\_price**: `number`

#### Defined in

[models/line-item.ts:133](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L133)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

• **variant**: [`ProductVariant`](ProductVariant.md)

#### Defined in

[models/line-item.ts:141](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L141)

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

[models/line-item.ts:137](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L137)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/line-item.ts:170](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item.ts#L170)
