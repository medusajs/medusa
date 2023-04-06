---
displayed_sidebar: jsClientSidebar
---

# Class: Discount

[internal](../modules/internal.md).Discount

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`Discount`**

## Properties

### code

• **code**: `string`

#### Defined in

medusa/dist/models/discount.d.ts:5

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### ends\_at

• **ends\_at**: ``null`` \| `Date`

#### Defined in

medusa/dist/models/discount.d.ts:13

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### is\_disabled

• **is\_disabled**: `boolean`

#### Defined in

medusa/dist/models/discount.d.ts:9

___

### is\_dynamic

• **is\_dynamic**: `boolean`

#### Defined in

medusa/dist/models/discount.d.ts:6

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/discount.d.ts:18

___

### parent\_discount

• **parent\_discount**: [`Discount`](internal.Discount.md)

#### Defined in

medusa/dist/models/discount.d.ts:11

___

### parent\_discount\_id

• **parent\_discount\_id**: `string`

#### Defined in

medusa/dist/models/discount.d.ts:10

___

### regions

• **regions**: [`Region`](internal.Region.md)[]

#### Defined in

medusa/dist/models/discount.d.ts:15

___

### rule

• **rule**: [`DiscountRule`](internal.DiscountRule.md)

#### Defined in

medusa/dist/models/discount.d.ts:8

___

### rule\_id

• **rule\_id**: `string`

#### Defined in

medusa/dist/models/discount.d.ts:7

___

### starts\_at

• **starts\_at**: `Date`

#### Defined in

medusa/dist/models/discount.d.ts:12

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7

___

### upperCaseCodeAndTrim

• `Private` **upperCaseCodeAndTrim**: `any`

#### Defined in

medusa/dist/models/discount.d.ts:19

___

### usage\_count

• **usage\_count**: `number`

#### Defined in

medusa/dist/models/discount.d.ts:17

___

### usage\_limit

• **usage\_limit**: ``null`` \| `number`

#### Defined in

medusa/dist/models/discount.d.ts:16

___

### valid\_duration

• **valid\_duration**: ``null`` \| `string`

#### Defined in

medusa/dist/models/discount.d.ts:14
