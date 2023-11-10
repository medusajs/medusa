# ShippingProfile

A Shipping Profile has a set of defined Shipping Options that can be used to fulfill a given set of Products. For example, gift cards are shipped differently than physical products, so a shipping profile with the type `gift_card` groups together the shipping options that can only be used for gift cards.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`ShippingProfile`**

## Constructors

### constructor

**new ShippingProfile**()

A Shipping Profile has a set of defined Shipping Options that can be used to fulfill a given set of Products. For example, gift cards are shipped differently than physical products, so a shipping profile with the type `gift_card` groups together the shipping options that can only be used for gift cards.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

 **id**: `string`

The shipping profile's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/shipping-profile.ts:61](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-profile.ts#L61)

___

### name

 **name**: `string`

The name given to the Shipping profile - this may be displayed to the Customer.

#### Defined in

[packages/medusa/src/models/shipping-profile.ts:38](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-profile.ts#L38)

___

### products

 **products**: [`Product`](Product.md)[]

The details of the products that the Shipping Profile defines Shipping Options for. Available if the relation `products` is expanded.

#### Defined in

[packages/medusa/src/models/shipping-profile.ts:55](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-profile.ts#L55)

___

### shipping\_options

 **shipping\_options**: [`ShippingOption`](ShippingOption.md)[]

The details of the shipping options that can be used to create shipping methods for the Products in the Shipping Profile.

#### Defined in

[packages/medusa/src/models/shipping-profile.ts:58](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-profile.ts#L58)

___

### type

 **type**: [`ShippingProfileType`](../enums/ShippingProfileType.md)

The type of the Shipping Profile, may be `default`, `gift_card` or `custom`.

#### Defined in

[packages/medusa/src/models/shipping-profile.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-profile.ts#L41)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/shipping-profile.ts:67](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-profile.ts#L67)
