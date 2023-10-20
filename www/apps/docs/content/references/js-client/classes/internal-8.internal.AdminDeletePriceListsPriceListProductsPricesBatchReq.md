---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDeletePriceListsPriceListProductsPricesBatchReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminDeletePriceListsPriceListProductsPricesBatchReq

**`Schema`**

AdminDeletePriceListsPriceListProductsPricesBatchReq
type: object
properties:
  product_ids:
    description: The IDs of the products to delete their associated prices.
    type: array
    items:
      type: string

## Properties

### product\_ids

• **product\_ids**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/delete-products-prices-batch.d.ts:79
