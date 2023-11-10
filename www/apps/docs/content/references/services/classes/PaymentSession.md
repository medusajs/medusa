# PaymentSession

A Payment Session is created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, which is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for payment processing such as capture or refund. Payment sessions can also be used as part of payment collections.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`PaymentSession`**

## Constructors

### constructor

**new PaymentSession**()

A Payment Session is created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, which is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for payment processing such as capture or refund. Payment sessions can also be used as part of payment collections.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### amount

 **amount**: `number`

The amount that the Payment Session has been authorized for.

#### Defined in

[packages/medusa/src/models/payment-session.ts:59](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-session.ts#L59)

___

### cart

 **cart**: [`Cart`](Cart.md)

The details of the cart that the payment session was created for.

#### Defined in

[packages/medusa/src/models/payment-session.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-session.ts#L37)

___

### cart\_id

 **cart\_id**: ``null`` \| `string`

The ID of the cart that the payment session was created for.

#### Defined in

[packages/medusa/src/models/payment-session.ts:33](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-session.ts#L33)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### data

 **data**: Record<`string`, `unknown`\>

The data required for the Payment Provider to identify, modify and process the Payment Session. Typically this will be an object that holds an id to the external payment session, but can be an empty object if the Payment Provider doesn't hold any state.

#### Defined in

[packages/medusa/src/models/payment-session.ts:53](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-session.ts#L53)

___

### id

 **id**: `string`

The payment session's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

 **idempotency\_key**: `string`

Randomly generated key used to continue the completion of a cart in case of failure.

#### Defined in

[packages/medusa/src/models/payment-session.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-session.ts#L56)

___

### is\_initiated

 **is\_initiated**: `boolean`

A flag to indicate if a communication with the third party provider has been initiated.

#### Defined in

[packages/medusa/src/models/payment-session.ts:47](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-session.ts#L47)

___

### is\_selected

 **is\_selected**: ``null`` \| `boolean`

A flag to indicate if the Payment Session has been selected as the method that will be used to complete the purchase.

#### Defined in

[packages/medusa/src/models/payment-session.ts:44](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-session.ts#L44)

___

### payment\_authorized\_at

 **payment\_authorized\_at**: `Date`

The date with timezone at which the Payment Session was authorized.

#### Defined in

[packages/medusa/src/models/payment-session.ts:62](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-session.ts#L62)

___

### provider\_id

 **provider\_id**: `string`

The ID of the Payment Provider that is responsible for the Payment Session

#### Defined in

[packages/medusa/src/models/payment-session.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-session.ts#L41)

___

### status

 **status**: `string`

Indicates the status of the Payment Session. Will default to `pending`, and will eventually become `authorized`. Payment Sessions may have the status of `requires_more` to indicate that further actions are to be completed by the Customer.

#### Defined in

[packages/medusa/src/models/payment-session.ts:50](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-session.ts#L50)

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

[packages/medusa/src/models/payment-session.ts:68](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-session.ts#L68)
