---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostInventoryItemsItemLocationLevelsLevelReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostInventoryItemsItemLocationLevelsLevelReq

**`Schema`**

AdminPostInventoryItemsItemLocationLevelsLevelReq
type: object
properties:
  stocked_quantity:
    description: the total stock quantity of an inventory item at the given location ID
    type: number
  incoming_quantity:
    description: the incoming stock quantity of an inventory item at the given location ID
    type: number

## Properties

### incoming\_quantity

• `Optional` **incoming\_quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-location-level.d.ts:84

___

### stocked\_quantity

• `Optional` **stocked\_quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-location-level.d.ts:85
