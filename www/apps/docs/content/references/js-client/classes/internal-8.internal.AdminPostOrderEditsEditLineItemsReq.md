---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrderEditsEditLineItemsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrderEditsEditLineItemsReq

**`Schema`**

AdminPostOrderEditsEditLineItemsReq
type: object
required:
  - variant_id
  - quantity
properties:
  variant_id:
    description: The ID of the product variant associated with the item.
    type: string
  quantity:
    description: The quantity of the item.
    type: number
  metadata:
    description: An optional set of key-value pairs to hold additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/order-edits/add-line-item.d.ts:90

___

### quantity

• **quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/order-edits/add-line-item.d.ts:89

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/order-edits/add-line-item.d.ts:88
