---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostDraftOrdersDraftOrderLineItemsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostDraftOrdersDraftOrderLineItemsReq

**`Schema`**

AdminPostDraftOrdersDraftOrderLineItemsReq
type: object
required:
  - quantity
properties:
  variant_id:
    description: The ID of the Product Variant associated with the line item. If the line item is custom, the `variant_id` should be omitted.
    type: string
  unit_price:
    description: The custom price of the line item. If a `variant_id` is supplied, the price provided here will override the variant's price.
    type: integer
  title:
    description: The title of the line item if `variant_id` is not provided.
    type: string
    default: "Custom item"
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

packages/medusa/dist/api/routes/admin/draft-orders/create-line-item.d.ts:97

___

### quantity

• **quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-line-item.d.ts:96

___

### title

• `Optional` **title**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-line-item.d.ts:93

___

### unit\_price

• `Optional` **unit\_price**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-line-item.d.ts:94

___

### variant\_id

• `Optional` **variant\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-line-item.d.ts:95
