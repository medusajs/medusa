---
displayed_sidebar: entitiesSidebar
---

# Class: ShippingOption

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`ShippingOption`**

## Constructors

### constructor

• **new ShippingOption**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### admin\_only

• **admin\_only**: `boolean`

#### Defined in

[models/shipping-option.ts:67](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L67)

___

### amount

• **amount**: ``null`` \| `number`

#### Defined in

[models/shipping-option.ts:61](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L61)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/shipping-option.ts:75](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L75)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### includes\_tax

• **includes\_tax**: `boolean`

#### Defined in

[models/shipping-option.ts:81](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L81)

___

### is\_return

• **is\_return**: `boolean`

#### Defined in

[models/shipping-option.ts:64](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L64)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/shipping-option.ts:78](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L78)

___

### name

• **name**: `string`

#### Defined in

[models/shipping-option.ts:31](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L31)

___

### price\_type

• **price\_type**: [`ShippingOptionPriceType`](../enums/ShippingOptionPriceType.md)

#### Defined in

[models/shipping-option.ts:58](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L58)

___

### profile

• **profile**: [`ShippingProfile`](ShippingProfile.md)

#### Defined in

[models/shipping-option.ts:47](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L47)

___

### profile\_id

• **profile\_id**: `string`

#### Defined in

[models/shipping-option.ts:43](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L43)

___

### provider

• **provider**: [`FulfillmentProvider`](FulfillmentProvider.md)

#### Defined in

[models/shipping-option.ts:55](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L55)

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

[models/shipping-option.ts:51](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L51)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/shipping-option.ts:39](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L39)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/shipping-option.ts:35](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L35)

___

### requirements

• **requirements**: [`ShippingOptionRequirement`](ShippingOptionRequirement.md)[]

#### Defined in

[models/shipping-option.ts:72](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L72)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/shipping-option.ts:83](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/shipping-option.ts#L83)
