---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostDraftOrdersDraftOrderLineItemsItemReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostDraftOrdersDraftOrderLineItemsItemReq

**`Schema`**

AdminPostDraftOrdersDraftOrderLineItemsItemReq
type: object
properties:
  unit_price:
    description: The custom price of the line item. If a `variant_id` is supplied, the price provided here will override the variant's price.
    type: integer
  title:
    description: The title of the line item if `variant_id` is not provided.
    type: string
  quantity:
    description: The quantity of the line item.
    type: integer
  metadata:
    description: The optional key-value map with additional details about the Line Item.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-line-item.d.ts:91

___

### quantity

• `Optional` **quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-line-item.d.ts:90

___

### title

• `Optional` **title**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-line-item.d.ts:88

___

### unit\_price

• `Optional` **unit\_price**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-line-item.d.ts:89
