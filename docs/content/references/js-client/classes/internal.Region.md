---
displayed_sidebar: jsClientSidebar
---

# Class: Region

[internal](../modules/internal.md).Region

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`Region`**

## Properties

### automatic\_taxes

• **automatic\_taxes**: `boolean`

#### Defined in

medusa/dist/models/region.d.ts:16

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/region.d.ts:24

___

### countries

• **countries**: [`Country`](internal.Country.md)[]

#### Defined in

medusa/dist/models/region.d.ts:17

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### currency

• **currency**: [`Currency`](internal.Currency.md)

#### Defined in

medusa/dist/models/region.d.ts:11

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

medusa/dist/models/region.d.ts:10

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### fulfillment\_providers

• **fulfillment\_providers**: [`FulfillmentProvider`](internal.FulfillmentProvider.md)[]

#### Defined in

medusa/dist/models/region.d.ts:21

___

### gift\_cards\_taxable

• **gift\_cards\_taxable**: `boolean`

#### Defined in

medusa/dist/models/region.d.ts:15

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

medusa/dist/models/region.d.ts:23

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/region.d.ts:22

___

### name

• **name**: `string`

#### Defined in

medusa/dist/models/region.d.ts:9

___

### payment\_providers

• **payment\_providers**: [`PaymentProvider`](internal.PaymentProvider.md)[]

#### Defined in

medusa/dist/models/region.d.ts:20

___

### tax\_code

• **tax\_code**: `string`

#### Defined in

medusa/dist/models/region.d.ts:14

___

### tax\_provider

• **tax\_provider**: [`TaxProvider`](internal.TaxProvider.md)

#### Defined in

medusa/dist/models/region.d.ts:19

___

### tax\_provider\_id

• **tax\_provider\_id**: ``null`` \| `string`

#### Defined in

medusa/dist/models/region.d.ts:18

___

### tax\_rate

• **tax\_rate**: `number`

#### Defined in

medusa/dist/models/region.d.ts:12

___

### tax\_rates

• **tax\_rates**: ``null`` \| [`TaxRate`](internal.TaxRate.md)[]

#### Defined in

medusa/dist/models/region.d.ts:13

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
