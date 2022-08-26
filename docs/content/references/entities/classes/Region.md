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

[models/region.ts:47](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L47)

___

### countries

• **countries**: [`Country`](Country.md)[]

#### Defined in

[models/region.ts:50](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L50)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/region.ts:32](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L32)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/region.ts:28](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L28)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### fulfillment\_providers

• **fulfillment\_providers**: [`FulfillmentProvider`](FulfillmentProvider.md)[]

#### Defined in

[models/region.ts:91](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L91)

___

### gift\_cards\_taxable

• **gift\_cards\_taxable**: `boolean`

#### Defined in

[models/region.ts:44](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L44)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/region.ts:94](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L94)

___

### name

• **name**: `string`

#### Defined in

[models/region.ts:25](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L25)

___

### payment\_providers

• **payment\_providers**: [`PaymentProvider`](PaymentProvider.md)[]

#### Defined in

[models/region.ts:74](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L74)

___

### tax\_code

• **tax\_code**: `string`

#### Defined in

[models/region.ts:41](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L41)

___

### tax\_provider

• **tax\_provider**: [`TaxProvider`](TaxProvider.md)

#### Defined in

[models/region.ts:57](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L57)

___

### tax\_provider\_id

• **tax\_provider\_id**: ``null`` \| `string`

#### Defined in

[models/region.ts:53](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L53)

___

### tax\_rate

• **tax\_rate**: `number`

#### Defined in

[models/region.ts:35](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L35)

___

### tax\_rates

• **tax\_rates**: ``null`` \| [`TaxRate`](TaxRate.md)[]

#### Defined in

[models/region.ts:38](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L38)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/region.ts:96](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/region.ts#L96)
