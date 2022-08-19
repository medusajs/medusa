---
displayed_sidebar: entitiesSidebar
---

# Class: Refund

## Hierarchy

- `BaseEntity`

  ↳ **`Refund`**

## Constructors

### constructor

• **new Refund**()

#### Inherited from

BaseEntity.constructor

## Properties

### amount

• **amount**: `number`

#### Defined in

[models/refund.ts:34](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/refund.ts#L34)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/interfaces/models/base-entity.ts#L16)

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

[models/refund.ts:46](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/refund.ts#L46)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/refund.ts:43](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/refund.ts#L43)

___

### note

• **note**: `string`

#### Defined in

[models/refund.ts:37](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/refund.ts#L37)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/refund.ts:31](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/refund.ts#L31)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/refund.ts:27](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/refund.ts#L27)

___

### reason

• **reason**: `string`

#### Defined in

[models/refund.ts:40](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/refund.ts#L40)

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

[models/refund.ts:48](https://github.com/medusajs/medusa/blob/aada5327e/packages/medusa/src/models/refund.ts#L48)
