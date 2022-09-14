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

[models/region.ts:49](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L49)

___

### countries

• **countries**: [`Country`](Country.md)[]

#### Defined in

[models/region.ts:52](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L52)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/region.ts:34](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L34)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/region.ts:30](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L30)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### fulfillment\_providers

• **fulfillment\_providers**: [`FulfillmentProvider`](FulfillmentProvider.md)[]

#### Defined in

[models/region.ts:93](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L93)

___

### gift\_cards\_taxable

• **gift\_cards\_taxable**: `boolean`

#### Defined in

[models/region.ts:46](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L46)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### includes\_tax

• **includes\_tax**: `boolean`

#### Defined in

[models/region.ts:99](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L99)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/region.ts:96](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L96)

___

### name

• **name**: `string`

#### Defined in

[models/region.ts:27](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L27)

___

### payment\_providers

• **payment\_providers**: [`PaymentProvider`](PaymentProvider.md)[]

#### Defined in

[models/region.ts:76](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L76)

___

### tax\_code

• **tax\_code**: `string`

#### Defined in

[models/region.ts:43](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L43)

___

### tax\_provider

• **tax\_provider**: [`TaxProvider`](TaxProvider.md)

#### Defined in

[models/region.ts:59](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L59)

___

### tax\_provider\_id

• **tax\_provider\_id**: ``null`` \| `string`

#### Defined in

[models/region.ts:55](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L55)

___

### tax\_rate

• **tax\_rate**: `number`

#### Defined in

[models/region.ts:37](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L37)

___

### tax\_rates

• **tax\_rates**: ``null`` \| [`TaxRate`](TaxRate.md)[]

#### Defined in

[models/region.ts:40](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L40)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/region.ts:101](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/models/region.ts#L101)
