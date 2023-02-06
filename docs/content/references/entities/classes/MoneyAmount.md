---
displayed_sidebar: entitiesSidebar
---

# Class: MoneyAmount

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`MoneyAmount`**

## Constructors

### constructor

• **new MoneyAmount**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### amount

• **amount**: `number`

#### Defined in

[models/money-amount.ts:28](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L28)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• `Optional` **currency**: [`Currency`](Currency.md)

#### Defined in

[models/money-amount.ts:25](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L25)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/money-amount.ts:21](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L21)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### max\_quantity

• **max\_quantity**: ``null`` \| `number`

#### Defined in

[models/money-amount.ts:34](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L34)

___

### min\_quantity

• **min\_quantity**: ``null`` \| `number`

#### Defined in

[models/money-amount.ts:31](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L31)

___

### price\_list

• **price\_list**: ``null`` \| [`PriceList`](PriceList.md)

#### Defined in

[models/money-amount.ts:44](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L44)

___

### price\_list\_id

• **price\_list\_id**: ``null`` \| `string`

#### Defined in

[models/money-amount.ts:37](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L37)

___

### region

• `Optional` **region**: [`Region`](Region.md)

#### Defined in

[models/money-amount.ts:62](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L62)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/money-amount.ts:58](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L58)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

• **variant**: [`ProductVariant`](ProductVariant.md)

#### Defined in

[models/money-amount.ts:54](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L54)

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

[models/money-amount.ts:48](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L48)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `undefined` \| `void`

#### Returns

`undefined` \| `void`

#### Defined in

[models/money-amount.ts:64](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/money-amount.ts#L64)
