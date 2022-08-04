---
displayed_sidebar: jsClientSidebar
---

# Class: ProductVariant

[internal](../modules/internal.md).ProductVariant

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`ProductVariant`**

## Properties

### allow\_backorder

• **allow\_backorder**: `boolean`

#### Defined in

medusa/dist/models/product-variant.d.ts:16

___

### barcode

• **barcode**: `string`

#### Defined in

medusa/dist/models/product-variant.d.ts:11

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/product-variant.d.ts:28

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### ean

• **ean**: `string`

#### Defined in

medusa/dist/models/product-variant.d.ts:12

___

### height

• **height**: `number`

#### Defined in

medusa/dist/models/product-variant.d.ts:24

___

### hs\_code

• **hs\_code**: `string`

#### Defined in

medusa/dist/models/product-variant.d.ts:18

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### inventory\_quantity

• **inventory\_quantity**: `number`

#### Defined in

medusa/dist/models/product-variant.d.ts:15

___

### length

• **length**: `number`

#### Defined in

medusa/dist/models/product-variant.d.ts:23

___

### manage\_inventory

• **manage\_inventory**: `boolean`

#### Defined in

medusa/dist/models/product-variant.d.ts:17

___

### material

• **material**: `string`

#### Defined in

medusa/dist/models/product-variant.d.ts:21

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/product-variant.d.ts:27

___

### mid\_code

• **mid\_code**: `string`

#### Defined in

medusa/dist/models/product-variant.d.ts:20

___

### options

• **options**: [`ProductOptionValue`](internal.ProductOptionValue.md)[]

#### Defined in

medusa/dist/models/product-variant.d.ts:26

___

### origin\_country

• **origin\_country**: `string`

#### Defined in

medusa/dist/models/product-variant.d.ts:19

___

### prices

• **prices**: [`MoneyAmount`](internal.MoneyAmount.md)[]

#### Defined in

medusa/dist/models/product-variant.d.ts:9

___

### product

• **product**: [`Product`](internal.Product.md)

#### Defined in

medusa/dist/models/product-variant.d.ts:8

___

### product\_id

• **product\_id**: `string`

#### Defined in

medusa/dist/models/product-variant.d.ts:7

___

### sku

• **sku**: `string`

#### Defined in

medusa/dist/models/product-variant.d.ts:10

___

### title

• **title**: `string`

#### Defined in

medusa/dist/models/product-variant.d.ts:6

___

### upc

• **upc**: `string`

#### Defined in

medusa/dist/models/product-variant.d.ts:13

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7

___

### variant\_rank

• **variant\_rank**: `number`

#### Defined in

medusa/dist/models/product-variant.d.ts:14

___

### weight

• **weight**: `number`

#### Defined in

medusa/dist/models/product-variant.d.ts:22

___

### width

• **width**: `number`

#### Defined in

medusa/dist/models/product-variant.d.ts:25
