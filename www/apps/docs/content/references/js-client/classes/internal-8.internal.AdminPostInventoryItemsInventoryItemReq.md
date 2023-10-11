---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostInventoryItemsInventoryItemReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostInventoryItemsInventoryItemReq

**`Schema`**

AdminPostInventoryItemsInventoryItemReq
type: object
properties:
  hs_code:
    description: The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
    type: string
  origin_country:
    description: The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
    type: string
  mid_code:
    description: The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
    type: string
  material:
    description: The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
    type: string
  weight:
    description: The weight of the Inventory Item. May be used in shipping rate calculations.
    type: number
  height:
    description: The height of the Inventory Item. May be used in shipping rate calculations.
    type: number
  width:
    description: The width of the Inventory Item. May be used in shipping rate calculations.
    type: number
  length:
    description: The length of the Inventory Item. May be used in shipping rate calculations.
    type: number
  requires_shipping:
    description: Whether the item requires shipping.
    type: boolean

## Properties

### description

• `Optional` **description**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:114

___

### height

• `Optional` **height**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:110

___

### hs\_code

• `Optional` **hs\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:106

___

### length

• `Optional` **length**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:111

___

### material

• `Optional` **material**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:108

___

### mid\_code

• `Optional` **mid\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:107

___

### origin\_country

• `Optional` **origin\_country**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:105

___

### requires\_shipping

• `Optional` **requires\_shipping**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:116

___

### sku

• `Optional` **sku**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:104

___

### thumbnail

• `Optional` **thumbnail**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:115

___

### title

• `Optional` **title**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:113

___

### weight

• `Optional` **weight**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:109

___

### width

• `Optional` **width**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/inventory-items/update-inventory-item.d.ts:112
