---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostSwapsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostSwapsReq

**`Schema`**

StorePostSwapsReq
type: object
required:
  - order_id
  - return_items
  - additional_items
properties:
  order_id:
    type: string
    description: The ID of the Order to create the Swap for.
  return_items:
    description: "The items to include in the Return."
    type: array
    items:
      type: object
      required:
        - item_id
        - quantity
      properties:
        item_id:
          description: The ID of the order's line item to return.
          type: string
        quantity:
          description: The quantity to return.
          type: integer
        reason_id:
          description: The ID of the reason of this return. Return reasons can be retrieved from the List Return Reasons endpoint.
          type: string
        note:
          description: The note to add to the item being swapped.
          type: string
  return_shipping_option:
    type: string
    description: The ID of the Shipping Option to create the Shipping Method from.
  additional_items:
    description: "The items to exchange the returned items with."
    type: array
    items:
      type: object
      required:
        - variant_id
        - quantity
      properties:
        variant_id:
          description: The ID of the Product Variant.
          type: string
        quantity:
          description: The quantity of the variant.
          type: integer

## Properties

### additional\_items

• **additional\_items**: [`AdditionalItem`](internal-8.AdditionalItem-2.md)[]

#### Defined in

packages/medusa/dist/api/routes/store/swaps/create-swap.d.ts:152

___

### order\_id

• **order\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/swaps/create-swap.d.ts:150

___

### return\_items

• **return\_items**: [`Item`](internal-8.Item-6.md)[]

#### Defined in

packages/medusa/dist/api/routes/store/swaps/create-swap.d.ts:151

___

### return\_shipping\_option

• `Optional` **return\_shipping\_option**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/swaps/create-swap.d.ts:153
