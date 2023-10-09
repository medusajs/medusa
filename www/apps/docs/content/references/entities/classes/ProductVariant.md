---
displayed_sidebar: entitiesSidebar
---

# Class: ProductVariant

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`ProductVariant`**

## Constructors

### constructor

• **new ProductVariant**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### allow\_backorder

• **allow\_backorder**: `boolean`

#### Defined in

[models/product-variant.ts:72](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L72)

___

### barcode

• **barcode**: `string`

#### Defined in

[models/product-variant.ts:55](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L55)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### ean

• **ean**: `string`

#### Defined in

[models/product-variant.ts:59](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L59)

___

### height

• **height**: `number`

#### Defined in

[models/product-variant.ts:96](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L96)

___

### hs\_code

• **hs\_code**: `string`

#### Defined in

[models/product-variant.ts:78](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L78)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### inventory\_items

• **inventory\_items**: [`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)[]

#### Defined in

[models/product-variant.ts:113](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L113)

___

### inventory\_quantity

• **inventory\_quantity**: `number`

#### Defined in

[models/product-variant.ts:69](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L69)

___

### length

• **length**: `number`

#### Defined in

[models/product-variant.ts:93](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L93)

___

### manage\_inventory

• **manage\_inventory**: `boolean`

#### Defined in

[models/product-variant.ts:75](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L75)

___

### material

• **material**: `string`

#### Defined in

[models/product-variant.ts:87](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L87)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/product-variant.ts:116](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L116)

___

### mid\_code

• **mid\_code**: `string`

#### Defined in

[models/product-variant.ts:84](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L84)

___

### options

• **options**: [`ProductOptionValue`](ProductOptionValue.md)[]

#### Defined in

[models/product-variant.ts:104](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L104)

___

### origin\_country

• **origin\_country**: `string`

#### Defined in

[models/product-variant.ts:81](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L81)

___

### prices

• **prices**: [`MoneyAmount`](MoneyAmount.md)[]

#### Defined in

[models/product-variant.ts:47](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L47)

___

### product

• **product**: [`Product`](Product.md)

#### Defined in

[models/product-variant.ts:31](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L31)

___

### product\_id

• **product\_id**: `string`

#### Defined in

[models/product-variant.ts:27](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L27)

___

### purchasable

• `Optional` **purchasable**: `boolean`

#### Defined in

[models/product-variant.ts:118](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L118)

___

### sku

• **sku**: `string`

#### Defined in

[models/product-variant.ts:51](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L51)

___

### title

• **title**: `string`

#### Defined in

[models/product-variant.ts:23](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L23)

___

### upc

• **upc**: `string`

#### Defined in

[models/product-variant.ts:63](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L63)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant\_rank

• **variant\_rank**: `number`

#### Defined in

[models/product-variant.ts:66](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L66)

___

### weight

• **weight**: `number`

#### Defined in

[models/product-variant.ts:90](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L90)

___

### width

• **width**: `number`

#### Defined in

[models/product-variant.ts:99](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L99)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/product-variant.ts:121](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant.ts#L121)
