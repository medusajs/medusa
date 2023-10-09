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

[models/order.ts:117](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L117)

___

### billing\_address\_id

• **billing\_address\_id**: `string`

#### Defined in

[models/order.ts:113](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L113)

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

[models/order.ts:218](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L218)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/order.ts:98](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L98)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/order.ts:94](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L94)

___

### claims

• **claims**: [`ClaimOrder`](ClaimOrder.md)[]

#### Defined in

[models/order.ts:191](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L191)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/order.ts:141](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L141)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/order.ts:137](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L137)

___

### customer

• **customer**: [`Customer`](Customer.md)

#### Defined in

[models/order.ts:106](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L106)

___

### customer\_id

• **customer\_id**: `string`

#### Defined in

[models/order.ts:102](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L102)

___

### discount\_total

• **discount\_total**: `number`

#### Defined in

[models/order.ts:243](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L243)

___

### discounts

• **discounts**: [`Discount`](Discount.md)[]

#### Defined in

[models/order.ts:158](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L158)

___

### display\_id

• **display\_id**: `number`

#### Defined in

[models/order.ts:90](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L90)

___

### draft\_order

• **draft\_order**: [`DraftOrder`](DraftOrder.md)

#### Defined in

[models/order.ts:204](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L204)

___

### draft\_order\_id

• **draft\_order\_id**: `string`

#### Defined in

[models/order.ts:200](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L200)

___

### edits

• **edits**: [`OrderEdit`](OrderEdit.md)[]

#### Defined in

[models/order.ts:207](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L207)

___

### email

• **email**: `string`

#### Defined in

[models/order.ts:109](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L109)

___

### external\_id

• **external\_id**: ``null`` \| `string`

#### Defined in

[models/order.ts:230](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L230)

___

### fulfillment\_status

• **fulfillment\_status**: [`FulfillmentStatus`](../enums/FulfillmentStatus.md)

#### Defined in

[models/order.ts:82](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L82)

___

### fulfillments

• **fulfillments**: [`Fulfillment`](Fulfillment.md)[]

#### Defined in

[models/order.ts:185](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L185)

___

### gift\_card\_tax\_total

• **gift\_card\_tax\_total**: `number`

#### Defined in

[models/order.ts:252](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L252)

___

### gift\_card\_total

• **gift\_card\_total**: `number`

#### Defined in

[models/order.ts:251](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L251)

___

### gift\_card\_transactions

• **gift\_card\_transactions**: [`GiftCardTransaction`](GiftCardTransaction.md)[]

#### Defined in

[models/order.ts:215](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L215)

___

### gift\_cards

• **gift\_cards**: [`GiftCard`](GiftCard.md)[]

#### Defined in

[models/order.ts:172](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L172)

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

[models/order.ts:227](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L227)

___

### items

• **items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/order.ts:212](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L212)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/order.ts:221](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L221)

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

[models/order.ts:224](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L224)

___

### object

• `Readonly` **object**: ``"order"``

#### Defined in

[models/order.ts:72](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L72)

___

### paid\_total

• **paid\_total**: `number`

#### Defined in

[models/order.ts:249](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L249)

___

### payment\_status

• **payment\_status**: [`PaymentStatus`](../enums/PaymentStatus.md)

#### Defined in

[models/order.ts:85](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L85)

___

### payments

• **payments**: [`Payment`](Payment.md)[]

#### Defined in

[models/order.ts:180](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L180)

___

### raw\_discount\_total

• **raw\_discount\_total**: `number`

#### Defined in

[models/order.ts:244](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L244)

___

### refundable\_amount

• **refundable\_amount**: `number`

#### Defined in

[models/order.ts:250](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L250)

___

### refunded\_total

• **refunded\_total**: `number`

#### Defined in

[models/order.ts:246](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L246)

___

### refunds

• **refunds**: [`Refund`](Refund.md)[]

#### Defined in

[models/order.ts:194](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L194)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/order.ts:133](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L133)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/order.ts:129](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L129)

___

### returnable\_items

• `Optional` **returnable\_items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/order.ts:254](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L254)

___

### returns

• **returns**: [`Return`](Return.md)[]

#### Defined in

[models/order.ts:188](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L188)

___

### sales\_channel

• **sales\_channel**: [`SalesChannel`](SalesChannel.md)

#### Defined in

[models/order.ts:239](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L239)

___

### sales\_channel\_id

• **sales\_channel\_id**: ``null`` \| `string`

#### Defined in

[models/order.ts:233](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L233)

___

### shipping\_address

• **shipping\_address**: [`Address`](Address.md)

#### Defined in

[models/order.ts:125](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L125)

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

[models/order.ts:121](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L121)

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

#### Defined in

[models/order.ts:177](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L177)

___

### shipping\_total

• **shipping\_total**: `number`

#### Defined in

[models/order.ts:242](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L242)

___

### status

• **status**: [`OrderStatus`](../enums/OrderStatus.md)

#### Defined in

[models/order.ts:75](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L75)

___

### subtotal

• **subtotal**: `number`

#### Defined in

[models/order.ts:248](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L248)

___

### swaps

• **swaps**: [`Swap`](Swap.md)[]

#### Defined in

[models/order.ts:197](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L197)

___

### tax\_rate

• **tax\_rate**: ``null`` \| `number`

#### Defined in

[models/order.ts:144](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L144)

___

### tax\_total

• **tax\_total**: ``null`` \| `number`

#### Defined in

[models/order.ts:245](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L245)

___

### total

• **total**: `number`

#### Defined in

[models/order.ts:247](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L247)

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

[models/order.ts:257](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order.ts#L257)
