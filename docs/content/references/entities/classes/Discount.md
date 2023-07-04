---
displayed_sidebar: entitiesSidebar
---

# Class: Discount

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`Discount`**

## Constructors

### constructor

• **new Discount**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### code

• **code**: `string`

#### Defined in

[models/discount.ts:22](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L22)

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

• **ends\_at**: ``null`` \| `Date`

#### Defined in

[models/discount.ts:52](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L52)

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

[models/discount.ts:36](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L36)

___

### is\_dynamic

• **is\_dynamic**: `boolean`

#### Defined in

[models/discount.ts:25](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L25)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/discount.ts:78](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L78)

___

### parent\_discount

• **parent\_discount**: [`Discount`](Discount.md)

#### Defined in

[models/discount.ts:43](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L43)

___

### parent\_discount\_id

• **parent\_discount\_id**: `string`

#### Defined in

[models/discount.ts:39](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L39)

___

### regions

• **regions**: [`Region`](Region.md)[]

#### Defined in

[models/discount.ts:69](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L69)

___

### rule

• **rule**: [`DiscountRule`](DiscountRule.md)

#### Defined in

[models/discount.ts:33](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L33)

___

### rule\_id

• **rule\_id**: `string`

#### Defined in

[models/discount.ts:29](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L29)

___

### starts\_at

• **starts\_at**: `Date`

#### Defined in

[models/discount.ts:49](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L49)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### usage\_count

• **usage\_count**: `number`

#### Defined in

[models/discount.ts:75](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L75)

___

### usage\_limit

• **usage\_limit**: ``null`` \| `number`

#### Defined in

[models/discount.ts:72](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L72)

___

### valid\_duration

• **valid\_duration**: ``null`` \| `string`

#### Defined in

[models/discount.ts:55](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L55)

## Methods

### upperCaseCodeAndTrim

▸ `Private` **upperCaseCodeAndTrim**(): `void`

#### Returns

`void`

#### Defined in

[models/discount.ts:80](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount.ts#L80)
