---
displayed_sidebar: jsClientSidebar
---

# Class: Region

[internal](../modules/internal-3.md).Region

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`Region`**

## Properties

### automatic\_taxes

• **automatic\_taxes**: `boolean`

#### Defined in

packages/medusa/dist/models/region.d.ts:16

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/region.d.ts:24

___

### countries

• **countries**: [`Country`](internal-3.Country.md)[]

#### Defined in

packages/medusa/dist/models/region.d.ts:17

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[created_at](internal-1.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### currency

• **currency**: [`Currency`](internal-3.Currency.md)

#### Defined in

packages/medusa/dist/models/region.d.ts:11

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

packages/medusa/dist/models/region.d.ts:10

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[deleted_at](internal-1.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### fulfillment\_providers

• **fulfillment\_providers**: [`FulfillmentProvider`](internal-3.FulfillmentProvider.md)[]

#### Defined in

packages/medusa/dist/models/region.d.ts:21

___

### gift\_cards\_taxable

• **gift\_cards\_taxable**: `boolean`

#### Defined in

packages/medusa/dist/models/region.d.ts:15

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

packages/medusa/dist/models/region.d.ts:23

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/region.d.ts:22

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/models/region.d.ts:9

___

### payment\_providers

• **payment\_providers**: [`PaymentProvider`](internal-3.PaymentProvider.md)[]

#### Defined in

packages/medusa/dist/models/region.d.ts:20

___

### tax\_code

• **tax\_code**: `string`

#### Defined in

packages/medusa/dist/models/region.d.ts:14

___

### tax\_provider

• **tax\_provider**: [`TaxProvider`](internal-3.TaxProvider.md)

#### Defined in

packages/medusa/dist/models/region.d.ts:19

___

### tax\_provider\_id

• **tax\_provider\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/region.d.ts:18

___

### tax\_rate

• **tax\_rate**: `number`

#### Defined in

packages/medusa/dist/models/region.d.ts:12

___

### tax\_rates

• **tax\_rates**: ``null`` \| [`TaxRate`](internal-3.TaxRate.md)[]

#### Defined in

packages/medusa/dist/models/region.d.ts:13

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
