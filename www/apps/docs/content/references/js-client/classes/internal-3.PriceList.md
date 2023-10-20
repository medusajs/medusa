---
displayed_sidebar: jsClientSidebar
---

# Class: PriceList

[internal](../modules/internal-3.md).PriceList

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`PriceList`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/price-list.d.ts:15

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[created_at](internal-1.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### customer\_groups

• **customer\_groups**: [`CustomerGroup`](internal-3.CustomerGroup.md)[]

#### Defined in

packages/medusa/dist/models/price-list.d.ts:12

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[deleted_at](internal-1.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### description

• **description**: `string`

#### Defined in

packages/medusa/dist/models/price-list.d.ts:7

___

### ends\_at

• **ends\_at**: ``null`` \| `Date`

#### Defined in

packages/medusa/dist/models/price-list.d.ts:11

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

packages/medusa/dist/models/price-list.d.ts:14

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/models/price-list.d.ts:6

___

### prices

• **prices**: [`MoneyAmount`](internal-3.MoneyAmount.md)[]

#### Defined in

packages/medusa/dist/models/price-list.d.ts:13

___

### starts\_at

• **starts\_at**: ``null`` \| `Date`

#### Defined in

packages/medusa/dist/models/price-list.d.ts:10

___

### status

• **status**: [`PriceListStatus`](../enums/internal-3.PriceListStatus.md)

#### Defined in

packages/medusa/dist/models/price-list.d.ts:9

___

### type

• **type**: [`PriceListType`](../enums/internal-3.PriceListType.md)

#### Defined in

packages/medusa/dist/models/price-list.d.ts:8

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
