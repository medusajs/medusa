---
displayed_sidebar: entitiesSidebar
---

# Class: Region

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`Region`**

## Constructors

### constructor

• **new Region**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### automatic\_taxes

• **automatic\_taxes**: `boolean`

#### Defined in

[models/region.ts:51](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L51)

___

### countries

• **countries**: [`Country`](Country.md)[]

#### Defined in

[models/region.ts:54](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L54)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/region.ts:36](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L36)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/region.ts:32](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L32)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### fulfillment\_providers

• **fulfillment\_providers**: [`FulfillmentProvider`](FulfillmentProvider.md)[]

#### Defined in

[models/region.ts:95](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L95)

___

### gift\_cards\_taxable

• **gift\_cards\_taxable**: `boolean`

#### Defined in

[models/region.ts:48](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L48)

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

[models/region.ts:101](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L101)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/region.ts:98](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L98)

___

### name

• **name**: `string`

#### Defined in

[models/region.ts:28](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L28)

___

### payment\_providers

• **payment\_providers**: [`PaymentProvider`](PaymentProvider.md)[]

#### Defined in

[models/region.ts:78](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L78)

___

### tax\_code

• **tax\_code**: `string`

#### Defined in

[models/region.ts:45](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L45)

___

### tax\_provider

• **tax\_provider**: [`TaxProvider`](TaxProvider.md)

#### Defined in

[models/region.ts:61](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L61)

___

### tax\_provider\_id

• **tax\_provider\_id**: ``null`` \| `string`

#### Defined in

[models/region.ts:57](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L57)

___

### tax\_rate

• **tax\_rate**: `number`

#### Defined in

[models/region.ts:39](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L39)

___

### tax\_rates

• **tax\_rates**: ``null`` \| [`TaxRate`](TaxRate.md)[]

#### Defined in

[models/region.ts:42](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L42)

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

[models/region.ts:103](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/region.ts#L103)
