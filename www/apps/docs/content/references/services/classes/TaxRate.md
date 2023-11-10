# TaxRate

A Tax Rate can be used to define a custom rate to charge on specified products, product types, and shipping options within a given region.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`TaxRate`**

## Constructors

### constructor

**new TaxRate**()

A Tax Rate can be used to define a custom rate to charge on specified products, product types, and shipping options within a given region.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### code

 **code**: ``null`` \| `string`

A code to identify the tax type by

#### Defined in

[packages/medusa/src/models/tax-rate.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L25)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### id

 **id**: `string`

The tax rate's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/tax-rate.ts:38](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L38)

___

### name

 **name**: `string`

A human friendly name for the tax

#### Defined in

[packages/medusa/src/models/tax-rate.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L28)

___

### product\_count

 `Optional` **product\_count**: `number`

The count of products

#### Defined in

[packages/medusa/src/models/tax-rate.ts:83](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L83)

___

### product\_type\_count

 `Optional` **product\_type\_count**: `number`

The count of product types

#### Defined in

[packages/medusa/src/models/tax-rate.ts:84](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L84)

___

### product\_types

 **product\_types**: [`ProductType`](ProductType.md)[]

The details of the product types that belong to this tax rate.

#### Defined in

[packages/medusa/src/models/tax-rate.ts:66](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L66)

___

### products

 **products**: [`Product`](Product.md)[]

The details of the products that belong to this tax rate.

#### Defined in

[packages/medusa/src/models/tax-rate.ts:52](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L52)

___

### rate

 **rate**: ``null`` \| `number`

The numeric rate to charge

#### Defined in

[packages/medusa/src/models/tax-rate.ts:22](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L22)

___

### region

 **region**: [`Region`](Region.md)

The details of the region that the rate belongs to.

#### Defined in

[packages/medusa/src/models/tax-rate.ts:35](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L35)

___

### region\_id

 **region\_id**: `string`

The ID of the region that the rate belongs to.

#### Defined in

[packages/medusa/src/models/tax-rate.ts:31](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L31)

___

### shipping\_option\_count

 `Optional` **shipping\_option\_count**: `number`

The count of shipping options

#### Defined in

[packages/medusa/src/models/tax-rate.ts:85](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L85)

___

### shipping\_options

 **shipping\_options**: [`ShippingOption`](ShippingOption.md)[]

The details of the shipping options that belong to this tax rate.

#### Defined in

[packages/medusa/src/models/tax-rate.ts:80](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L80)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[BaseEntity](BaseEntity.md).[updated_at](BaseEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/tax-rate.ts:91](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-rate.ts#L91)
