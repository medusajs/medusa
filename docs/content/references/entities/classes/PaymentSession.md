---
displayed_sidebar: entitiesSidebar
---

# Class: PaymentSession

## Hierarchy

- `BaseEntity`

  ↳ **`PaymentSession`**

## Constructors

### constructor

• **new PaymentSession**()

#### Inherited from

BaseEntity.constructor

## Properties

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/payment-session.ts:33](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment-session.ts#L33)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/payment-session.ts:29](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment-session.ts#L29)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment-session.ts:46](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment-session.ts#L46)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/payment-session.ts:49](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment-session.ts#L49)

___

### is\_selected

• **is\_selected**: ``null`` \| `boolean`

#### Defined in

[models/payment-session.ts:40](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment-session.ts#L40)

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

[models/payment-session.ts:37](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment-session.ts#L37)

___

### status

• **status**: `string`

#### Defined in

[models/payment-session.ts:43](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment-session.ts#L43)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/payment-session.ts:51](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment-session.ts#L51)
