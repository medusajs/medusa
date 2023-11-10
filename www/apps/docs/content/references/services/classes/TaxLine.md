# TaxLine

A tax line represents the taxes amount applied to a line item.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`TaxLine`**

  ↳↳ [`LineItemTaxLine`](LineItemTaxLine.md)

  ↳↳ [`ShippingMethodTaxLine`](ShippingMethodTaxLine.md)

## Constructors

### constructor

**new TaxLine**()

A tax line represents the taxes amount applied to a line item.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### code

 **code**: ``null`` \| `string`

A code to identify the tax type by

#### Defined in

[packages/medusa/src/models/tax-line.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-line.ts#L13)

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

The tax line's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/tax-line.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-line.ts#L16)

___

### name

 **name**: `string`

A human friendly name for the tax

#### Defined in

[packages/medusa/src/models/tax-line.ts:10](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-line.ts#L10)

___

### rate

 **rate**: `number`

The numeric rate to charge tax by

#### Defined in

[packages/medusa/src/models/tax-line.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/tax-line.ts#L7)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[BaseEntity](BaseEntity.md).[updated_at](BaseEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)
