---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderClaimsClaimShipmentsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderClaimsClaimShipmentsReq

**`Schema`**

AdminPostOrdersOrderClaimsClaimShipmentsReq
type: object
required:
  - fulfillment_id
properties:
  fulfillment_id:
    description: The ID of the Fulfillment.
    type: string
  tracking_numbers:
    description: An array of tracking numbers for the shipment.
    type: array
    items:
      type: string

## Properties

### fulfillment\_id

• **fulfillment\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim-shipment.d.ts:91

___

### tracking\_numbers

• `Optional` **tracking\_numbers**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim-shipment.d.ts:92
