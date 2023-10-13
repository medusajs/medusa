---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostProductsToCollectionReq

[internal](../modules/internal-3.md).AdminPostProductsToCollectionReq

**`Schema`**

AdminPostProductsToCollectionReq
type: object
required:
  - product_ids
properties:
  product_ids:
    description: "An array of Product IDs to add to the Product Collection."
    type: array
    items:
      description: "The ID of a Product to add to the Product Collection."
      type: string

## Properties

### product\_ids

• **product\_ids**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/collections/add-products.d.ts:86
