# ShippingOption

A Shipping Option represents a way in which an Order or Return can be shipped. Shipping Options have an associated Fulfillment Provider that will be used when the fulfillment of an Order is initiated. Shipping Options themselves cannot be added to Carts, but serve as a template for Shipping Methods. This distinction makes it possible to customize individual Shipping Methods with additional information.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`ShippingOption`**

## Constructors

### constructor

**new ShippingOption**()

A Shipping Option represents a way in which an Order or Return can be shipped. Shipping Options have an associated Fulfillment Provider that will be used when the fulfillment of an Order is initiated. Shipping Options themselves cannot be added to Carts, but serve as a template for Shipping Methods. This distinction makes it possible to customize individual Shipping Methods with additional information.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### admin\_only

 **admin\_only**: `boolean`

Flag to indicate if the Shipping Option usage is restricted to admin users.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:78](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L78)

___

### amount

 **amount**: ``null`` \| `number`

The amount to charge for shipping when the Shipping Option price type is `flat_rate`.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:72](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L72)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### data

 **data**: Record<`string`, `unknown`\>

The data needed for the Fulfillment Provider to identify the Shipping Option.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:86](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L86)

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

The shipping option's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### includes\_tax

 **includes\_tax**: `boolean`

Whether the shipping option price include tax

#### Defined in

[packages/medusa/src/models/shipping-option.ts:92](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L92)

___

### is\_return

 **is\_return**: `boolean`

Flag to indicate if the Shipping Option can be used for Return shipments.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:75](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L75)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/shipping-option.ts:89](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L89)

___

### name

 **name**: `string`

The name given to the Shipping Option - this may be displayed to the Customer.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:42](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L42)

___

### price\_type

 **price\_type**: [`ShippingOptionPriceType`](../enums/ShippingOptionPriceType.md)

The type of pricing calculation that is used when creatin Shipping Methods from the Shipping Option. Can be `flat_rate` for fixed prices or `calculated` if the Fulfillment Provider can provide price calulations.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:69](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L69)

___

### profile

 **profile**: [`ShippingProfile`](ShippingProfile.md)

The details of the shipping profile that the shipping option belongs to.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:58](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L58)

___

### profile\_id

 **profile\_id**: `string`

The ID of the Shipping Profile that the shipping option belongs to.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:54](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L54)

___

### provider

 **provider**: [`FulfillmentProvider`](FulfillmentProvider.md)

The details of the fulfillment provider that will be used to later to process the shipping method created from this shipping option and its fulfillments.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:66](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L66)

___

### provider\_id

 **provider\_id**: `string`

The ID of the fulfillment provider that will be used to later to process the shipping method created from this shipping option and its fulfillments.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:62](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L62)

___

### region

 **region**: [`Region`](Region.md)

The details of the region this shipping option can be used in.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:50](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L50)

___

### region\_id

 **region\_id**: `string`

The ID of the region this shipping option can be used in.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:46](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L46)

___

### requirements

 **requirements**: [`ShippingOptionRequirement`](ShippingOptionRequirement.md)[]

The details of the requirements that must be satisfied for the Shipping Option to be available for usage in a Cart.

#### Defined in

[packages/medusa/src/models/shipping-option.ts:83](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L83)

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

[packages/medusa/src/models/shipping-option.ts:98](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-option.ts#L98)
