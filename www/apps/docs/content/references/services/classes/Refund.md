# Refund

A refund represents an amount of money transfered back to the customer for a given reason. Refunds may occur in relation to Returns, Swaps and Claims, but can also be initiated by an admin for an order.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`Refund`**

## Constructors

### constructor

**new Refund**()

A refund represents an amount of money transfered back to the customer for a given reason. Refunds may occur in relation to Returns, Swaps and Claims, but can also be initiated by an admin for an order.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### amount

 **amount**: `number`

The amount that has be refunded to the Customer.

#### Defined in

[packages/medusa/src/models/refund.ts:64](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/refund.ts#L64)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### id

 **id**: `string`

The refund's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

 **idempotency\_key**: `string`

Randomly generated key used to continue the completion of the refund in case of failure.

#### Defined in

[packages/medusa/src/models/refund.ts:76](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/refund.ts#L76)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/refund.ts:73](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/refund.ts#L73)

___

### note

 **note**: `string`

An optional note explaining why the amount was refunded.

#### Defined in

[packages/medusa/src/models/refund.ts:67](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/refund.ts#L67)

___

### order

 **order**: [`Order`](Order.md)

The details of the order this refund was created for.

#### Defined in

[packages/medusa/src/models/refund.ts:57](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/refund.ts#L57)

___

### order\_id

 **order\_id**: `string`

The ID of the order this refund was created for.

#### Defined in

[packages/medusa/src/models/refund.ts:49](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/refund.ts#L49)

___

### payment

 **payment**: [`Payment`](Payment.md)

The details of the payment associated with the refund.

#### Defined in

[packages/medusa/src/models/refund.ts:61](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/refund.ts#L61)

___

### payment\_id

 **payment\_id**: `string`

The payment's ID, if available.

#### Defined in

[packages/medusa/src/models/refund.ts:53](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/refund.ts#L53)

___

### reason

 **reason**: `string`

The reason given for the Refund, will automatically be set when processed as part of a Swap, Claim or Return.

#### Defined in

[packages/medusa/src/models/refund.ts:70](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/refund.ts#L70)

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

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/refund.ts:82](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/refund.ts#L82)
