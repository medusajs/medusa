---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderShippingMethodsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderShippingMethodsReq

**`Schema`**

AdminPostOrdersOrderShippingMethodsReq
type: object
required:
  - price
  - option_id
properties:
  price:
    type: number
    description: The price (excluding VAT) that should be charged for the Shipping Method
  option_id:
    type: string
    description: The ID of the Shipping Option to create the Shipping Method from.
  date:
    type: object
    description: The data required for the Shipping Option to create a Shipping Method. This depends on the Fulfillment Provider.

## Properties

### data

• `Optional` **data**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/orders/add-shipping-method.d.ts:92

___

### option\_id

• **option\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/add-shipping-method.d.ts:91

___

### price

• **price**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/add-shipping-method.d.ts:90
