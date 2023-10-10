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

[models/money-amount.ts:32](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L32)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• `Optional` **currency**: [`Currency`](Currency.md)

#### Defined in

[models/money-amount.ts:29](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L29)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/money-amount.ts:25](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L25)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### max\_quantity

• **max\_quantity**: ``null`` \| `number`

#### Defined in

[models/money-amount.ts:38](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L38)

___

### min\_quantity

• **min\_quantity**: ``null`` \| `number`

#### Defined in

[models/money-amount.ts:35](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L35)

___

### price\_list

• **price\_list**: ``null`` \| [`PriceList`](PriceList.md)

#### Defined in

[models/money-amount.ts:48](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L48)

___

### price\_list\_id

• **price\_list\_id**: ``null`` \| `string`

#### Defined in

[models/money-amount.ts:41](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L41)

___

### region

• `Optional` **region**: [`Region`](Region.md)

#### Defined in

[models/money-amount.ts:76](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L76)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/money-amount.ts:72](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L72)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

• **variant**: [`ProductVariant`](ProductVariant.md)

#### Defined in

[models/money-amount.ts:66](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L66)

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

[models/money-amount.ts:68](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L68)

___

### variants

• **variants**: [`ProductVariant`](ProductVariant.md)[]

#### Defined in

[models/money-amount.ts:64](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L64)

## Methods

### afterLoad

▸ `Private` **afterLoad**(): `void`

#### Returns

`void`

#### Defined in

[models/money-amount.ts:99](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L99)

___

### beforeInsert

▸ `Private` **beforeInsert**(): `undefined` \| `void`

#### Returns

`undefined` \| `void`

#### Defined in

[models/money-amount.ts:79](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L79)

___

### beforeUpdate

▸ `Private` **beforeUpdate**(): `void`

#### Returns

`void`

#### Defined in

[models/money-amount.ts:90](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/money-amount.ts#L90)
