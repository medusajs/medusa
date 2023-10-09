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

[models/line-item.ts:87](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L87)

___

### allow\_discounts

• **allow\_discounts**: `boolean`

#### Defined in

[models/line-item.ts:118](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L118)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/line-item.ts:53](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L53)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/line-item.ts:49](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L49)

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

#### Defined in

[models/line-item.ts:77](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L77)

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

[models/line-item.ts:73](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L73)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### description

• **description**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:103](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L103)

___

### discount\_total

• `Optional` **discount\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:161](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L161)

___

### fulfilled\_quantity

• **fulfilled\_quantity**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:141](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L141)

___

### gift\_card\_total

• `Optional` **gift\_card\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:163](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L163)

___

### has\_shipping

• **has\_shipping**: ``null`` \| `boolean`

#### Defined in

[models/line-item.ts:121](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L121)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### includes\_tax

• **includes\_tax**: `boolean`

#### Defined in

[models/line-item.ts:153](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L153)

___

### is\_giftcard

• **is\_giftcard**: `boolean`

#### Defined in

[models/line-item.ts:112](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L112)

___

### is\_return

• **is\_return**: `boolean`

#### Defined in

[models/line-item.ts:109](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L109)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/line-item.ts:150](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L150)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/line-item.ts:61](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L61)

___

### order\_edit

• `Optional` **order\_edit**: ``null`` \| [`OrderEdit`](OrderEdit.md)

#### Defined in

[models/line-item.ts:97](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L97)

___

### order\_edit\_id

• `Optional` **order\_edit\_id**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:93](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L93)

___

### order\_id

• **order\_id**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:57](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L57)

___

### original\_item\_id

• `Optional` **original\_item\_id**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:90](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L90)

___

### original\_tax\_total

• `Optional` **original\_tax\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:160](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L160)

___

### original\_total

• `Optional` **original\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:159](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L159)

___

### product\_id

• **product\_id**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:135](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L135)

___

### quantity

• **quantity**: `number`

#### Defined in

[models/line-item.ts:138](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L138)

___

### raw\_discount\_total

• `Optional` **raw\_discount\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:162](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L162)

___

### refundable

• `Optional` **refundable**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:155](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L155)

___

### returned\_quantity

• **returned\_quantity**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:144](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L144)

___

### shipped\_quantity

• **shipped\_quantity**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:147](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L147)

___

### should\_merge

• **should\_merge**: `boolean`

#### Defined in

[models/line-item.ts:115](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L115)

___

### subtotal

• `Optional` **subtotal**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:156](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L156)

___

### swap

• **swap**: [`Swap`](Swap.md)

#### Defined in

[models/line-item.ts:69](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L69)

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

[models/line-item.ts:65](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L65)

___

### tax\_lines

• **tax\_lines**: [`LineItemTaxLine`](LineItemTaxLine.md)[]

#### Defined in

[models/line-item.ts:82](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L82)

___

### tax\_total

• `Optional` **tax\_total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:157](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L157)

___

### thumbnail

• **thumbnail**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:106](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L106)

___

### title

• **title**: `string`

#### Defined in

[models/line-item.ts:100](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L100)

___

### total

• `Optional` **total**: ``null`` \| `number`

#### Defined in

[models/line-item.ts:158](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L158)

___

### unit\_price

• **unit\_price**: `number`

#### Defined in

[models/line-item.ts:124](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L124)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

• **variant**: [`ProductVariant`](ProductVariant.md)

#### Defined in

[models/line-item.ts:132](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L132)

___

### variant\_id

• **variant\_id**: ``null`` \| `string`

#### Defined in

[models/line-item.ts:128](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L128)

## Methods

### afterUpdateOrLoad

▸ **afterUpdateOrLoad**(): `void`

#### Returns

`void`

#### Defined in

[models/line-item.ts:193](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L193)

___

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/line-item.ts:166](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L166)

___

### beforeUpdate

▸ **beforeUpdate**(): `void`

#### Returns

`void`

#### Defined in

[models/line-item.ts:182](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/line-item.ts#L182)
