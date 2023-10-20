---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostCustomersCustomerOrderClaimReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostCustomersCustomerOrderClaimReq

**`Schema`**

StorePostCustomersCustomerOrderClaimReq
type: object
required:
  - order_ids
properties:
  order_ids:
    description: "The ID of the orders to claim"
    type: array
    items:
     type: string

## Properties

### order\_ids

• **order\_ids**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/store/orders/request-order.d.ts:80
