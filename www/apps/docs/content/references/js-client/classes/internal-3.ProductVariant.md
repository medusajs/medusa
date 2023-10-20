---
displayed_sidebar: jsClientSidebar
---

# Class: ProductVariant

[internal](../modules/internal-3.md).ProductVariant

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`ProductVariant`**

## Properties

### allow\_backorder

• **allow\_backorder**: `boolean`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:17

___

### barcode

• **barcode**: `string`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:12

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:31

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[created_at](internal-1.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[deleted_at](internal-1.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### ean

• **ean**: `string`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:13

___

### height

• **height**: `number`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:25

___

### hs\_code

• **hs\_code**: `string`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:19

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### inventory\_items

• **inventory\_items**: [`ProductVariantInventoryItem`](internal-3.ProductVariantInventoryItem.md)[]

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:28

___

### inventory\_quantity

• **inventory\_quantity**: `number`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:16

___

### length

• **length**: `number`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:24

___

### manage\_inventory

• **manage\_inventory**: `boolean`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:18

___

### material

• **material**: `string`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:22

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:29

___

### mid\_code

• **mid\_code**: `string`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:21

___

### options

• **options**: [`ProductOptionValue`](internal-3.ProductOptionValue.md)[]

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:27

___

### origin\_country

• **origin\_country**: `string`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:20

___

### prices

• **prices**: [`MoneyAmount`](internal-3.MoneyAmount.md)[]

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:10

___

### product

• **product**: [`Product`](internal-3.Product.md)

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:9

___

### product\_id

• **product\_id**: `string`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:8

___

### purchasable

• `Optional` **purchasable**: `boolean`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:30

___

### sku

• **sku**: `string`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:11

___

### title

• **title**: `string`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:7

___

### upc

• **upc**: `string`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:14

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7

___

### variant\_rank

• **variant\_rank**: `number`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:15

___

### weight

• **weight**: `number`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:23

___

### width

• **width**: `number`

#### Defined in

packages/medusa/dist/models/product-variant.d.ts:26
