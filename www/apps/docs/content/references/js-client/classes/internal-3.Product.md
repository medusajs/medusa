---
displayed_sidebar: jsClientSidebar
---

# Class: Product

[internal](../modules/internal-3.md).Product

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`Product`**

## Properties

### afterLoad

• `Private` **afterLoad**: `any`

#### Defined in

packages/medusa/dist/models/product.d.ts:51

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/product.d.ts:49

___

### beforeUpdate

• `Private` **beforeUpdate**: `any`

#### Defined in

packages/medusa/dist/models/product.d.ts:50

___

### categories

• **categories**: [`ProductCategory`](internal-3.ProductCategory.md)[]

#### Defined in

packages/medusa/dist/models/product.d.ts:28

___

### collection

• **collection**: [`ProductCollection`](internal-3.ProductCollection.md)

#### Defined in

packages/medusa/dist/models/product.d.ts:41

___

### collection\_id

• **collection\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:40

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

### description

• **description**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:20

___

### discountable

• **discountable**: `boolean`

#### Defined in

packages/medusa/dist/models/product.d.ts:45

___

### external\_id

• **external\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:46

___

### handle

• **handle**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:21

___

### height

• **height**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/product.d.ts:34

___

### hs\_code

• **hs\_code**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:36

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### images

• **images**: [`Image`](internal-3.Image.md)[]

#### Defined in

packages/medusa/dist/models/product.d.ts:24

___

### is\_giftcard

• **is\_giftcard**: `boolean`

#### Defined in

packages/medusa/dist/models/product.d.ts:22

___

### length

• **length**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/product.d.ts:33

___

### material

• **material**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:39

___

### metadata

• **metadata**: ``null`` \| [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/product.d.ts:47

___

### mid\_code

• **mid\_code**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:38

___

### options

• **options**: [`ProductOption`](internal-3.ProductOption.md)[]

#### Defined in

packages/medusa/dist/models/product.d.ts:26

___

### origin\_country

• **origin\_country**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:37

___

### profile

• **profile**: [`ShippingProfile`](internal-3.ShippingProfile.md)

#### Defined in

packages/medusa/dist/models/product.d.ts:30

___

### profile\_id

• **profile\_id**: `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:29

___

### profiles

• **profiles**: [`ShippingProfile`](internal-3.ShippingProfile.md)[]

#### Defined in

packages/medusa/dist/models/product.d.ts:31

___

### sales\_channels

• **sales\_channels**: [`SalesChannel`](internal-3.SalesChannel.md)[]

#### Defined in

packages/medusa/dist/models/product.d.ts:48

___

### status

• **status**: [`ProductStatus`](../enums/internal-3.ProductStatus.md)

#### Defined in

packages/medusa/dist/models/product.d.ts:23

___

### subtitle

• **subtitle**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:19

___

### tags

• **tags**: [`ProductTag`](internal-3.ProductTag.md)[]

#### Defined in

packages/medusa/dist/models/product.d.ts:44

___

### thumbnail

• **thumbnail**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:25

___

### title

• **title**: `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:18

___

### type

• **type**: [`ProductType`](internal-3.ProductType.md)

#### Defined in

packages/medusa/dist/models/product.d.ts:43

___

### type\_id

• **type\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product.d.ts:42

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7

___

### variants

• **variants**: [`ProductVariant`](internal-3.ProductVariant.md)[]

#### Defined in

packages/medusa/dist/models/product.d.ts:27

___

### weight

• **weight**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/product.d.ts:32

___

### width

• **width**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/product.d.ts:35
