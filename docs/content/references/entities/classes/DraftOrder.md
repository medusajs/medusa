---
displayed_sidebar: entitiesSidebar
---

# Class: DraftOrder

## Hierarchy

- `BaseEntity`

  ↳ **`DraftOrder`**

## Constructors

### constructor

• **new DraftOrder**()

#### Inherited from

BaseEntity.constructor

## Properties

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

[models/draft-order.ts:54](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L54)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/draft-order.ts:43](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L43)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/draft-order.ts:39](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L39)

___

### completed\_at

• **completed\_at**: `Date`

#### Defined in

[models/draft-order.ts:57](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L57)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### display\_id

• **display\_id**: `number`

#### Defined in

[models/draft-order.ts:35](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L35)

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

[models/draft-order.ts:66](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L66)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/draft-order.ts:63](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L63)

___

### no\_notification\_order

• **no\_notification\_order**: `boolean`

#### Defined in

[models/draft-order.ts:60](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L60)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/draft-order.ts:51](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L51)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/draft-order.ts:47](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L47)

___

### status

• **status**: [`DraftOrderStatus`](../enums/DraftOrderStatus.md)

#### Defined in

[models/draft-order.ts:30](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L30)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[models/draft-order.ts:68](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/draft-order.ts#L68)
