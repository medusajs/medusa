# LineItem

Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`LineItem`**

## Constructors

### constructor

**new LineItem**()

Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### adjustments

 **adjustments**: [`LineItemAdjustment`](LineItemAdjustment.md)[]

The details of the item's adjustments, which are available when a discount is applied on the item.

#### Defined in

[packages/medusa/src/models/line-item.ts:87](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L87)

___

### allow\_discounts

 **allow\_discounts**: `boolean` = `true`

Flag to indicate if the Line Item should be included when doing discount calculations.

#### Defined in

[packages/medusa/src/models/line-item.ts:118](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L118)

___

### cart

 **cart**: [`Cart`](Cart.md)

The details of the cart that the line item may belongs to.

#### Defined in

[packages/medusa/src/models/line-item.ts:53](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L53)

___

### cart\_id

 **cart\_id**: `string`

The ID of the cart that the line item may belongs to.

#### Defined in

[packages/medusa/src/models/line-item.ts:49](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L49)

___

### claim\_order

 **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

The details of the claim that the line item may belong to.

#### Defined in

[packages/medusa/src/models/line-item.ts:77](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L77)

___

### claim\_order\_id

 **claim\_order\_id**: `string`

The ID of the claim that the line item may belong to.

#### Defined in

[packages/medusa/src/models/line-item.ts:73](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L73)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### description

 **description**: ``null`` \| `string`

A more detailed description of the contents of the Line Item.

#### Defined in

[packages/medusa/src/models/line-item.ts:103](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L103)

___

### discount\_total

 `Optional` **discount\_total**: ``null`` \| `number`

The total of discount of the line item rounded

#### Defined in

[packages/medusa/src/models/line-item.ts:161](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L161)

___

### fulfilled\_quantity

 **fulfilled\_quantity**: ``null`` \| `number`

The quantity of the Line Item that has been fulfilled.

#### Defined in

[packages/medusa/src/models/line-item.ts:141](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L141)

___

### gift\_card\_total

 `Optional` **gift\_card\_total**: ``null`` \| `number`

The total of the gift card of the line item

#### Defined in

[packages/medusa/src/models/line-item.ts:163](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L163)

___

### has\_shipping

 **has\_shipping**: ``null`` \| `boolean`

Flag to indicate if the Line Item has fulfillment associated with it.

#### Defined in

[packages/medusa/src/models/line-item.ts:121](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L121)

___

### id

 **id**: `string`

The line item's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### includes\_tax

 **includes\_tax**: `boolean`

Indicates if the line item unit_price include tax

#### Defined in

[packages/medusa/src/models/line-item.ts:153](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L153)

___

### is\_giftcard

 **is\_giftcard**: `boolean`

Flag to indicate if the Line Item is a Gift Card.

#### Defined in

[packages/medusa/src/models/line-item.ts:112](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L112)

___

### is\_return

 **is\_return**: `boolean`

Is the item being returned

#### Defined in

[packages/medusa/src/models/line-item.ts:109](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L109)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/line-item.ts:150](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L150)

___

### order

 **order**: [`Order`](Order.md)

The details of the order that the line item may belongs to.

#### Defined in

[packages/medusa/src/models/line-item.ts:61](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L61)

___

### order\_edit

 `Optional` **order\_edit**: ``null`` \| [`OrderEdit`](OrderEdit.md)

The details of the order edit.

#### Defined in

[packages/medusa/src/models/line-item.ts:97](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L97)

___

### order\_edit\_id

 `Optional` **order\_edit\_id**: ``null`` \| `string`

The ID of the order edit that the item may belong to.

#### Defined in

[packages/medusa/src/models/line-item.ts:93](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L93)

___

### order\_id

 **order\_id**: ``null`` \| `string`

The ID of the order that the line item may belongs to.

#### Defined in

[packages/medusa/src/models/line-item.ts:57](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L57)

___

### original\_item\_id

 `Optional` **original\_item\_id**: ``null`` \| `string`

The ID of the original line item. This is useful if the line item belongs to a resource that references an order, such as a return or an order edit.

#### Defined in

[packages/medusa/src/models/line-item.ts:90](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L90)

___

### original\_tax\_total

 `Optional` **original\_tax\_total**: ``null`` \| `number`

The original tax total amount of the line item

#### Defined in

[packages/medusa/src/models/line-item.ts:160](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L160)

___

### original\_total

 `Optional` **original\_total**: ``null`` \| `number`

The original total amount of the line item

#### Defined in

[packages/medusa/src/models/line-item.ts:159](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L159)

___

### product\_id

 **product\_id**: ``null`` \| `string`

#### Defined in

[packages/medusa/src/models/line-item.ts:135](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L135)

___

### quantity

 **quantity**: `number`

The quantity of the content in the Line Item.

#### Defined in

[packages/medusa/src/models/line-item.ts:138](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L138)

___

### raw\_discount\_total

 `Optional` **raw\_discount\_total**: ``null`` \| `number`

The total of discount of the line item

#### Defined in

[packages/medusa/src/models/line-item.ts:162](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L162)

___

### refundable

 `Optional` **refundable**: ``null`` \| `number`

The amount that can be refunded from the given Line Item. Takes taxes and discounts into consideration.

#### Defined in

[packages/medusa/src/models/line-item.ts:155](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L155)

___

### returned\_quantity

 **returned\_quantity**: ``null`` \| `number`

The quantity of the Line Item that has been returned.

#### Defined in

[packages/medusa/src/models/line-item.ts:144](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L144)

___

### shipped\_quantity

 **shipped\_quantity**: ``null`` \| `number`

The quantity of the Line Item that has been shipped.

#### Defined in

[packages/medusa/src/models/line-item.ts:147](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L147)

___

### should\_merge

 **should\_merge**: `boolean` = `true`

Flag to indicate if new Line Items with the same variant should be merged or added as an additional Line Item.

#### Defined in

[packages/medusa/src/models/line-item.ts:115](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L115)

___

### subtotal

 `Optional` **subtotal**: ``null`` \| `number`

The subtotal of the line item

#### Defined in

[packages/medusa/src/models/line-item.ts:156](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L156)

___

### swap

 **swap**: [`Swap`](Swap.md)

The details of the swap that the line item may belong to.

#### Defined in

[packages/medusa/src/models/line-item.ts:69](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L69)

___

### swap\_id

 **swap\_id**: `string`

The ID of the swap that the line item may belong to.

#### Defined in

[packages/medusa/src/models/line-item.ts:65](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L65)

___

### tax\_lines

 **tax\_lines**: [`LineItemTaxLine`](LineItemTaxLine.md)[]

The details of the item's tax lines.

#### Defined in

[packages/medusa/src/models/line-item.ts:82](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L82)

___

### tax\_total

 `Optional` **tax\_total**: ``null`` \| `number`

The total of tax of the line item

#### Defined in

[packages/medusa/src/models/line-item.ts:157](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L157)

___

### thumbnail

 **thumbnail**: ``null`` \| `string`

A URL string to a small image of the contents of the Line Item.

#### Defined in

[packages/medusa/src/models/line-item.ts:106](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L106)

___

### title

 **title**: `string`

The title of the Line Item.

#### Defined in

[packages/medusa/src/models/line-item.ts:100](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L100)

___

### total

 `Optional` **total**: ``null`` \| `number`

The total amount of the line item

#### Defined in

[packages/medusa/src/models/line-item.ts:158](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L158)

___

### unit\_price

 **unit\_price**: `number`

The price of one unit of the content in the Line Item. This should be in the currency defined by the Cart/Order/Swap/Claim that the Line Item belongs to.

#### Defined in

[packages/medusa/src/models/line-item.ts:124](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L124)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[BaseEntity](BaseEntity.md).[updated_at](BaseEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

 **variant**: [`ProductVariant`](ProductVariant.md)

The details of the product variant that this item was created from.

#### Defined in

[packages/medusa/src/models/line-item.ts:132](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L132)

___

### variant\_id

 **variant\_id**: ``null`` \| `string`

The id of the Product Variant contained in the Line Item.

#### Defined in

[packages/medusa/src/models/line-item.ts:128](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L128)

## Methods

### afterUpdateOrLoad

**afterUpdateOrLoad**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/line-item.ts:202](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L202)

___

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/line-item.ts:169](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L169)

___

### beforeUpdate

**beforeUpdate**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/line-item.ts:188](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item.ts#L188)
