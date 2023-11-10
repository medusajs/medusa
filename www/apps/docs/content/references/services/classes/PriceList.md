# PriceList

A Price List represents a set of prices that override the default price for one or more product variants.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`PriceList`**

## Constructors

### constructor

**new PriceList**()

A Price List represents a set of prices that override the default price for one or more product variants.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customer\_groups

 **customer\_groups**: [`CustomerGroup`](CustomerGroup.md)[]

The details of the customer groups that the Price List can apply to.

#### Defined in

[packages/medusa/src/models/price-list.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/price-list.ts#L56)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### description

 **description**: `string`

The price list's description

#### Defined in

[packages/medusa/src/models/price-list.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/price-list.ts#L25)

___

### ends\_at

 **ends\_at**: ``null`` \| `Date`

The date with timezone that the Price List stops being valid.

#### Defined in

[packages/medusa/src/models/price-list.ts:40](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/price-list.ts#L40)

___

### id

 **id**: `string`

The price list's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### includes\_tax

 **includes\_tax**: `boolean`

Whether the price list prices include tax

#### Defined in

[packages/medusa/src/models/price-list.ts:64](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/price-list.ts#L64)

___

### name

 **name**: `string`

The price list's name

#### Defined in

[packages/medusa/src/models/price-list.ts:22](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/price-list.ts#L22)

___

### prices

 **prices**: [`MoneyAmount`](MoneyAmount.md)[]

The prices that belong to the price list, represented as a Money Amount.

#### Defined in

[packages/medusa/src/models/price-list.ts:61](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/price-list.ts#L61)

___

### starts\_at

 **starts\_at**: ``null`` \| `Date`

The date with timezone that the Price List starts being valid.

#### Defined in

[packages/medusa/src/models/price-list.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/price-list.ts#L37)

___

### status

 **status**: [`PriceListStatus`](../enums/PriceListStatus.md) = `draft`

The status of the Price List

#### Defined in

[packages/medusa/src/models/price-list.ts:31](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/price-list.ts#L31)

___

### type

 **type**: [`PriceListType`](../enums/PriceListType.md) = `sale`

The type of Price List. This can be one of either `sale` or `override`.

#### Defined in

[packages/medusa/src/models/price-list.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/price-list.ts#L28)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `undefined` \| `void`

#### Returns

`undefined` \| `void`

-`undefined \| void`: (optional) 

#### Defined in

[packages/medusa/src/models/price-list.ts:70](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/price-list.ts#L70)
