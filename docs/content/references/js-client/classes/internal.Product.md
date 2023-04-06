---
displayed_sidebar: jsClientSidebar
---

# Class: Product

[internal](../modules/internal.md).Product

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`Product`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/product.d.ts:46

___

### collection

• **collection**: [`ProductCollection`](internal.ProductCollection.md)

#### Defined in

medusa/dist/models/product.d.ts:38

___

### collection\_id

• **collection\_id**: ``null`` \| `string`

#### Defined in

medusa/dist/models/product.d.ts:37

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

### description

• **description**: ``null`` \| `string`

#### Defined in

medusa/dist/models/product.d.ts:19

___

### discountable

• **discountable**: `boolean`

#### Defined in

medusa/dist/models/product.d.ts:42

___

### external\_id

• **external\_id**: ``null`` \| `string`

#### Defined in

medusa/dist/models/product.d.ts:43

___

### handle

• **handle**: ``null`` \| `string`

#### Defined in

medusa/dist/models/product.d.ts:20

___

### height

• **height**: ``null`` \| `number`

#### Defined in

medusa/dist/models/product.d.ts:31

___

### hs\_code

• **hs\_code**: ``null`` \| `string`

#### Defined in

medusa/dist/models/product.d.ts:33

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### images

• **images**: [`Image`](internal.Image.md)[]

#### Defined in

medusa/dist/models/product.d.ts:23

___

### is\_giftcard

• **is\_giftcard**: `boolean`

#### Defined in

medusa/dist/models/product.d.ts:21

___

### length

• **length**: ``null`` \| `number`

#### Defined in

medusa/dist/models/product.d.ts:30

___

### material

• **material**: ``null`` \| `string`

#### Defined in

medusa/dist/models/product.d.ts:36

___

### metadata

• **metadata**: ``null`` \| `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/product.d.ts:44

___

### mid\_code

• **mid\_code**: ``null`` \| `string`

#### Defined in

medusa/dist/models/product.d.ts:35

___

### options

• **options**: [`ProductOption`](internal.ProductOption.md)[]

#### Defined in

medusa/dist/models/product.d.ts:25

___

### origin\_country

• **origin\_country**: ``null`` \| `string`

#### Defined in

medusa/dist/models/product.d.ts:34

___

### profile

• **profile**: [`ShippingProfile`](internal.ShippingProfile.md)

#### Defined in

medusa/dist/models/product.d.ts:28

___

### profile\_id

• **profile\_id**: `string`

#### Defined in

medusa/dist/models/product.d.ts:27

___

### sales\_channels

• **sales\_channels**: [`SalesChannel`](internal.SalesChannel.md)[]

#### Defined in

medusa/dist/models/product.d.ts:45

___

### status

• **status**: [`ProductStatus`](../enums/internal.ProductStatus.md)

#### Defined in

medusa/dist/models/product.d.ts:22

___

### subtitle

• **subtitle**: ``null`` \| `string`

#### Defined in

medusa/dist/models/product.d.ts:18

___

### tags

• **tags**: [`ProductTag`](internal.ProductTag.md)[]

#### Defined in

medusa/dist/models/product.d.ts:41

___

### thumbnail

• **thumbnail**: ``null`` \| `string`

#### Defined in

medusa/dist/models/product.d.ts:24

___

### title

• **title**: `string`

#### Defined in

medusa/dist/models/product.d.ts:17

___

### type

• **type**: [`ProductType`](internal.ProductType.md)

#### Defined in

medusa/dist/models/product.d.ts:40

___

### type\_id

• **type\_id**: ``null`` \| `string`

#### Defined in

medusa/dist/models/product.d.ts:39

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7

___

### variants

• **variants**: [`ProductVariant`](internal.ProductVariant.md)[]

#### Defined in

medusa/dist/models/product.d.ts:26

___

### weight

• **weight**: ``null`` \| `number`

#### Defined in

medusa/dist/models/product.d.ts:29

___

### width

• **width**: ``null`` \| `number`

#### Defined in

medusa/dist/models/product.d.ts:32
