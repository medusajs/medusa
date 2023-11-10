# DraftOrder

A draft order is created by an admin without direct involvement of the customer. Once its payment is marked as captured, it is transformed into an order.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`DraftOrder`**

## Constructors

### constructor

**new DraftOrder**()

A draft order is created by an admin without direct involvement of the customer. Once its payment is marked as captured, it is transformed into an order.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### canceled\_at

 **canceled\_at**: `Date`

The date the draft order was canceled at.

#### Defined in

[packages/medusa/src/models/draft-order.ts:64](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L64)

___

### cart

 **cart**: [`Cart`](Cart.md)

The details of the cart associated with the draft order.

#### Defined in

[packages/medusa/src/models/draft-order.ts:53](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L53)

___

### cart\_id

 **cart\_id**: `string`

The ID of the cart associated with the draft order.

#### Defined in

[packages/medusa/src/models/draft-order.ts:49](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L49)

___

### completed\_at

 **completed\_at**: `Date`

The date the draft order was completed at.

#### Defined in

[packages/medusa/src/models/draft-order.ts:67](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L67)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### display\_id

 **display\_id**: `number`

The draft order's display ID

#### Defined in

[packages/medusa/src/models/draft-order.ts:45](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L45)

___

### id

 **id**: `string`

The draft order's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

 **idempotency\_key**: `string`

Randomly generated key used to continue the completion of the cart associated with the draft order in case of failure.

#### Defined in

[packages/medusa/src/models/draft-order.ts:76](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L76)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/draft-order.ts:73](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L73)

___

### no\_notification\_order

 **no\_notification\_order**: `boolean`

Whether to send the customer notifications regarding order updates.

#### Defined in

[packages/medusa/src/models/draft-order.ts:70](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L70)

___

### order

 **order**: [`Order`](Order.md)

The details of the order created from the draft order when its payment is captured.

#### Defined in

[packages/medusa/src/models/draft-order.ts:61](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L61)

___

### order\_id

 **order\_id**: `string`

The ID of the order created from the draft order when its payment is captured.

#### Defined in

[packages/medusa/src/models/draft-order.ts:57](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L57)

___

### status

 **status**: [`DraftOrderStatus`](../enums/DraftOrderStatus.md) = `open`

The status of the draft order. It's changed to `completed` when it's transformed to an order.

#### Defined in

[packages/medusa/src/models/draft-order.ts:40](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L40)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[BaseEntity](BaseEntity.md).[updated_at](BaseEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/models/draft-order.ts:82](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/draft-order.ts#L82)
