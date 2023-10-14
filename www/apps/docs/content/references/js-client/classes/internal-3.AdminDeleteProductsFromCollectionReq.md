---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDeleteProductsFromCollectionReq

[internal](../modules/internal-3.md).AdminDeleteProductsFromCollectionReq

**`Schema`**

AdminDeleteProductsFromCollectionReq
type: object
required:
  - product_ids
properties:
  product_ids:
    description: "An array of Product IDs to remove from the Product Collection."
    type: array
    items:
      description: "The ID of a Product to add to the Product Collection."
      type: string

## Properties

### product\_ids

• **product\_ids**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/collections/remove-products.d.ts:86
