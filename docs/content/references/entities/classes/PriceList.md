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

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customer\_groups

• **customer\_groups**: [`CustomerGroup`](CustomerGroup.md)[]

#### Defined in

[models/price-list.ts:54](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/price-list.ts#L54)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### description

• **description**: `string`

#### Defined in

[models/price-list.ts:23](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/price-list.ts#L23)

___

### ends\_at

• **ends\_at**: ``null`` \| `Date`

#### Defined in

[models/price-list.ts:38](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/price-list.ts#L38)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### name

• **name**: `string`

#### Defined in

[models/price-list.ts:20](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/price-list.ts#L20)

___

### prices

• **prices**: [`MoneyAmount`](MoneyAmount.md)[]

#### Defined in

[models/price-list.ts:59](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/price-list.ts#L59)

___

### starts\_at

• **starts\_at**: ``null`` \| `Date`

#### Defined in

[models/price-list.ts:35](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/price-list.ts#L35)

___

### status

• **status**: `PriceListStatus`

#### Defined in

[models/price-list.ts:29](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/price-list.ts#L29)

___

### type

• **type**: `PriceListType`

#### Defined in

[models/price-list.ts:26](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/price-list.ts#L26)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `undefined` \| `void`

#### Returns

`undefined` \| `void`

#### Defined in

[models/price-list.ts:61](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/price-list.ts#L61)
