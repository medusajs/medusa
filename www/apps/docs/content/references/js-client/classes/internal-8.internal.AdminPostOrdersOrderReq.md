---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderReq

**`Schema`**

AdminPostOrdersOrderReq
type: object
properties:
  email:
    description: the email associated with the order
    type: string
  billing_address:
    description: The order's billing address
    $ref: "#/components/schemas/AddressPayload"
  shipping_address:
    description: The order's shipping address
    $ref: "#/components/schemas/AddressPayload"
  items:
    description: The line items of the order
    type: array
    items:
      $ref: "#/components/schemas/LineItem"
  region:
    description: ID of the region that the order is associated with.
    type: string
  discounts:
    description: The discounts applied to the order
    type: array
    items:
      $ref: "#/components/schemas/Discount"
  customer_id:
    description: The ID of the customer associated with the order.
    type: string
  payment_method:
    description: The payment method chosen for the order.
    type: object
    properties:
      provider_id:
        type: string
        description: The ID of the payment provider.
      data:
        description: Any data relevant for the given payment method.
        type: object
  shipping_method:
    description: The Shipping Method used for shipping the order.
    type: object
    properties:
      provider_id:
        type: string
        description: The ID of the shipping provider.
      profile_id:
        type: string
        description: The ID of the shipping profile.
      price:
        type: integer
        description: The price of the shipping.
      data:
        type: object
        description: Any data relevant to the specific shipping method.
      items:
        type: array
        items:
          $ref: "#/components/schemas/LineItem"
        description: Items to ship
  no_notification:
    description: If set to `true`, no notification will be sent to the customer related to this order.
    type: boolean

## Properties

### billing\_address

• `Optional` **billing\_address**: [`AddressPayload`](internal.AddressPayload.md)

#### Defined in

packages/medusa/dist/api/routes/admin/orders/update-order.d.ts:136

___

### customer\_id

• `Optional` **customer\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/update-order.d.ts:141

___

### discounts

• `Optional` **discounts**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/update-order.d.ts:140

___

### email

• `Optional` **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/update-order.d.ts:135

___

### items

• `Optional` **items**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/update-order.d.ts:138

___

### no\_notification

• `Optional` **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/update-order.d.ts:144

___

### payment\_method

• `Optional` **payment\_method**: [`PaymentMethod`](internal-8.PaymentMethod.md)

#### Defined in

packages/medusa/dist/api/routes/admin/orders/update-order.d.ts:142

___

### region

• `Optional` **region**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/update-order.d.ts:139

___

### shipping\_address

• `Optional` **shipping\_address**: [`AddressPayload`](internal.AddressPayload.md)

#### Defined in

packages/medusa/dist/api/routes/admin/orders/update-order.d.ts:137

___

### shipping\_method

• `Optional` **shipping\_method**: [`ShippingMethod`](internal-8.ShippingMethod-3.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/update-order.d.ts:143
