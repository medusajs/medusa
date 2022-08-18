---
displayed_sidebar: entitiesSidebar
---

# Class: Payment

## Hierarchy

- `BaseEntity`

  ↳ **`Payment`**

## Constructors

### constructor

• **new Payment**()

#### Inherited from

BaseEntity.constructor

## Properties

### amount

• **amount**: `number`

#### Defined in

[models/payment.ts:46](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L46)

___

### amount\_refunded

• **amount\_refunded**: `number`

#### Defined in

[models/payment.ts:56](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L56)

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

[models/payment.ts:69](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L69)

___

### captured\_at

• **captured\_at**: `Date`

#### Defined in

[models/payment.ts:66](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L66)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/payment.ts:35](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L35)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/payment.ts:31](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L31)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/payment.ts:53](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L53)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/payment.ts:49](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L49)

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment.ts:63](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L63)

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

[models/payment.ts:75](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L75)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment.ts:72](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L72)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/payment.ts:43](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L43)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/payment.ts:39](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L39)

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

[models/payment.ts:60](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L60)

___

### swap

• **swap**: [`Swap`](Swap.md)

#### Defined in

[models/payment.ts:27](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L27)

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

[models/payment.ts:23](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L23)

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

[models/payment.ts:77](https://github.com/medusajs/medusa/blob/0703dd94e/packages/medusa/src/models/payment.ts#L77)
