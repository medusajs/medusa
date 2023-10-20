---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostSalesChannelsChannelProductsBatchReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostSalesChannelsChannelProductsBatchReq

**`Schema`**

AdminPostSalesChannelsChannelProductsBatchReq
type: object
required:
  - product_ids
properties:
  product_ids:
    description: The IDs of the products to add to the Sales Channel
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

• **product\_ids**: [`ProductBatchSalesChannel`](internal-8.ProductBatchSalesChannel.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/sales-channels/add-product-batch.d.ts:95
