---
displayed_sidebar: jsClientSidebar
---

# Class: Order

[internal](../modules/internal-3.md).Order

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`Order`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/order.d.ts:101

___

### billing\_address

• **billing\_address**: [`Address`](internal-3.Address.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:60

___

### billing\_address\_id

• **billing\_address\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:59

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

packages/medusa/dist/models/order.d.ts:82

___

### cart

• **cart**: [`Cart`](internal-3.Cart.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:55

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:54

___

### claims

• **claims**: [`ClaimOrder`](internal-3.ClaimOrder.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:74

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[created_at](internal-1.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### currency

• **currency**: [`Currency`](internal-3.Currency.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:66

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:65

___

### customer

• **customer**: [`Customer`](internal-3.Customer.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:57

___

### customer\_id

• **customer\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:56

___

### discount\_total

• **discount\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:90

___

### discounts

• **discounts**: [`Discount`](internal-3.Discount.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:68

___

### display\_id

• **display\_id**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:53

___

### draft\_order

• **draft\_order**: [`DraftOrder`](internal-3.DraftOrder.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:78

___

### draft\_order\_id

• **draft\_order\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:77

___

### edits

• **edits**: [`OrderEdit`](internal-3.OrderEdit.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:79

___

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:58

___

### external\_id

• **external\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:86

___

### fulfillment\_status

• **fulfillment\_status**: [`FulfillmentStatus`](../enums/internal-3.FulfillmentStatus.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:51

___

### fulfillments

• **fulfillments**: [`Fulfillment`](internal-3.Fulfillment.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:72

___

### gift\_card\_tax\_total

• **gift\_card\_tax\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:99

___

### gift\_card\_total

• **gift\_card\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:98

___

### gift\_card\_transactions

• **gift\_card\_transactions**: [`GiftCardTransaction`](internal-3.GiftCardTransaction.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:81

___

### gift\_cards

• **gift\_cards**: [`GiftCard`](internal-3.GiftCard.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:69

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[id](internal-1.BaseEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:85

___

### items

• **items**: [`LineItem`](internal-3.LineItem.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:80

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/order.d.ts:83

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/models/order.d.ts:84

___

### object

• `Readonly` **object**: ``"order"``

#### Defined in

packages/medusa/dist/models/order.d.ts:49

___

### paid\_total

• **paid\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:96

___

### payment\_status

• **payment\_status**: [`PaymentStatus`](../enums/internal-3.PaymentStatus.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:52

___

### payments

• **payments**: [`Payment`](internal-3.Payment.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:71

___

### raw\_discount\_total

• **raw\_discount\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:91

___

### refundable\_amount

• **refundable\_amount**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:97

___

### refunded\_total

• **refunded\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:93

___

### refunds

• **refunds**: [`Refund`](internal-3.Refund.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:75

___

### region

• **region**: [`Region`](internal-3.Region.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:64

___

### region\_id

• **region\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:63

___

### returnable\_items

• `Optional` **returnable\_items**: [`LineItem`](internal-3.LineItem.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:100

___

### returns

• **returns**: [`Return`](internal-3.Return.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:73

___

### sales\_channel

• **sales\_channel**: [`SalesChannel`](internal-3.SalesChannel.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:88

___

### sales\_channel\_id

• **sales\_channel\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:87

___

### shipping\_address

• **shipping\_address**: [`Address`](internal-3.Address.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:62

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:61

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](internal-3.ShippingMethod.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:70

___

### shipping\_total

• **shipping\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:89

___

### status

• **status**: [`OrderStatus`](../enums/internal-3.OrderStatus.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:50

___

### subtotal

• **subtotal**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:95

___

### swaps

• **swaps**: [`Swap`](internal-3.Swap.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:76

___

### tax\_rate

• **tax\_rate**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:67

___

### tax\_total

• **tax\_total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:92

___

### total

• **total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:94

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
