---
displayed_sidebar: entitiesSidebar
---

# Class: PriceList

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`PriceList`**

## Constructors

### constructor

• **new PriceList**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customer\_groups

• **customer\_groups**: [`CustomerGroup`](CustomerGroup.md)[]

#### Defined in

[models/price-list.ts:56](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/price-list.ts#L56)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### description

• **description**: `string`

#### Defined in

[models/price-list.ts:25](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/price-list.ts#L25)

___

### ends\_at

• **ends\_at**: ``null`` \| `Date`

#### Defined in

[models/price-list.ts:40](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/price-list.ts#L40)

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

[models/price-list.ts:64](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/price-list.ts#L64)

___

### name

• **name**: `string`

#### Defined in

[models/price-list.ts:22](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/price-list.ts#L22)

___

### prices

• **prices**: [`MoneyAmount`](MoneyAmount.md)[]

#### Defined in

[models/price-list.ts:61](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/price-list.ts#L61)

___

### starts\_at

• **starts\_at**: ``null`` \| `Date`

#### Defined in

[models/price-list.ts:37](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/price-list.ts#L37)

___

### status

• **status**: `PriceListStatus`

#### Defined in

[models/price-list.ts:31](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/price-list.ts#L31)

___

### type

• **type**: `PriceListType`

#### Defined in

[models/price-list.ts:28](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/price-list.ts#L28)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `undefined` \| `void`

#### Returns

`undefined` \| `void`

#### Defined in

[models/price-list.ts:66](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/price-list.ts#L66)
