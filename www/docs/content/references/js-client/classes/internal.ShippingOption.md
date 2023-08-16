---
displayed_sidebar: jsClientSidebar
---

# Class: ShippingOption

[internal](../modules/internal.md).ShippingOption

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`ShippingOption`**

## Properties

### admin\_only

• **admin\_only**: `boolean`

#### Defined in

medusa/dist/models/shipping-option.d.ts:21

___

### amount

• **amount**: ``null`` \| `number`

#### Defined in

medusa/dist/models/shipping-option.d.ts:19

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/shipping-option.d.ts:26

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/shipping-option.d.ts:23

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### includes\_tax

• **includes\_tax**: `boolean`

#### Defined in

medusa/dist/models/shipping-option.d.ts:25

___

### is\_return

• **is\_return**: `boolean`

#### Defined in

medusa/dist/models/shipping-option.d.ts:20

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/shipping-option.d.ts:24

___

### name

• **name**: `string`

#### Defined in

medusa/dist/models/shipping-option.d.ts:11

___

### price\_type

• **price\_type**: [`ShippingOptionPriceType`](../enums/internal.ShippingOptionPriceType.md)

#### Defined in

medusa/dist/models/shipping-option.d.ts:18

___

### profile

• **profile**: [`ShippingProfile`](internal.ShippingProfile.md)

#### Defined in

medusa/dist/models/shipping-option.d.ts:15

___

### profile\_id

• **profile\_id**: `string`

#### Defined in

medusa/dist/models/shipping-option.d.ts:14

___

### provider

• **provider**: [`FulfillmentProvider`](internal.FulfillmentProvider.md)

#### Defined in

medusa/dist/models/shipping-option.d.ts:17

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

medusa/dist/models/shipping-option.d.ts:16

___

### region

• **region**: [`Region`](internal.Region.md)

#### Defined in

medusa/dist/models/shipping-option.d.ts:13

___

### region\_id

• **region\_id**: `string`

#### Defined in

medusa/dist/models/shipping-option.d.ts:12

___

### requirements

• **requirements**: [`ShippingOptionRequirement`](internal.ShippingOptionRequirement.md)[]

#### Defined in

medusa/dist/models/shipping-option.d.ts:22

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
