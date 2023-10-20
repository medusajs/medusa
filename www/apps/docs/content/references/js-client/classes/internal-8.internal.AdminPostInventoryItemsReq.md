---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostInventoryItemsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostInventoryItemsReq

**`Schema`**

AdminPostInventoryItemsReq
type: object
required:
  - variant_id
properties:
  variant_id:
    description: The ID of the variant to create the inventory item for.
    type: string
  sku:
    description: The unique SKU of the associated Product Variant.
    type: string
  ean:
    description: The EAN number of the item.
    type: string
  upc:
    description: The UPC number of the item.
    type: string
  barcode:
    description: A generic GTIN field for the Product Variant.
    type: string
  hs_code:
    description: The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
    type: string
  inventory_quantity:
    description: The amount of stock kept of the associated Product Variant.
    type: integer
    default: 0
  allow_backorder:
    description: Whether the associated Product Variant can be purchased when out of stock.
    type: boolean
  manage_inventory:
    description: Whether Medusa should keep track of the inventory for the associated Product Variant.
    type: boolean
    default: true
  weight:
    description: The weight of the Inventory Item. May be used in shipping rate calculations.
    type: number
  length:
    description: The length of the Inventory Item. May be used in shipping rate calculations.
    type: number
  height:
    description: The height of the Inventory Item. May be used in shipping rate calculations.
    type: number
  width:
    description: The width of the Inventory Item. May be used in shipping rate calculations.
    type: number
  origin_country:
    description: The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
    type: string
  mid_code:
    description: The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
    type: string
  material:
    description: The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
    type: string
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

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:144

___

### height

• `Optional` **height**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:138

___

### hs\_code

• `Optional` **hs\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:135

___

### length

• `Optional` **length**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:137

___

### material

• `Optional` **material**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:142

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:146

___

### mid\_code

• `Optional` **mid\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:141

___

### origin\_country

• `Optional` **origin\_country**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:140

___

### sku

• `Optional` **sku**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:134

___

### thumbnail

• `Optional` **thumbnail**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:145

___

### title

• `Optional` **title**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:143

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:133

___

### weight

• `Optional` **weight**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:136

___

### width

• `Optional` **width**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/create-inventory-item.d.ts:139
