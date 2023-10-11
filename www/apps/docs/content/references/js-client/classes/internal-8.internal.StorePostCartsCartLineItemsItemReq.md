---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostCartsCartLineItemsItemReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostCartsCartLineItemsItemReq

**`Schema`**

StorePostCartsCartLineItemsItemReq
type: object
required:
  - quantity
properties:
  quantity:
    type: number
    description: The quantity of the line item in the cart.
  metadata:
    type: object
    description: An optional key-value map with additional details about the Line Item. If omitted, the metadata will remain unchanged."
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/store/carts/update-line-item.d.ts:76

___

### quantity

• **quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/store/carts/update-line-item.d.ts:75
