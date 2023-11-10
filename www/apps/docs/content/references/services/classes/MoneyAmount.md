# MoneyAmount

A Money Amount represent a price amount, for example, a product variant's price or a price in a price list. Each Money Amount either has a Currency or Region associated with it to indicate the pricing in a given Currency or, for fully region-based pricing, the given price in a specific Region. If region-based pricing is used, the amount will be in the currency defined for the Region.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`MoneyAmount`**

## Constructors

### constructor

**new MoneyAmount**()

A Money Amount represent a price amount, for example, a product variant's price or a price in a price list. Each Money Amount either has a Currency or Region associated with it to indicate the pricing in a given Currency or, for fully region-based pricing, the given price in a specific Region. If region-based pricing is used, the amount will be in the currency defined for the Region.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### amount

 **amount**: `number`

The amount in the smallest currecny unit (e.g. cents 100 cents to charge $1) that the Product Variant will cost.

#### Defined in

[packages/medusa/src/models/money-amount.ts:32](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L32)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

 `Optional` **currency**: [`Currency`](Currency.md)

The details of the currency that the money amount may belong to.

#### Defined in

[packages/medusa/src/models/money-amount.ts:29](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L29)

___

### currency\_code

 **currency\_code**: `string`

The 3 character currency code that the money amount may belong to.

#### Defined in

[packages/medusa/src/models/money-amount.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L25)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

 **id**: `string`

The money amount's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### max\_quantity

 **max\_quantity**: ``null`` \| `number`

The maximum quantity that the Money Amount applies to. If this value is not set, the Money Amount applies to all quantities.

#### Defined in

[packages/medusa/src/models/money-amount.ts:38](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L38)

___

### min\_quantity

 **min\_quantity**: ``null`` \| `number`

The minimum quantity that the Money Amount applies to. If this value is not set, the Money Amount applies to all quantities.

#### Defined in

[packages/medusa/src/models/money-amount.ts:35](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L35)

___

### price\_list

 **price\_list**: ``null`` \| [`PriceList`](PriceList.md)

The details of the price list that the money amount may belong to.

#### Defined in

[packages/medusa/src/models/money-amount.ts:48](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L48)

___

### price\_list\_id

 **price\_list\_id**: ``null`` \| `string`

The ID of the price list that the money amount may belong to.

#### Defined in

[packages/medusa/src/models/money-amount.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L41)

___

### region

 `Optional` **region**: [`Region`](Region.md)

The details of the region that the money amount may belong to.

#### Defined in

[packages/medusa/src/models/money-amount.ts:76](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L76)

___

### region\_id

 **region\_id**: `string`

The region's ID

#### Defined in

[packages/medusa/src/models/money-amount.ts:72](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L72)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

 **variant**: [`ProductVariant`](ProductVariant.md)

The details of the product variant that the money amount may belong to.

#### Defined in

[packages/medusa/src/models/money-amount.ts:66](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L66)

___

### variant\_id

 **variant\_id**: `string`

The ID of the Product Variant contained in the Line Item.

#### Defined in

[packages/medusa/src/models/money-amount.ts:68](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L68)

___

### variants

 **variants**: [`ProductVariant`](ProductVariant.md)[]

#### Defined in

[packages/medusa/src/models/money-amount.ts:64](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L64)

## Methods

### afterLoad

`Private` **afterLoad**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/money-amount.ts:108](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L108)

___

### beforeInsert

`Private` **beforeInsert**(): `undefined` \| `void`

#### Returns

`undefined` \| `void`

-`undefined \| void`: (optional) 

#### Defined in

[packages/medusa/src/models/money-amount.ts:82](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L82)

___

### beforeUpdate

`Private` **beforeUpdate**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/money-amount.ts:96](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/money-amount.ts#L96)
