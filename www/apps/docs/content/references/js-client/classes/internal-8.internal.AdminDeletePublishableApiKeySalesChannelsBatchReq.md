---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDeletePublishableApiKeySalesChannelsBatchReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminDeletePublishableApiKeySalesChannelsBatchReq

**`Schema`**

AdminDeletePublishableApiKeySalesChannelsBatchReq
type: object
required:
  - sales_channel_ids
properties:
  sales_channel_ids:
    description: The IDs of the sales channels to remove from the publishable API key
    type: array
    items:
      type: object
      required:
        - id
      properties:
        id:
          type: string
          description: The ID of the sales channel

## Properties

### sales\_channel\_ids

• **sales\_channel\_ids**: [`ProductBatchSalesChannel`](internal-8.ProductBatchSalesChannel.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/publishable-api-keys/delete-channels-batch.d.ts:95
