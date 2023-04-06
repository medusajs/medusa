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

[models/payment.ts:51](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L51)

___

### amount\_refunded

• **amount\_refunded**: `number`

#### Defined in

[models/payment.ts:62](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L62)

___

### canceled\_at

• **canceled\_at**: `string` \| `Date`

#### Defined in

[models/payment.ts:75](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L75)

___

### captured\_at

• **captured\_at**: `string` \| `Date`

#### Defined in

[models/payment.ts:72](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L72)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/payment.ts:40](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L40)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/payment.ts:36](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L36)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/payment.ts:59](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L59)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/payment.ts:55](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L55)

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment.ts:69](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L69)

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

[models/payment.ts:81](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L81)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment.ts:78](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L78)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/payment.ts:48](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L48)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/payment.ts:44](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L44)

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

[models/payment.ts:66](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L66)

___

### swap

• **swap**: [`Swap`](Swap.md)

#### Defined in

[models/payment.ts:32](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L32)

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

[models/payment.ts:28](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L28)

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

[models/payment.ts:83](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment.ts#L83)
