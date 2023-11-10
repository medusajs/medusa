# Swap

A swap can be created when a Customer wishes to exchange Products that they have purchased with different Products. It consists of a Return of previously purchased Products and a Fulfillment of new Products. It also includes information on any additional payment or refund required based on the difference between the exchanged products.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`Swap`**

## Constructors

### constructor

**new Swap**()

A swap can be created when a Customer wishes to exchange Products that they have purchased with different Products. It consists of a Return of previously purchased Products and a Fulfillment of new Products. It also includes information on any additional payment or refund required based on the difference between the exchanged products.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### additional\_items

 **additional\_items**: [`LineItem`](LineItem.md)[]

The details of the new products to send to the customer, represented as line items.

#### Defined in

[packages/medusa/src/models/swap.ts:117](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L117)

___

### allow\_backorder

 **allow\_backorder**: `boolean`

If true, swaps can be completed with items out of stock

#### Defined in

[packages/medusa/src/models/swap.ts:162](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L162)

___

### canceled\_at

 **canceled\_at**: `Date`

The date with timezone at which the Swap was canceled.

#### Defined in

[packages/medusa/src/models/swap.ts:156](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L156)

___

### cart

 **cart**: [`Cart`](Cart.md)

The details of the cart that the customer uses to complete the swap.

#### Defined in

[packages/medusa/src/models/swap.ts:150](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L150)

___

### cart\_id

 **cart\_id**: `string`

The ID of the cart that the customer uses to complete the swap.

#### Defined in

[packages/medusa/src/models/swap.ts:146](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L146)

___

### confirmed\_at

 **confirmed\_at**: `Date`

The date with timezone at which the Swap was confirmed by the Customer.

#### Defined in

[packages/medusa/src/models/swap.ts:153](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L153)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### difference\_due

 **difference\_due**: `number`

The difference amount between the order’s original total and the new total imposed by the swap. If its value is negative, a refund must be issues to the customer. If it's positive, additional payment must be authorized by the customer. Otherwise, no payment processing is required.

#### Defined in

[packages/medusa/src/models/swap.ts:131](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L131)

___

### fulfillment\_status

 **fulfillment\_status**: [`SwapFulfillmentStatus`](../enums/SwapFulfillmentStatus.md)

The status of the Fulfillment of the Swap.

#### Defined in

[packages/medusa/src/models/swap.ts:103](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L103)

___

### fulfillments

 **fulfillments**: [`Fulfillment`](Fulfillment.md)[]

The details of the fulfillments that are used to send the new items to the customer.

#### Defined in

[packages/medusa/src/models/swap.ts:125](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L125)

___

### id

 **id**: `string`

The swap's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

 **idempotency\_key**: `string`

Randomly generated key used to continue the completion of the swap in case of failure.

#### Defined in

[packages/medusa/src/models/swap.ts:165](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L165)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/swap.ts:168](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L168)

___

### no\_notification

 **no\_notification**: `boolean`

If set to true, no notification will be sent related to this swap

#### Defined in

[packages/medusa/src/models/swap.ts:159](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L159)

___

### order

 **order**: [`Order`](Order.md)

The details of the order that the swap belongs to.

#### Defined in

[packages/medusa/src/models/swap.ts:114](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L114)

___

### order\_id

 **order\_id**: `string`

The ID of the order that the swap belongs to.

#### Defined in

[packages/medusa/src/models/swap.ts:110](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L110)

___

### payment

 **payment**: [`Payment`](Payment.md)

The details of the additional payment authorized by the customer when `difference_due` is positive.

#### Defined in

[packages/medusa/src/models/swap.ts:128](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L128)

___

### payment\_status

 **payment\_status**: [`SwapPaymentStatus`](../enums/SwapPaymentStatus.md)

The status of the Payment of the Swap. The payment may either refer to the refund of an amount or the authorization of a new amount.

#### Defined in

[packages/medusa/src/models/swap.ts:106](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L106)

___

### return\_order

 **return\_order**: [`Return`](Return.md)

The details of the return that belongs to the swap, which holds the details on the items being returned.

#### Defined in

[packages/medusa/src/models/swap.ts:120](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L120)

___

### shipping\_address

 **shipping\_address**: [`Address`](Address.md)

The details of the shipping address that the new items should be sent to.

#### Defined in

[packages/medusa/src/models/swap.ts:138](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L138)

___

### shipping\_address\_id

 **shipping\_address\_id**: `string`

The Address to send the new Line Items to - in most cases this will be the same as the shipping address on the Order.

#### Defined in

[packages/medusa/src/models/swap.ts:134](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L134)

___

### shipping\_methods

 **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

The details of the shipping methods used to fulfill the additional items purchased.

#### Defined in

[packages/medusa/src/models/swap.ts:143](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L143)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/swap.ts:174](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/swap.ts#L174)
