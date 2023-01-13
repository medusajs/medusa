---
displayed_sidebar: entitiesSidebar
---

# Class: TaxRate

## Hierarchy

- `BaseEntity`

  ↳ **`TaxRate`**

## Constructors

### constructor

• **new TaxRate**()

#### Inherited from

BaseEntity.constructor

## Properties

### code

• **code**: ``null`` \| `string`

#### Defined in

[models/tax-rate.ts:25](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L25)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/tax-rate.ts:38](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L38)

___

### name

• **name**: `string`

#### Defined in

[models/tax-rate.ts:28](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L28)

___

### product\_count

• `Optional` **product\_count**: `number`

#### Defined in

[models/tax-rate.ts:83](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L83)

___

### product\_type\_count

• `Optional` **product\_type\_count**: `number`

#### Defined in

[models/tax-rate.ts:84](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L84)

___

### product\_types

• **product\_types**: [`ProductType`](ProductType.md)[]

#### Defined in

[models/tax-rate.ts:66](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L66)

___

### products

• **products**: [`Product`](Product.md)[]

#### Defined in

[models/tax-rate.ts:52](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L52)

___

### rate

• **rate**: ``null`` \| `number`

#### Defined in

[models/tax-rate.ts:22](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L22)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/tax-rate.ts:35](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L35)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/tax-rate.ts:31](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L31)

___

### shipping\_option\_count

• `Optional` **shipping\_option\_count**: `number`

#### Defined in

[models/tax-rate.ts:85](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L85)

___

### shipping\_options

• **shipping\_options**: [`ShippingOption`](ShippingOption.md)[]

#### Defined in

[models/tax-rate.ts:80](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L80)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/tax-rate.ts:87](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-rate.ts#L87)
