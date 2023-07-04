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

[models/product-variant.ts:60](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L60)

___

### barcode

• **barcode**: `string`

#### Defined in

[models/product-variant.ts:43](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L43)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### ean

• **ean**: `string`

#### Defined in

[models/product-variant.ts:47](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L47)

___

### height

• **height**: `number`

#### Defined in

[models/product-variant.ts:84](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L84)

___

### hs\_code

• **hs\_code**: `string`

#### Defined in

[models/product-variant.ts:66](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L66)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### inventory\_quantity

• **inventory\_quantity**: `number`

#### Defined in

[models/product-variant.ts:57](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L57)

___

### length

• **length**: `number`

#### Defined in

[models/product-variant.ts:81](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L81)

___

### manage\_inventory

• **manage\_inventory**: `boolean`

#### Defined in

[models/product-variant.ts:63](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L63)

___

### material

• **material**: `string`

#### Defined in

[models/product-variant.ts:75](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L75)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/product-variant.ts:95](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L95)

___

### mid\_code

• **mid\_code**: `string`

#### Defined in

[models/product-variant.ts:72](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L72)

___

### options

• **options**: [`ProductOptionValue`](ProductOptionValue.md)[]

#### Defined in

[models/product-variant.ts:92](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L92)

___

### origin\_country

• **origin\_country**: `string`

#### Defined in

[models/product-variant.ts:69](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L69)

___

### prices

• **prices**: [`MoneyAmount`](MoneyAmount.md)[]

#### Defined in

[models/product-variant.ts:35](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L35)

___

### product

• **product**: [`Product`](Product.md)

#### Defined in

[models/product-variant.ts:29](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L29)

___

### product\_id

• **product\_id**: `string`

#### Defined in

[models/product-variant.ts:25](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L25)

___

### sku

• **sku**: `string`

#### Defined in

[models/product-variant.ts:39](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L39)

___

### title

• **title**: `string`

#### Defined in

[models/product-variant.ts:21](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L21)

___

### upc

• **upc**: `string`

#### Defined in

[models/product-variant.ts:51](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L51)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant\_rank

• **variant\_rank**: `number`

#### Defined in

[models/product-variant.ts:54](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L54)

___

### weight

• **weight**: `number`

#### Defined in

[models/product-variant.ts:78](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L78)

___

### width

• **width**: `number`

#### Defined in

[models/product-variant.ts:87](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L87)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/product-variant.ts:97](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-variant.ts#L97)
