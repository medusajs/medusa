# ShippingMethodTaxLine

A Shipping Method Tax Line represents the taxes applied on a shipping method in a cart.

## Hierarchy

- [`TaxLine`](TaxLine.md)

  ↳ **`ShippingMethodTaxLine`**

## Constructors

### constructor

**new ShippingMethodTaxLine**()

A Shipping Method Tax Line represents the taxes applied on a shipping method in a cart.

#### Inherited from

[TaxLine](TaxLine.md).[constructor](TaxLine.md#constructor)

## Properties

### code

 **code**: ``null`` \| `string`

A code to identify the tax type by

#### Inherited from

[TaxLine](TaxLine.md).[code](TaxLine.md#code)

#### Defined in

[packages/medusa/src/models/tax-line.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tax-line.ts#L13)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[TaxLine](TaxLine.md).[created_at](TaxLine.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### id

 **id**: `string`

The line item tax line's ID

#### Inherited from

[TaxLine](TaxLine.md).[id](TaxLine.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Inherited from

[TaxLine](TaxLine.md).[metadata](TaxLine.md#metadata)

#### Defined in

[packages/medusa/src/models/tax-line.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tax-line.ts#L16)

___

### name

 **name**: `string`

A human friendly name for the tax

#### Inherited from

[TaxLine](TaxLine.md).[name](TaxLine.md#name)

#### Defined in

[packages/medusa/src/models/tax-line.ts:10](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tax-line.ts#L10)

___

### rate

 **rate**: `number`

The numeric rate to charge tax by

#### Inherited from

[TaxLine](TaxLine.md).[rate](TaxLine.md#rate)

#### Defined in

[packages/medusa/src/models/tax-line.ts:7](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tax-line.ts#L7)

___

### shipping\_method

 **shipping\_method**: [`ShippingMethod`](ShippingMethod.md)

The details of the associated shipping method.

#### Defined in

[packages/medusa/src/models/shipping-method-tax-line.ts:24](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-method-tax-line.ts#L24)

___

### shipping\_method\_id

 **shipping\_method\_id**: `string`

The ID of the line item

#### Defined in

[packages/medusa/src/models/shipping-method-tax-line.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-method-tax-line.ts#L20)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[TaxLine](TaxLine.md).[updated_at](TaxLine.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/shipping-method-tax-line.ts:30](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/shipping-method-tax-line.ts#L30)
