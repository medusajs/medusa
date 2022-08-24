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

[models/payment-session.ts:34](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/payment-session.ts#L34)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/payment-session.ts:30](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/payment-session.ts#L30)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment-session.ts:47](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/payment-session.ts#L47)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/payment-session.ts:50](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/payment-session.ts#L50)

___

### is\_selected

• **is\_selected**: ``null`` \| `boolean`

#### Defined in

[models/payment-session.ts:41](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/payment-session.ts#L41)

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

[models/payment-session.ts:38](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/payment-session.ts#L38)

___

### status

• **status**: `string`

#### Defined in

[models/payment-session.ts:44](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/payment-session.ts#L44)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/payment-session.ts:52](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/payment-session.ts#L52)
