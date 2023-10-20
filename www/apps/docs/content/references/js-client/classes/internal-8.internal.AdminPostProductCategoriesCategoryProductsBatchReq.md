---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostProductCategoriesCategoryProductsBatchReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostProductCategoriesCategoryProductsBatchReq

**`Schema`**

AdminPostProductCategoriesCategoryProductsBatchReq
type: object
required:
  - product_ids
properties:
  product_ids:
    description: The IDs of the products to add to the Product Category
    type: array
    items:
      type: object
      required:
        - id
      properties:
        id:
          type: string
          description: The ID of the product

## Properties

### product\_ids

• **product\_ids**: [`ProductBatchProductCategory`](internal-8.ProductBatchProductCategory.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/product-categories/add-products-batch.d.ts:100
