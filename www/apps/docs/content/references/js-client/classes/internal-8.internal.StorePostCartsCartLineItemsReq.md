---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostCartsCartLineItemsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostCartsCartLineItemsReq

**`Schema`**

StorePostCartsCartLineItemsReq
type: object
required:
  - variant_id
  - quantity
properties:
  variant_id:
    type: string
    description: The id of the Product Variant to generate the Line Item from.
  quantity:
    type: number
    description: The quantity of the Product Variant to add to the Line Item.
  metadata:
    type: object
    description: An optional key-value map with additional details about the Line Item.
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/store/carts/create-line-item/index.d.ts:83

___

### quantity

• **quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/store/carts/create-line-item/index.d.ts:82

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/carts/create-line-item/index.d.ts:81
