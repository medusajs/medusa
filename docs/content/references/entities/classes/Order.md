---
displayed_sidebar: entitiesSidebar
---

# Class: Order

## Hierarchy

- `BaseEntity`

  ↳ **`Order`**

## Constructors

### constructor

• **new Order**()

#### Inherited from

BaseEntity.constructor

## Properties

### billing\_address

• **billing\_address**: [`Address`](Address.md)

#### Defined in

[models/order.ts:123](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L123)

___

### billing\_address\_id

• **billing\_address\_id**: `string`

#### Defined in

[models/order.ts:119](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L119)

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

[models/order.ts:220](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L220)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/order.ts:104](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L104)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/order.ts:100](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L100)

___

### claims

• **claims**: [`ClaimOrder`](ClaimOrder.md)[]

#### Defined in

[models/order.ts:196](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L196)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/order.ts:146](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L146)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/order.ts:142](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L142)

___

### customer

• **customer**: [`Customer`](Customer.md)

#### Defined in

[models/order.ts:112](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L112)

___

### customer\_id

• **customer\_id**: `string`

#### Defined in

[models/order.ts:108](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L108)

___

### discount\_total

• **discount\_total**: `number`

#### Defined in

[models/order.ts:245](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L245)

___

### discounts

• **discounts**: [`Discount`](Discount.md)[]

#### Defined in

[models/order.ts:163](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L163)

___

### display\_id

• **display\_id**: `number`

#### Defined in

[models/order.ts:96](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L96)

___

### draft\_order

• **draft\_order**: [`DraftOrder`](DraftOrder.md)

#### Defined in

[models/order.ts:209](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L209)

___

### draft\_order\_id

• **draft\_order\_id**: `string`

#### Defined in

[models/order.ts:205](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L205)

___

### email

• **email**: `string`

#### Defined in

[models/order.ts:115](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L115)

___

### external\_id

• **external\_id**: ``null`` \| `string`

#### Defined in

[models/order.ts:232](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L232)

___

### fulfillment\_status

• **fulfillment\_status**: [`FulfillmentStatus`](../enums/FulfillmentStatus.md)

#### Defined in

[models/order.ts:88](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L88)

___

### fulfillments

• **fulfillments**: [`Fulfillment`](Fulfillment.md)[]

#### Defined in

[models/order.ts:190](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L190)

___

### gift\_card\_tax\_total

• **gift\_card\_tax\_total**: `number`

#### Defined in

[models/order.ts:253](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L253)

___

### gift\_card\_total

• **gift\_card\_total**: `number`

#### Defined in

[models/order.ts:252](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L252)

___

### gift\_card\_transactions

• **gift\_card\_transactions**: [`GiftCardTransaction`](GiftCardTransaction.md)[]

#### Defined in

[models/order.ts:217](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L217)

___

### gift\_cards

• **gift\_cards**: [`GiftCard`](GiftCard.md)[]

#### Defined in

[models/order.ts:177](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L177)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/order.ts:229](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L229)

___

### items

• **items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/order.ts:214](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L214)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/order.ts:223](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L223)

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

[models/order.ts:226](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L226)

___

### object

• `Readonly` **object**: ``"order"``

#### Defined in

[models/order.ts:78](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L78)

___

### paid\_total

• **paid\_total**: `number`

#### Defined in

[models/order.ts:250](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L250)

___

### payment\_status

• **payment\_status**: [`PaymentStatus`](../enums/PaymentStatus.md)

#### Defined in

[models/order.ts:91](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L91)

___

### payments

• **payments**: [`Payment`](Payment.md)[]

#### Defined in

[models/order.ts:185](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L185)

___

### refundable\_amount

• **refundable\_amount**: `number`

#### Defined in

[models/order.ts:251](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L251)

___

### refunded\_total

• **refunded\_total**: `number`

#### Defined in

[models/order.ts:247](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L247)

___

### refunds

• **refunds**: [`Refund`](Refund.md)[]

#### Defined in

[models/order.ts:199](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L199)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/order.ts:139](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L139)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/order.ts:135](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L135)

___

### returns

• **returns**: [`Return`](Return.md)[]

#### Defined in

[models/order.ts:193](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L193)

___

### sales\_channel

• **sales\_channel**: [`SalesChannel`](SalesChannel.md)

#### Defined in

[models/order.ts:241](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L241)

___

### sales\_channel\_id

• **sales\_channel\_id**: ``null`` \| `string`

#### Defined in

[models/order.ts:235](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L235)

___

### shipping\_address

• **shipping\_address**: [`Address`](Address.md)

#### Defined in

[models/order.ts:131](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L131)

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

[models/order.ts:127](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L127)

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

#### Defined in

[models/order.ts:182](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L182)

___

### shipping\_total

• **shipping\_total**: `number`

#### Defined in

[models/order.ts:244](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L244)

___

### status

• **status**: [`OrderStatus`](../enums/OrderStatus.md)

#### Defined in

[models/order.ts:81](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L81)

___

### subtotal

• **subtotal**: `number`

#### Defined in

[models/order.ts:249](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L249)

___

### swaps

• **swaps**: [`Swap`](Swap.md)[]

#### Defined in

[models/order.ts:202](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L202)

___

### tax\_rate

• **tax\_rate**: ``null`` \| `number`

#### Defined in

[models/order.ts:149](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L149)

___

### tax\_total

• **tax\_total**: ``null`` \| `number`

#### Defined in

[models/order.ts:246](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L246)

___

### total

• **total**: `number`

#### Defined in

[models/order.ts:248](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L248)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[models/order.ts:255](https://github.com/medusajs/medusa/blob/076b41bb8/packages/medusa/src/models/order.ts#L255)
