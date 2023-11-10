# Order

An order is a purchase made by a customer. It holds details about payment and fulfillment of the order. An order may also be created from a draft order, which is created by an admin user.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`Order`**

## Constructors

### constructor

**new Order**()

An order is a purchase made by a customer. It holds details about payment and fulfillment of the order. An order may also be created from a draft order, which is created by an admin user.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### billing\_address

 **billing\_address**: [`Address`](Address.md)

The details of the billing address associated with the order.

#### Defined in

[packages/medusa/src/models/order.ts:200](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L200)

___

### billing\_address\_id

 **billing\_address\_id**: `string`

The ID of the billing address associated with the order

#### Defined in

[packages/medusa/src/models/order.ts:196](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L196)

___

### canceled\_at

 **canceled\_at**: `Date`

The date the order was canceled on.

#### Defined in

[packages/medusa/src/models/order.ts:301](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L301)

___

### cart

 **cart**: [`Cart`](Cart.md)

The details of the cart associated with the order.

#### Defined in

[packages/medusa/src/models/order.ts:181](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L181)

___

### cart\_id

 **cart\_id**: `string`

The ID of the cart associated with the order

#### Defined in

[packages/medusa/src/models/order.ts:177](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L177)

___

### claims

 **claims**: [`ClaimOrder`](ClaimOrder.md)[]

The details of the claims created for the order.

#### Defined in

[packages/medusa/src/models/order.ts:274](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L274)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

 **currency**: [`Currency`](Currency.md)

The details of the currency used in the order.

#### Defined in

[packages/medusa/src/models/order.ts:224](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L224)

___

### currency\_code

 **currency\_code**: `string`

The 3 character currency code that is used in the order

#### Defined in

[packages/medusa/src/models/order.ts:220](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L220)

___

### customer

 **customer**: [`Customer`](Customer.md)

The details of the customer associated with the order.

#### Defined in

[packages/medusa/src/models/order.ts:189](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L189)

___

### customer\_id

 **customer\_id**: `string`

The ID of the customer associated with the order

#### Defined in

[packages/medusa/src/models/order.ts:185](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L185)

___

### discount\_total

 **discount\_total**: `number`

The total of discount rounded

#### Defined in

[packages/medusa/src/models/order.ts:327](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L327)

___

### discounts

 **discounts**: [`Discount`](Discount.md)[]

The details of the discounts applied on the order.

#### Defined in

[packages/medusa/src/models/order.ts:241](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L241)

___

### display\_id

 **display\_id**: `number`

The order's display ID

#### Defined in

[packages/medusa/src/models/order.ts:173](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L173)

___

### draft\_order

 **draft\_order**: [`DraftOrder`](DraftOrder.md)

The details of the draft order this order was created from.

#### Defined in

[packages/medusa/src/models/order.ts:287](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L287)

___

### draft\_order\_id

 **draft\_order\_id**: `string`

The ID of the draft order this order was created from.

#### Defined in

[packages/medusa/src/models/order.ts:283](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L283)

___

### edits

 **edits**: [`OrderEdit`](OrderEdit.md)[]

The details of the order edits done on the order.

#### Defined in

[packages/medusa/src/models/order.ts:290](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L290)

___

### email

 **email**: `string`

The email associated with the order

#### Defined in

[packages/medusa/src/models/order.ts:192](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L192)

___

### external\_id

 **external\_id**: ``null`` \| `string`

The ID of an external order.

#### Defined in

[packages/medusa/src/models/order.ts:313](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L313)

___

### fulfillment\_status

 **fulfillment\_status**: [`FulfillmentStatus`](../enums/FulfillmentStatus.md) = `not_fulfilled`

The order's fulfillment status

#### Defined in

[packages/medusa/src/models/order.ts:165](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L165)

___

### fulfillments

 **fulfillments**: [`Fulfillment`](Fulfillment.md)[]

The details of the fulfillments created for the order.

#### Defined in

[packages/medusa/src/models/order.ts:268](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L268)

___

### gift\_card\_tax\_total

 **gift\_card\_tax\_total**: `number`

The total of gift cards with taxes

#### Defined in

[packages/medusa/src/models/order.ts:337](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L337)

___

### gift\_card\_total

 **gift\_card\_total**: `number`

The total of gift cards

#### Defined in

[packages/medusa/src/models/order.ts:336](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L336)

___

### gift\_card\_transactions

 **gift\_card\_transactions**: [`GiftCardTransaction`](GiftCardTransaction.md)[]

The gift card transactions made in the order.

#### Defined in

[packages/medusa/src/models/order.ts:298](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L298)

___

### gift\_cards

 **gift\_cards**: [`GiftCard`](GiftCard.md)[]

The details of the gift card used in the order.

#### Defined in

[packages/medusa/src/models/order.ts:255](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L255)

___

### id

 **id**: `string`

The order's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

 **idempotency\_key**: `string`

Randomly generated key used to continue the processing of the order in case of failure.

#### Defined in

[packages/medusa/src/models/order.ts:310](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L310)

___

### item\_tax\_total

 **item\_tax\_total**: ``null`` \| `number`

The tax total applied on items

#### Defined in

[packages/medusa/src/models/order.ts:329](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L329)

___

### items

 **items**: [`LineItem`](LineItem.md)[]

The details of the line items that belong to the order.

#### Defined in

[packages/medusa/src/models/order.ts:295](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L295)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/order.ts:304](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L304)

___

### no\_notification

 **no\_notification**: `boolean`

Flag for describing whether or not notifications related to this should be send.

#### Defined in

[packages/medusa/src/models/order.ts:307](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L307)

___

### object

 `Readonly` **object**: ``"order"``

#### Defined in

[packages/medusa/src/models/order.ts:155](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L155)

___

### paid\_total

 **paid\_total**: `number`

The total amount paid

#### Defined in

[packages/medusa/src/models/order.ts:334](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L334)

___

### payment\_status

 **payment\_status**: [`PaymentStatus`](../enums/PaymentStatus.md) = `not_paid`

The order's payment status

#### Defined in

[packages/medusa/src/models/order.ts:168](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L168)

___

### payments

 **payments**: [`Payment`](Payment.md)[]

The details of the payments used in the order.

#### Defined in

[packages/medusa/src/models/order.ts:263](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L263)

___

### raw\_discount\_total

 **raw\_discount\_total**: `number`

The total of discount

#### Defined in

[packages/medusa/src/models/order.ts:328](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L328)

___

### refundable\_amount

 **refundable\_amount**: `number`

The amount that can be refunded

#### Defined in

[packages/medusa/src/models/order.ts:335](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L335)

___

### refunded\_total

 **refunded\_total**: `number`

The total amount refunded if the order is returned.

#### Defined in

[packages/medusa/src/models/order.ts:331](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L331)

___

### refunds

 **refunds**: [`Refund`](Refund.md)[]

The details of the refunds created for the order.

#### Defined in

[packages/medusa/src/models/order.ts:277](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L277)

___

### region

 **region**: [`Region`](Region.md)

The details of the region this order was created in.

#### Defined in

[packages/medusa/src/models/order.ts:216](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L216)

___

### region\_id

 **region\_id**: `string`

The ID of the region this order was created in.

#### Defined in

[packages/medusa/src/models/order.ts:212](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L212)

___

### returnable\_items

 `Optional` **returnable\_items**: [`LineItem`](LineItem.md)[]

The details of the line items that are returnable as part of the order, swaps, or claims

#### Defined in

[packages/medusa/src/models/order.ts:339](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L339)

___

### returns

 **returns**: [`Return`](Return.md)[]

The details of the returns created for the order.

#### Defined in

[packages/medusa/src/models/order.ts:271](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L271)

___

### sales\_channel

 **sales\_channel**: [`SalesChannel`](SalesChannel.md)

The details of the sales channel this order belongs to.

#### Defined in

[packages/medusa/src/models/order.ts:322](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L322)

___

### sales\_channel\_id

 **sales\_channel\_id**: ``null`` \| `string`

The ID of the sales channel this order belongs to.

#### Defined in

[packages/medusa/src/models/order.ts:316](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L316)

___

### shipping\_address

 **shipping\_address**: [`Address`](Address.md)

The details of the shipping address associated with the order.

#### Defined in

[packages/medusa/src/models/order.ts:208](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L208)

___

### shipping\_address\_id

 **shipping\_address\_id**: `string`

The ID of the shipping address associated with the order

#### Defined in

[packages/medusa/src/models/order.ts:204](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L204)

___

### shipping\_methods

 **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

The details of the shipping methods used in the order.

#### Defined in

[packages/medusa/src/models/order.ts:260](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L260)

___

### shipping\_tax\_total

 **shipping\_tax\_total**: ``null`` \| `number`

The tax total applied on shipping

#### Defined in

[packages/medusa/src/models/order.ts:326](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L326)

___

### shipping\_total

 **shipping\_total**: `number`

The total of shipping

#### Defined in

[packages/medusa/src/models/order.ts:325](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L325)

___

### status

 **status**: [`OrderStatus`](../enums/OrderStatus.md) = `pending`

The order's status

#### Defined in

[packages/medusa/src/models/order.ts:158](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L158)

___

### subtotal

 **subtotal**: `number`

The subtotal of the order

#### Defined in

[packages/medusa/src/models/order.ts:333](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L333)

___

### swaps

 **swaps**: [`Swap`](Swap.md)[]

The details of the swaps created for the order.

#### Defined in

[packages/medusa/src/models/order.ts:280](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L280)

___

### tax\_rate

 **tax\_rate**: ``null`` \| `number`

The order's tax rate

#### Defined in

[packages/medusa/src/models/order.ts:227](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L227)

___

### tax\_total

 **tax\_total**: ``null`` \| `number`

The total of tax

#### Defined in

[packages/medusa/src/models/order.ts:330](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L330)

___

### total

 **total**: `number`

The total amount of the order

#### Defined in

[packages/medusa/src/models/order.ts:332](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L332)

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

[packages/medusa/src/models/order.ts:345](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/order.ts#L345)
