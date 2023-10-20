---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderSwapsSwapShipmentsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderSwapsSwapShipmentsReq

**`Schema`**

AdminPostOrdersOrderSwapsSwapShipmentsReq
type: object
required:
  - fulfillment_id
properties:
  fulfillment_id:
    description: The ID of the Fulfillment.
    type: string
  tracking_numbers:
    description: The tracking numbers for the shipment.
    type: array
    items:
      type: string
  no_notification:
    description: If set to true no notification will be sent related to this Claim.
    type: boolean

## Properties

### fulfillment\_id

• **fulfillment\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-swap-shipment.d.ts:94

___

### no\_notification

• `Optional` **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-swap-shipment.d.ts:96

___

### tracking\_numbers

• `Optional` **tracking\_numbers**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-swap-shipment.d.ts:95
