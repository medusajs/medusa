# Region

A region holds settings specific to a geographical location, including the currency, tax rates, and fulfillment and payment providers. A Region can consist of multiple countries to accomodate common shopping settings across countries.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`Region`**

## Constructors

### constructor

**new Region**()

A region holds settings specific to a geographical location, including the currency, tax rates, and fulfillment and payment providers. A Region can consist of multiple countries to accomodate common shopping settings across countries.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### automatic\_taxes

 **automatic\_taxes**: `boolean` = `true`

Whether taxes should be automated in this region.

#### Defined in

[packages/medusa/src/models/region.ts:51](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L51)

___

### countries

 **countries**: [`Country`](Country.md)[]

The details of the countries included in this region.

#### Defined in

[packages/medusa/src/models/region.ts:54](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L54)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

 **currency**: [`Currency`](Currency.md)

The details of the currency used in the region.

#### Defined in

[packages/medusa/src/models/region.ts:36](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L36)

___

### currency\_code

 **currency\_code**: `string`

The three character currency code used in the region.

#### Defined in

[packages/medusa/src/models/region.ts:32](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L32)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### fulfillment\_providers

 **fulfillment\_providers**: [`FulfillmentProvider`](FulfillmentProvider.md)[]

The details of the fulfillment providers that can be used to fulfill items of orders and similar resources in the region.

#### Defined in

[packages/medusa/src/models/region.ts:93](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L93)

___

### gift\_cards\_taxable

 **gift\_cards\_taxable**: `boolean` = `true`

Whether the gift cards are taxable or not in this region.

#### Defined in

[packages/medusa/src/models/region.ts:48](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L48)

___

### id

 **id**: `string`

The region's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### includes\_tax

 **includes\_tax**: `boolean`

Whether the prices for the region include tax

#### Defined in

[packages/medusa/src/models/region.ts:99](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L99)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/region.ts:96](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L96)

___

### name

 **name**: `string`

The name of the region as displayed to the customer. If the Region only has one country it is recommended to write the country name.

#### Defined in

[packages/medusa/src/models/region.ts:28](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L28)

___

### payment\_providers

 **payment\_providers**: [`PaymentProvider`](PaymentProvider.md)[]

The details of the payment providers that can be used to process payments in the region.

#### Defined in

[packages/medusa/src/models/region.ts:77](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L77)

___

### tax\_code

 **tax\_code**: `string`

The tax code used on purchases in the Region. This may be used by other systems for accounting purposes.

#### Defined in

[packages/medusa/src/models/region.ts:45](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L45)

___

### tax\_provider

 **tax\_provider**: [`TaxProvider`](TaxProvider.md)

The details of the tax provider used in the region.

#### Defined in

[packages/medusa/src/models/region.ts:61](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L61)

___

### tax\_provider\_id

 **tax\_provider\_id**: ``null`` \| `string`

The ID of the tax provider used in this region

#### Defined in

[packages/medusa/src/models/region.ts:57](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L57)

___

### tax\_rate

 **tax\_rate**: `number`

The tax rate that should be charged on purchases in the Region.

#### Defined in

[packages/medusa/src/models/region.ts:39](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L39)

___

### tax\_rates

 **tax\_rates**: ``null`` \| [`TaxRate`](TaxRate.md)[]

The details of the tax rates used in the region, aside from the default rate.

#### Defined in

[packages/medusa/src/models/region.ts:42](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L42)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/region.ts:105](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/region.ts#L105)
