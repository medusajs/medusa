---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostStockLocationsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostStockLocationsReq

**`Schema`**

AdminPostStockLocationsReq
type: object
required:
  - name
properties:
  name:
    description: the name of the stock location
    type: string
  address_id:
    description: the ID of an existing stock location address to associate with the stock location. Only required if `address` is not provided.
    type: string
  metadata:
    type: object
    description: An optional key-value map with additional details
    example: {car: "white"}
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
  address:
    description: A new stock location address to create and associate with the stock location. Only required if `address_id` is not provided.
    $ref: "#/components/schemas/StockLocationAddressInput"

## Properties

### address

• `Optional` **address**: [`StockLocationAddress`](internal-8.StockLocationAddress.md)

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:145

___

### address\_id

• `Optional` **address\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:146

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:147

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:144
