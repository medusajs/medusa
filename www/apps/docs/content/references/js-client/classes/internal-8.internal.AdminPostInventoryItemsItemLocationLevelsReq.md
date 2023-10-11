---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostInventoryItemsItemLocationLevelsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostInventoryItemsItemLocationLevelsReq

**`Schema`**

AdminPostInventoryItemsItemLocationLevelsReq
type: object
required:
  - location_id
  - stocked_quantity
properties:
  location_id:
    description: the ID of the stock location
    type: string
  stocked_quantity:
    description: the stock quantity of the inventory item at this location
    type: number
  incoming_quantity:
    description: the incoming stock quantity of the inventory item at this location
    type: number

## Properties

### incoming\_quantity

• `Optional` **incoming\_quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-location-level.d.ts:93

___

### location\_id

• **location\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-location-level.d.ts:91

___

### stocked\_quantity

• **stocked\_quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-location-level.d.ts:92
