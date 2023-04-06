---
displayed_sidebar: entitiesSidebar
---

# Class: Product

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`Product`**

## Constructors

### constructor

• **new Product**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### collection

• **collection**: [`ProductCollection`](ProductCollection.md)

#### Defined in

[models/product.ts:117](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L117)

___

### collection\_id

• **collection\_id**: ``null`` \| `string`

#### Defined in

[models/product.ts:113](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L113)

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

### description

• **description**: ``null`` \| `string`

#### Defined in

[models/product.ts:43](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L43)

___

### discountable

• **discountable**: `boolean`

#### Defined in

[models/product.ts:141](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L141)

___

### external\_id

• **external\_id**: ``null`` \| `string`

#### Defined in

[models/product.ts:144](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L144)

___

### handle

• **handle**: ``null`` \| `string`

#### Defined in

[models/product.ts:47](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L47)

___

### height

• **height**: ``null`` \| `number`

#### Defined in

[models/product.ts:95](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L95)

___

### hs\_code

• **hs\_code**: ``null`` \| `string`

#### Defined in

[models/product.ts:101](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L101)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### images

• **images**: [`Image`](Image.md)[]

#### Defined in

[models/product.ts:67](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L67)

___

### is\_giftcard

• **is\_giftcard**: `boolean`

#### Defined in

[models/product.ts:50](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L50)

___

### length

• **length**: ``null`` \| `number`

#### Defined in

[models/product.ts:92](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L92)

___

### material

• **material**: ``null`` \| `string`

#### Defined in

[models/product.ts:110](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L110)

___

### metadata

• **metadata**: ``null`` \| `Record`<`string`, `unknown`\>

#### Defined in

[models/product.ts:147](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L147)

___

### mid\_code

• **mid\_code**: ``null`` \| `string`

#### Defined in

[models/product.ts:107](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L107)

___

### options

• **options**: [`ProductOption`](ProductOption.md)[]

#### Defined in

[models/product.ts:73](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L73)

___

### origin\_country

• **origin\_country**: ``null`` \| `string`

#### Defined in

[models/product.ts:104](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L104)

___

### profile

• **profile**: [`ShippingProfile`](ShippingProfile.md)

#### Defined in

[models/product.ts:86](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L86)

___

### profile\_id

• **profile\_id**: `string`

#### Defined in

[models/product.ts:82](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L82)

___

### sales\_channels

• **sales\_channels**: [`SalesChannel`](SalesChannel.md)[]

#### Defined in

[models/product.ts:163](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L163)

___

### status

• **status**: [`ProductStatus`](../enums/ProductStatus.md)

#### Defined in

[models/product.ts:53](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L53)

___

### subtitle

• **subtitle**: ``null`` \| `string`

#### Defined in

[models/product.ts:40](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L40)

___

### tags

• **tags**: [`ProductTag`](ProductTag.md)[]

#### Defined in

[models/product.ts:138](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L138)

___

### thumbnail

• **thumbnail**: ``null`` \| `string`

#### Defined in

[models/product.ts:70](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L70)

___

### title

• **title**: `string`

#### Defined in

[models/product.ts:37](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L37)

___

### type

• **type**: [`ProductType`](ProductType.md)

#### Defined in

[models/product.ts:124](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L124)

___

### type\_id

• **type\_id**: ``null`` \| `string`

#### Defined in

[models/product.ts:120](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L120)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variants

• **variants**: [`ProductVariant`](ProductVariant.md)[]

#### Defined in

[models/product.ts:78](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L78)

___

### weight

• **weight**: ``null`` \| `number`

#### Defined in

[models/product.ts:89](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L89)

___

### width

• **width**: ``null`` \| `number`

#### Defined in

[models/product.ts:98](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L98)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/product.ts:165](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product.ts#L165)
