---
displayed_sidebar: jsClientSidebar
---

# Class: StockLocationAddress

[internal](../modules/internal-8.md).StockLocationAddress

**`Schema`**

AdminPostStockLocationsReqAddress
type: object
required:
  - address_1
  - country_code
properties:
  address_1:
    type: string
    description: Stock location address
    example: 35, Jhon Doe Ave
  address_2:
    type: string
    description: Stock location address' complement
    example: apartment 4432
  company:
    type: string
    description: Stock location address' company
  city:
    type: string
    description: Stock location address' city
    example: Mexico city
  country_code:
    description: "The 2 character ISO code for the country."
    type: string
    externalDocs:
      url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
      description: See a list of codes.
  phone:
    type: string
    description: Stock location address' phone number
    example: +1 555 61646
  postal_code:
    type: string
    description: Stock location address' postal code
    example: HD3-1G8
  province:
    type: string
    description: Stock location address' province
    example: Sinaloa

## Properties

### address\_1

• **address\_1**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:111

___

### address\_2

• `Optional` **address\_2**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:112

___

### city

• `Optional` **city**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:114

___

### company

• `Optional` **company**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:113

___

### country\_code

• **country\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:115

___

### phone

• `Optional` **phone**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:116

___

### postal\_code

• `Optional` **postal\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:117

___

### province

• `Optional` **province**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/stock-locations/create-stock-location.d.ts:118
