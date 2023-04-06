---
displayed_sidebar: jsClientSidebar
---

# Class: MoneyAmount

[internal](../modules/internal.md).MoneyAmount

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`MoneyAmount`**

## Properties

### amount

• **amount**: `number`

#### Defined in

medusa/dist/models/money-amount.d.ts:9

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/money-amount.d.ts:18

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### currency

• `Optional` **currency**: [`Currency`](internal.Currency.md)

#### Defined in

medusa/dist/models/money-amount.d.ts:8

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

medusa/dist/models/money-amount.d.ts:7

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### max\_quantity

• **max\_quantity**: ``null`` \| `number`

#### Defined in

medusa/dist/models/money-amount.d.ts:11

___

### min\_quantity

• **min\_quantity**: ``null`` \| `number`

#### Defined in

medusa/dist/models/money-amount.d.ts:10

___

### price\_list

• **price\_list**: ``null`` \| [`PriceList`](internal.PriceList.md)

#### Defined in

medusa/dist/models/money-amount.d.ts:13

___

### price\_list\_id

• **price\_list\_id**: ``null`` \| `string`

#### Defined in

medusa/dist/models/money-amount.d.ts:12

___

### region

• `Optional` **region**: [`Region`](internal.Region.md)

#### Defined in

medusa/dist/models/money-amount.d.ts:17

___

### region\_id

• **region\_id**: `string`

#### Defined in

medusa/dist/models/money-amount.d.ts:16

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7

___

### variant

• **variant**: [`ProductVariant`](internal.ProductVariant.md)

#### Defined in

medusa/dist/models/money-amount.d.ts:15

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

medusa/dist/models/money-amount.d.ts:14
