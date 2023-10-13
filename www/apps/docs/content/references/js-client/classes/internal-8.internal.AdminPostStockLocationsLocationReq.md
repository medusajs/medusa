---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostStockLocationsLocationReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostStockLocationsLocationReq

**`Schema`**

AdminPostStockLocationsLocationReq
type: object
properties:
  name:
    description: the name of the stock location
    type: string
  address_id:
    description: the stock location address ID
    type: string
  metadata:
    type: object
    description: An optional key-value map with additional details
    example: {car: "white"}
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
  address:
    $ref: "#/components/schemas/StockLocationAddressInput"

## Properties

### address

• `Optional` **address**: [`StockLocationAddress`](internal-8.StockLocationAddress-1.md)

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/update-stock-location.d.ts:102

___

### address\_id

• `Optional` **address\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/update-stock-location.d.ts:103

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/update-stock-location.d.ts:104

___

### name

• `Optional` **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/update-stock-location.d.ts:101
