# CustomShippingOption

Custom Shipping Options are overridden Shipping Options. Admins can attach a Custom Shipping Option to a cart in order to set a custom price for a particular Shipping Option.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`CustomShippingOption`**

## Constructors

### constructor

**new CustomShippingOption**()

Custom Shipping Options are overridden Shipping Options. Admins can attach a Custom Shipping Option to a cart in order to set a custom price for a particular Shipping Option.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### cart

 **cart**: [`Cart`](Cart.md)

The details of the cart this shipping option belongs to.

#### Defined in

[packages/medusa/src/models/custom-shipping-option.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/custom-shipping-option.ts#L37)

___

### cart\_id

 **cart\_id**: `string`

The ID of the Cart that the custom shipping option is attached to

#### Defined in

[packages/medusa/src/models/custom-shipping-option.ts:33](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/custom-shipping-option.ts#L33)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

 **id**: `string`

The custom shipping option's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/custom-shipping-option.ts:40](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/custom-shipping-option.ts#L40)

___

### price

 **price**: `number`

The custom price set that will override the shipping option's original price

#### Defined in

[packages/medusa/src/models/custom-shipping-option.ts:21](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/custom-shipping-option.ts#L21)

___

### shipping\_option

 **shipping\_option**: [`ShippingOption`](ShippingOption.md)

The details of the overridden shipping options.

#### Defined in

[packages/medusa/src/models/custom-shipping-option.ts:29](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/custom-shipping-option.ts#L29)

___

### shipping\_option\_id

 **shipping\_option\_id**: `string`

The ID of the Shipping Option that the custom shipping option overrides

#### Defined in

[packages/medusa/src/models/custom-shipping-option.ts:25](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/custom-shipping-option.ts#L25)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/custom-shipping-option.ts:46](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/custom-shipping-option.ts#L46)
