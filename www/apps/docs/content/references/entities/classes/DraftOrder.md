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

[models/draft-order.ts:53](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L53)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/draft-order.ts:42](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L42)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/draft-order.ts:38](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L38)

___

### completed\_at

• **completed\_at**: `Date`

#### Defined in

[models/draft-order.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L56)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### display\_id

• **display\_id**: `number`

#### Defined in

[models/draft-order.ts:34](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L34)

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

[models/draft-order.ts:65](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L65)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/draft-order.ts:62](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L62)

___

### no\_notification\_order

• **no\_notification\_order**: `boolean`

#### Defined in

[models/draft-order.ts:59](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L59)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/draft-order.ts:50](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L50)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/draft-order.ts:46](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L46)

___

### status

• **status**: [`DraftOrderStatus`](../enums/DraftOrderStatus.md)

#### Defined in

[models/draft-order.ts:29](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L29)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[models/draft-order.ts:68](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/draft-order.ts#L68)
