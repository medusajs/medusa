---
displayed_sidebar: entitiesSidebar
---

# Class: GiftCard

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`GiftCard`**

## Constructors

### constructor

• **new GiftCard**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### balance

• **balance**: `number`

#### Defined in

[models/gift-card.ts:26](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/gift-card.ts#L26)

___

### code

• **code**: `string`

#### Defined in

[models/gift-card.ts:20](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/gift-card.ts#L20)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### ends\_at

• **ends\_at**: `Date`

#### Defined in

[models/gift-card.ts:51](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/gift-card.ts#L51)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### is\_disabled

• **is\_disabled**: `boolean`

#### Defined in

[models/gift-card.ts:45](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/gift-card.ts#L45)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/gift-card.ts:54](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/gift-card.ts#L54)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/gift-card.ts:42](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/gift-card.ts#L42)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/gift-card.ts:38](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/gift-card.ts#L38)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/gift-card.ts:34](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/gift-card.ts#L34)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/gift-card.ts:30](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/gift-card.ts#L30)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### value

• **value**: `number`

#### Defined in

[models/gift-card.ts:23](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/gift-card.ts#L23)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/gift-card.ts:56](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/gift-card.ts#L56)
