---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostReservationsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostReservationsReq

**`Schema`**

AdminPostReservationsReq
type: object
required:
  - location_id
  - inventory_item_id
  - quantity
properties:
  line_item_id:
    description: "The ID of the line item of the reservation."
    type: string
  location_id:
    description: "The ID of the location of the reservation."
    type: string
  inventory_item_id:
    description: "The ID of the inventory item the reservation is associated with."
    type: string
  quantity:
    description: "The quantity to reserve."
    type: number
  metadata:
    description: An optional set of key-value pairs with additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### description

• `Optional` **description**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/create-reservation.d.ts:100

___

### inventory\_item\_id

• **inventory\_item\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/create-reservation.d.ts:98

___

### line\_item\_id

• `Optional` **line\_item\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/create-reservation.d.ts:96

___

### location\_id

• **location\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/create-reservation.d.ts:97

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/create-reservation.d.ts:101

___

### quantity

• **quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/create-reservation.d.ts:99
