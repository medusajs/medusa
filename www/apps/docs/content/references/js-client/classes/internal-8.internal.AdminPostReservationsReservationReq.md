---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostReservationsReservationReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostReservationsReservationReq

**`Schema`**

AdminPostReservationsReservationReq
type: object
properties:
  location_id:
    description: "The ID of the location associated with the reservation."
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

packages/medusa/dist/api/routes/admin/reservations/update-reservation.d.ts:84

___

### location\_id

• `Optional` **location\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/update-reservation.d.ts:83

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/update-reservation.d.ts:85

___

### quantity

• `Optional` **quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/update-reservation.d.ts:82
