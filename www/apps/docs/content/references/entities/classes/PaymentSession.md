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

### amount

• **amount**: `number`

#### Defined in

[models/payment-session.ts:59](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-session.ts#L59)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/payment-session.ts:37](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-session.ts#L37)

___

### cart\_id

• **cart\_id**: ``null`` \| `string`

#### Defined in

[models/payment-session.ts:33](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-session.ts#L33)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment-session.ts:53](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-session.ts#L53)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/payment-session.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-session.ts#L56)

___

### is\_initiated

• **is\_initiated**: `boolean`

#### Defined in

[models/payment-session.ts:47](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-session.ts#L47)

___

### is\_selected

• **is\_selected**: ``null`` \| `boolean`

#### Defined in

[models/payment-session.ts:44](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-session.ts#L44)

___

### payment\_authorized\_at

• **payment\_authorized\_at**: `Date`

#### Defined in

[models/payment-session.ts:62](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-session.ts#L62)

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

[models/payment-session.ts:41](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-session.ts#L41)

___

### status

• **status**: `string`

#### Defined in

[models/payment-session.ts:50](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-session.ts#L50)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/payment-session.ts:65](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-session.ts#L65)
