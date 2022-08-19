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

[models/shipping-option.ts:65](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L65)

___

### amount

• **amount**: ``null`` \| `number`

#### Defined in

[models/shipping-option.ts:59](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L59)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/shipping-option.ts:73](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L73)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### is\_return

• **is\_return**: `boolean`

#### Defined in

[models/shipping-option.ts:62](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L62)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/shipping-option.ts:76](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L76)

___

### name

• **name**: `string`

#### Defined in

[models/shipping-option.ts:29](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L29)

___

### price\_type

• **price\_type**: [`ShippingOptionPriceType`](../enums/ShippingOptionPriceType.md)

#### Defined in

[models/shipping-option.ts:56](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L56)

___

### profile

• **profile**: [`ShippingProfile`](ShippingProfile.md)

#### Defined in

[models/shipping-option.ts:45](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L45)

___

### profile\_id

• **profile\_id**: `string`

#### Defined in

[models/shipping-option.ts:41](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L41)

___

### provider

• **provider**: [`FulfillmentProvider`](FulfillmentProvider.md)

#### Defined in

[models/shipping-option.ts:53](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L53)

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

[models/shipping-option.ts:49](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L49)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/shipping-option.ts:37](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L37)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/shipping-option.ts:33](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L33)

___

### requirements

• **requirements**: [`ShippingOptionRequirement`](ShippingOptionRequirement.md)[]

#### Defined in

[models/shipping-option.ts:70](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L70)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/shipping-option.ts:78](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/shipping-option.ts#L78)
