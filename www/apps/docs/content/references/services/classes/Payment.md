# Payment

A payment is originally created from a payment session. Once a payment session is authorized, the payment is created to represent the authorized amount with a given payment method. Payments can be captured, canceled or refunded. Payments can be made towards orders, swaps, order edits, or other resources.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`Payment`**

## Constructors

### constructor

**new Payment**()

A payment is originally created from a payment session. Once a payment session is authorized, the payment is created to represent the authorized amount with a given payment method. Payments can be captured, canceled or refunded. Payments can be made towards orders, swaps, order edits, or other resources.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### amount

 **amount**: `number`

The amount that the Payment has been authorized for.

#### Defined in

[packages/medusa/src/models/payment.ts:51](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L51)

___

### amount\_refunded

 **amount\_refunded**: `number`

The amount of the original Payment amount that has been refunded back to the Customer.

#### Defined in

[packages/medusa/src/models/payment.ts:62](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L62)

___

### canceled\_at

 **canceled\_at**: `string` \| `Date`

The date with timezone at which the Payment was canceled.

#### Defined in

[packages/medusa/src/models/payment.ts:75](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L75)

___

### captured\_at

 **captured\_at**: `string` \| `Date`

The date with timezone at which the Payment was captured.

#### Defined in

[packages/medusa/src/models/payment.ts:72](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L72)

___

### cart

 **cart**: [`Cart`](Cart.md)

The details of the cart that the payment session was potentially created for.

#### Defined in

[packages/medusa/src/models/payment.ts:40](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L40)

___

### cart\_id

 **cart\_id**: `string`

The ID of the cart that the payment session was potentially created for.

#### Defined in

[packages/medusa/src/models/payment.ts:36](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L36)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

 **currency**: [`Currency`](Currency.md)

The details of the currency of the payment.

#### Defined in

[packages/medusa/src/models/payment.ts:59](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L59)

___

### currency\_code

 **currency\_code**: `string`

The 3 character ISO currency code of the payment.

#### Defined in

[packages/medusa/src/models/payment.ts:55](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L55)

___

### data

 **data**: Record<`string`, `unknown`\>

The data required for the Payment Provider to identify, modify and process the Payment. Typically this will be an object that holds an id to the external payment session, but can be an empty object if the Payment Provider doesn't hold any state.

#### Defined in

[packages/medusa/src/models/payment.ts:69](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L69)

___

### id

 **id**: `string`

The payment's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

 **idempotency\_key**: `string`

Randomly generated key used to continue the completion of a payment in case of failure.

#### Defined in

[packages/medusa/src/models/payment.ts:81](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L81)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/payment.ts:78](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L78)

___

### order

 **order**: [`Order`](Order.md)

The details of the order that the payment session was potentially created for.

#### Defined in

[packages/medusa/src/models/payment.ts:48](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L48)

___

### order\_id

 **order\_id**: `string`

The ID of the order that the payment session was potentially created for.

#### Defined in

[packages/medusa/src/models/payment.ts:44](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L44)

___

### provider\_id

 **provider\_id**: `string`

The id of the Payment Provider that is responsible for the Payment

#### Defined in

[packages/medusa/src/models/payment.ts:66](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L66)

___

### swap

 **swap**: [`Swap`](Swap.md)

The details of the swap that this payment was potentially created for.

#### Defined in

[packages/medusa/src/models/payment.ts:32](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L32)

___

### swap\_id

 **swap\_id**: `string`

The ID of the swap that this payment was potentially created for.

#### Defined in

[packages/medusa/src/models/payment.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L28)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[BaseEntity](BaseEntity.md).[updated_at](BaseEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/payment.ts:87](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment.ts#L87)
