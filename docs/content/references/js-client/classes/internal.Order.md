---
displayed_sidebar: jsClientSidebar
---

# Class: Order

[internal](../modules/internal.md).Order

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`Order`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/order.d.ts:93

___

### billing\_address

• **billing\_address**: [`Address`](internal.Address.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:58

___

### billing\_address\_id

• **billing\_address\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:57

___

### canceled\_at

• **canceled\_at**: [`Date`](../modules/internal.md#date)

#### Defined in

packages/medusa/dist/models/order.d.ts:79

___

### cart

• **cart**: [`Cart`](internal.Cart.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:53

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:52

___

### claims

• **claims**: [`ClaimOrder`](internal.ClaimOrder.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:72

___

### created\_at

• **created\_at**: [`Date`](../modules/internal.md#date)

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[created_at](internal.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### currency

• **currency**: [`Currency`](internal.Currency.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:64

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:63

___

### customer

• **customer**: [`Customer`](internal.Customer.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:55

___

### customer\_id

• **customer\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:54

___

### discount\_total

• **discount\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:85

___

### discounts

• **discounts**: [`Discount`](internal.Discount.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:66

___

### display\_id

• **display\_id**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:51

___

### draft\_order

• **draft\_order**: [`DraftOrder`](internal.DraftOrder.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:76

___

### draft\_order\_id

• **draft\_order\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:75

___

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:56

___

### external\_id

• **external\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:83

___

### fulfillment\_status

• **fulfillment\_status**: [`FulfillmentStatus`](../enums/internal.FulfillmentStatus.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:49

___

### fulfillments

• **fulfillments**: [`Fulfillment`](internal.Fulfillment.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:70

___

### gift\_card\_total

• **gift\_card\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:92

___

### gift\_card\_transactions

• **gift\_card\_transactions**: [`GiftCardTransaction`](internal.GiftCardTransaction.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:78

___

### gift\_cards

• **gift\_cards**: [`GiftCard`](internal.GiftCard.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:67

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[id](internal.BaseEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:82

___

### items

• **items**: [`LineItem`](internal.LineItem.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:77

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/order.d.ts:80

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/models/order.d.ts:81

___

### object

• `Readonly` **object**: ``"order"``

#### Defined in

packages/medusa/dist/models/order.d.ts:47

___

### paid\_total

• **paid\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:90

___

### payment\_status

• **payment\_status**: [`PaymentStatus`](../enums/internal.PaymentStatus.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:50

___

### payments

• **payments**: [`Payment`](internal.Payment.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:69

___

### refundable\_amount

• **refundable\_amount**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:91

___

### refunded\_total

• **refunded\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:87

___

### refunds

• **refunds**: [`Refund`](internal.Refund.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:73

___

### region

• **region**: [`Region`](internal.Region.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:62

___

### region\_id

• **region\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:61

___

### returns

• **returns**: [`Return`](internal.Return.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:71

___

### shipping\_address

• **shipping\_address**: [`Address`](internal.Address.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:60

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

packages/medusa/dist/models/order.d.ts:59

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](internal.ShippingMethod.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:68

___

### shipping\_total

• **shipping\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:84

___

### status

• **status**: [`OrderStatus`](../enums/internal.OrderStatus.md)

#### Defined in

packages/medusa/dist/models/order.d.ts:48

___

### subtotal

• **subtotal**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:89

___

### swaps

• **swaps**: [`Swap`](internal.Swap.md)[]

#### Defined in

packages/medusa/dist/models/order.d.ts:74

___

### tax\_rate

• **tax\_rate**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:65

___

### tax\_total

• **tax\_total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:86

___

### total

• **total**: `number`

#### Defined in

packages/medusa/dist/models/order.d.ts:88

___

### updated\_at

• **updated\_at**: [`Date`](../modules/internal.md#date)

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
