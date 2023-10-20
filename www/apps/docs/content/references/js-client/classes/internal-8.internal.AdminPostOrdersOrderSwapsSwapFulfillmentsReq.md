---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderSwapsSwapFulfillmentsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderSwapsSwapFulfillmentsReq

**`Schema`**

AdminPostOrdersOrderSwapsSwapFulfillmentsReq
type: object
properties:
  metadata:
    description: An optional set of key-value pairs to hold additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
  no_notification:
    description: If set to `true`, no notification will be sent to the customer related to this swap.
    type: boolean

## Properties

### location\_id

• `Optional` **location\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/fulfill-swap.d.ts:87

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/orders/fulfill-swap.d.ts:85

___

### no\_notification

• `Optional` **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/fulfill-swap.d.ts:86
