---
displayed_sidebar: jsClientSidebar
---

# Class: ShippingOption

[internal](../modules/internal-3.md).ShippingOption

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`ShippingOption`**

## Properties

### admin\_only

• **admin\_only**: `boolean`

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:21

___

### amount

• **amount**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:19

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:26

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[created_at](internal-1.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### data

• **data**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:23

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[deleted_at](internal-1.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### includes\_tax

• **includes\_tax**: `boolean`

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:25

___

### is\_return

• **is\_return**: `boolean`

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:20

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:24

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:11

___

### price\_type

• **price\_type**: [`ShippingOptionPriceType`](../enums/internal-3.ShippingOptionPriceType.md)

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:18

___

### profile

• **profile**: [`ShippingProfile`](internal-3.ShippingProfile.md)

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:15

___

### profile\_id

• **profile\_id**: `string`

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:14

___

### provider

• **provider**: [`FulfillmentProvider`](internal-3.FulfillmentProvider.md)

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:17

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:16

___

### region

• **region**: [`Region`](internal-3.Region.md)

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:13

___

### region\_id

• **region\_id**: `string`

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:12

___

### requirements

• **requirements**: [`ShippingOptionRequirement`](internal-3.ShippingOptionRequirement.md)[]

#### Defined in

packages/medusa/dist/models/shipping-option.d.ts:22

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
