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

[models/money-amount.ts:27](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L27)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/money-amount.ts:24](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L24)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/money-amount.ts:20](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L20)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### max\_quantity

• **max\_quantity**: ``null`` \| `number`

#### Defined in

[models/money-amount.ts:33](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L33)

___

### min\_quantity

• **min\_quantity**: ``null`` \| `number`

#### Defined in

[models/money-amount.ts:30](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L30)

___

### price\_list

• **price\_list**: ``null`` \| [`PriceList`](PriceList.md)

#### Defined in

[models/money-amount.ts:43](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L43)

___

### price\_list\_id

• **price\_list\_id**: ``null`` \| `string`

#### Defined in

[models/money-amount.ts:36](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L36)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/money-amount.ts:61](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L61)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/money-amount.ts:57](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L57)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

• **variant**: [`ProductVariant`](ProductVariant.md)

#### Defined in

[models/money-amount.ts:53](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L53)

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

[models/money-amount.ts:47](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L47)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `undefined` \| `void`

#### Returns

`undefined` \| `void`

#### Defined in

[models/money-amount.ts:63](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/money-amount.ts#L63)
