---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderShipmentReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderShipmentReq

**`Schema`**

AdminPostOrdersOrderShipmentReq
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
    description: If set to true no notification will be send related to this Shipment.
    type: boolean

## Properties

### fulfillment\_id

• **fulfillment\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-shipment.d.ts:93

___

### no\_notification

• `Optional` **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-shipment.d.ts:95

___

### tracking\_numbers

• `Optional` **tracking\_numbers**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-shipment.d.ts:94
