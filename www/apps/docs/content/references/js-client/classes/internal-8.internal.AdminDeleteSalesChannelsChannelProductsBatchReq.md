---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDeleteSalesChannelsChannelProductsBatchReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminDeleteSalesChannelsChannelProductsBatchReq

**`Schema`**

AdminDeleteSalesChannelsChannelProductsBatchReq
type: object
required:
  - product_ids
properties:
  product_ids:
    description: The IDs of the products to remove from the Sales Channel.
    type: array
    items:
      type: object
      required:
        - id
      properties:
        id:
          description: The ID of a product
          type: string

## Properties

### product\_ids

• **product\_ids**: [`ProductBatchSalesChannel`](internal-8.ProductBatchSalesChannel.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/sales-channels/delete-products-batch.d.ts:95
