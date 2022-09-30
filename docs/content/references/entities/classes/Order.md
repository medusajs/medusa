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

[models/order.ts:125](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L125)

___

### billing\_address\_id

• **billing\_address\_id**: `string`

#### Defined in

[models/order.ts:121](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L121)

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

[models/order.ts:230](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L230)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/order.ts:106](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L106)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/order.ts:102](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L102)

___

### claims

• **claims**: [`ClaimOrder`](ClaimOrder.md)[]

#### Defined in

[models/order.ts:198](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L198)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/order.ts:148](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L148)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/order.ts:144](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L144)

___

### customer

• **customer**: [`Customer`](Customer.md)

#### Defined in

[models/order.ts:114](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L114)

___

### customer\_id

• **customer\_id**: `string`

#### Defined in

[models/order.ts:110](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L110)

___

### discount\_total

• **discount\_total**: `number`

#### Defined in

[models/order.ts:255](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L255)

___

### discounts

• **discounts**: [`Discount`](Discount.md)[]

#### Defined in

[models/order.ts:165](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L165)

___

### display\_id

• **display\_id**: `number`

#### Defined in

[models/order.ts:98](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L98)

___

### draft\_order

• **draft\_order**: [`DraftOrder`](DraftOrder.md)

#### Defined in

[models/order.ts:211](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L211)

___

### draft\_order\_id

• **draft\_order\_id**: `string`

#### Defined in

[models/order.ts:207](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L207)

___

### edits

• **edits**: [`OrderEdit`](OrderEdit.md)[]

#### Defined in

[models/order.ts:219](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L219)

___

### email

• **email**: `string`

#### Defined in

[models/order.ts:117](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L117)

___

### external\_id

• **external\_id**: ``null`` \| `string`

#### Defined in

[models/order.ts:242](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L242)

___

### fulfillment\_status

• **fulfillment\_status**: [`FulfillmentStatus`](../enums/FulfillmentStatus.md)

#### Defined in

[models/order.ts:90](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L90)

___

### fulfillments

• **fulfillments**: [`Fulfillment`](Fulfillment.md)[]

#### Defined in

[models/order.ts:192](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L192)

___

### gift\_card\_tax\_total

• **gift\_card\_tax\_total**: `number`

#### Defined in

[models/order.ts:263](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L263)

___

### gift\_card\_total

• **gift\_card\_total**: `number`

#### Defined in

[models/order.ts:262](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L262)

___

### gift\_card\_transactions

• **gift\_card\_transactions**: [`GiftCardTransaction`](GiftCardTransaction.md)[]

#### Defined in

[models/order.ts:227](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L227)

___

### gift\_cards

• **gift\_cards**: [`GiftCard`](GiftCard.md)[]

#### Defined in

[models/order.ts:179](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L179)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/order.ts:239](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L239)

___

### items

• **items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/order.ts:224](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L224)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/order.ts:233](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L233)

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

[models/order.ts:236](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L236)

___

### object

• `Readonly` **object**: ``"order"``

#### Defined in

[models/order.ts:80](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L80)

___

### paid\_total

• **paid\_total**: `number`

#### Defined in

[models/order.ts:260](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L260)

___

### payment\_status

• **payment\_status**: [`PaymentStatus`](../enums/PaymentStatus.md)

#### Defined in

[models/order.ts:93](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L93)

___

### payments

• **payments**: [`Payment`](Payment.md)[]

#### Defined in

[models/order.ts:187](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L187)

___

### refundable\_amount

• **refundable\_amount**: `number`

#### Defined in

[models/order.ts:261](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L261)

___

### refunded\_total

• **refunded\_total**: `number`

#### Defined in

[models/order.ts:257](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L257)

___

### refunds

• **refunds**: [`Refund`](Refund.md)[]

#### Defined in

[models/order.ts:201](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L201)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/order.ts:141](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L141)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/order.ts:137](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L137)

___

### returns

• **returns**: [`Return`](Return.md)[]

#### Defined in

[models/order.ts:195](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L195)

___

### sales\_channel

• **sales\_channel**: [`SalesChannel`](SalesChannel.md)

#### Defined in

[models/order.ts:251](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L251)

___

### sales\_channel\_id

• **sales\_channel\_id**: ``null`` \| `string`

#### Defined in

[models/order.ts:245](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L245)

___

### shipping\_address

• **shipping\_address**: [`Address`](Address.md)

#### Defined in

[models/order.ts:133](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L133)

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

[models/order.ts:129](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L129)

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

#### Defined in

[models/order.ts:184](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L184)

___

### shipping\_total

• **shipping\_total**: `number`

#### Defined in

[models/order.ts:254](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L254)

___

### status

• **status**: [`OrderStatus`](../enums/OrderStatus.md)

#### Defined in

[models/order.ts:83](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L83)

___

### subtotal

• **subtotal**: `number`

#### Defined in

[models/order.ts:259](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L259)

___

### swaps

• **swaps**: [`Swap`](Swap.md)[]

#### Defined in

[models/order.ts:204](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L204)

___

### tax\_rate

• **tax\_rate**: ``null`` \| `number`

#### Defined in

[models/order.ts:151](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L151)

___

### tax\_total

• **tax\_total**: ``null`` \| `number`

#### Defined in

[models/order.ts:256](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L256)

___

### total

• **total**: `number`

#### Defined in

[models/order.ts:258](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L258)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[models/order.ts:265](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order.ts#L265)
