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

### categories

• **categories**: [`ProductCategory`](ProductCategory.md)[]

#### Defined in

[models/product.ts:95](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L95)

___

### collection

• **collection**: [`ProductCollection`](ProductCollection.md)

#### Defined in

[models/product.ts:146](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L146)

___

### collection\_id

• **collection\_id**: ``null`` \| `string`

#### Defined in

[models/product.ts:142](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L142)

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

### description

• **description**: ``null`` \| `string`

#### Defined in

[models/product.ts:46](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L46)

___

### discountable

• **discountable**: `boolean`

#### Defined in

[models/product.ts:170](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L170)

___

### external\_id

• **external\_id**: ``null`` \| `string`

#### Defined in

[models/product.ts:173](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L173)

___

### handle

• **handle**: ``null`` \| `string`

#### Defined in

[models/product.ts:50](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L50)

___

### height

• **height**: ``null`` \| `number`

#### Defined in

[models/product.ts:124](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L124)

___

### hs\_code

• **hs\_code**: ``null`` \| `string`

#### Defined in

[models/product.ts:130](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L130)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### images

• **images**: [`Image`](Image.md)[]

#### Defined in

[models/product.ts:70](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L70)

___

### is\_giftcard

• **is\_giftcard**: `boolean`

#### Defined in

[models/product.ts:53](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L53)

___

### length

• **length**: ``null`` \| `number`

#### Defined in

[models/product.ts:121](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L121)

___

### material

• **material**: ``null`` \| `string`

#### Defined in

[models/product.ts:139](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L139)

___

### metadata

• **metadata**: ``null`` \| `Record`<`string`, `unknown`\>

#### Defined in

[models/product.ts:176](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L176)

___

### mid\_code

• **mid\_code**: ``null`` \| `string`

#### Defined in

[models/product.ts:136](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L136)

___

### options

• **options**: [`ProductOption`](ProductOption.md)[]

#### Defined in

[models/product.ts:76](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L76)

___

### origin\_country

• **origin\_country**: ``null`` \| `string`

#### Defined in

[models/product.ts:133](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L133)

___

### profile

• **profile**: [`ShippingProfile`](ShippingProfile.md)

#### Defined in

[models/product.ts:99](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L99)

___

### profile\_id

• **profile\_id**: `string`

#### Defined in

[models/product.ts:97](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L97)

___

### profiles

• **profiles**: [`ShippingProfile`](ShippingProfile.md)[]

#### Defined in

[models/product.ts:115](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L115)

___

### sales\_channels

• **sales\_channels**: [`SalesChannel`](SalesChannel.md)[]

#### Defined in

[models/product.ts:192](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L192)

___

### status

• **status**: [`ProductStatus`](../enums/ProductStatus.md)

#### Defined in

[models/product.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L56)

___

### subtitle

• **subtitle**: ``null`` \| `string`

#### Defined in

[models/product.ts:43](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L43)

___

### tags

• **tags**: [`ProductTag`](ProductTag.md)[]

#### Defined in

[models/product.ts:167](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L167)

___

### thumbnail

• **thumbnail**: ``null`` \| `string`

#### Defined in

[models/product.ts:73](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L73)

___

### title

• **title**: `string`

#### Defined in

[models/product.ts:40](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L40)

___

### type

• **type**: [`ProductType`](ProductType.md)

#### Defined in

[models/product.ts:153](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L153)

___

### type\_id

• **type\_id**: ``null`` \| `string`

#### Defined in

[models/product.ts:149](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L149)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variants

• **variants**: [`ProductVariant`](ProductVariant.md)[]

#### Defined in

[models/product.ts:81](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L81)

___

### weight

• **weight**: ``null`` \| `number`

#### Defined in

[models/product.ts:118](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L118)

___

### width

• **width**: ``null`` \| `number`

#### Defined in

[models/product.ts:127](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L127)

## Methods

### afterLoad

▸ `Private` **afterLoad**(): `void`

#### Returns

`void`

#### Defined in

[models/product.ts:215](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L215)

___

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/product.ts:195](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L195)

___

### beforeUpdate

▸ `Private` **beforeUpdate**(): `void`

#### Returns

`void`

#### Defined in

[models/product.ts:208](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product.ts#L208)
