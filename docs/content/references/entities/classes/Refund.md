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

[models/refund.ts:50](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/refund.ts#L50)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/refund.ts:62](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/refund.ts#L62)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/refund.ts:59](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/refund.ts#L59)

___

### note

• **note**: `string`

#### Defined in

[models/refund.ts:53](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/refund.ts#L53)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/refund.ts:41](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/refund.ts#L41)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/refund.ts:31](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/refund.ts#L31)

___

### payment

• **payment**: [`Payment`](Payment.md)

#### Defined in

[models/refund.ts:47](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/refund.ts#L47)

___

### payment\_id

• **payment\_id**: `string`

#### Defined in

[models/refund.ts:37](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/refund.ts#L37)

___

### reason

• **reason**: `string`

#### Defined in

[models/refund.ts:56](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/refund.ts#L56)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/refund.ts:64](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/refund.ts#L64)
