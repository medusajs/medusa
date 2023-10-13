---
displayed_sidebar: jsClientSidebar
---

# Class: MoneyAmount

[internal](../modules/internal-3.md).MoneyAmount

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`MoneyAmount`**

## Properties

### afterLoad

• `Private` **afterLoad**: `any`

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:21

___

### amount

• **amount**: `number`

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:9

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:19

___

### beforeUpdate

• `Private` **beforeUpdate**: `any`

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:20

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[created_at](internal-1.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### currency

• `Optional` **currency**: [`Currency`](internal-3.Currency.md)

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:8

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:7

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[deleted_at](internal-1.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### max\_quantity

• **max\_quantity**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:11

___

### min\_quantity

• **min\_quantity**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:10

___

### price\_list

• **price\_list**: ``null`` \| [`PriceList`](internal-3.PriceList.md)

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:13

___

### price\_list\_id

• **price\_list\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:12

___

### region

• `Optional` **region**: [`Region`](internal-3.Region.md)

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:18

___

### region\_id

• **region\_id**: `string`

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:17

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7

___

### variant

• **variant**: [`ProductVariant`](internal-3.ProductVariant.md)

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:15

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:16

___

### variants

• **variants**: [`ProductVariant`](internal-3.ProductVariant.md)[]

#### Defined in

packages/medusa/dist/models/money-amount.d.ts:14
