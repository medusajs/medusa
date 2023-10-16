---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderClaimsClaimFulfillmentsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderClaimsClaimFulfillmentsReq

**`Schema`**

AdminPostOrdersOrderClaimsClaimFulfillmentsReq
type: object
properties:
  metadata:
    description: An optional set of key-value pairs to hold additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
  no_notification:
    description: If set to `true`, no notification will be sent to the customer related to this Claim.
    type: boolean

## Properties

### location\_id

• `Optional` **location\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/fulfill-claim.d.ts:86

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/orders/fulfill-claim.d.ts:84

___

### no\_notification

• `Optional` **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/fulfill-claim.d.ts:85
