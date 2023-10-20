---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderSwapsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderSwapsReq

**`Schema`**

AdminPostOrdersOrderSwapsReq
type: object
required:
  - return_items
properties:
  return_items:
    description: The Line Items to associate with the swap's return.
    type: array
    items:
      type: object
      required:
        - item_id
        - quantity
      properties:
        item_id:
          description: The ID of the Line Item that will be returned.
          type: string
        quantity:
          description: The number of items that will be returned
          type: integer
        reason_id:
          description: The ID of the Return Reason to use.
          type: string
        note:
          description: An optional note with information about the Return.
          type: string
  return_shipping:
    description: The shipping method associated with the swap's return.
    type: object
    required:
      - option_id
    properties:
      option_id:
        type: string
        description: The ID of the Shipping Option to create the Shipping Method from.
      price:
        type: integer
        description: The price to charge for the Shipping Method.
  additional_items:
    description: The new items to send to the Customer.
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
          description: The quantity of the Product Variant.
          type: integer
  custom_shipping_options:
    description: An array of custom shipping options to potentially create a Shipping Method from to send the additional items.
    type: array
    items:
      type: object
      required:
        - option_id
        - price
      properties:
        option_id:
          description: The ID of the Shipping Option.
          type: string
        price:
          description: The custom price of the Shipping Option.
          type: integer
  no_notification:
    description: If set to `true`, no notification will be sent to the customer related to this Swap.
    type: boolean
  allow_backorder:
    description: If set to `true`, swaps can be completed with items out of stock
    type: boolean
    default: true

## Properties

### additional\_items

• `Optional` **additional\_items**: [`AdditionalItem`](internal-8.AdditionalItem-1.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-swap.d.ts:164

___

### allow\_backorder

• `Optional` **allow\_backorder**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-swap.d.ts:168

___

### custom\_shipping\_options

• `Optional` **custom\_shipping\_options**: [`CustomShippingOption`](internal-8.CustomShippingOption.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-swap.d.ts:165

___

### no\_notification

• `Optional` **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-swap.d.ts:166

___

### return\_items

• **return\_items**: [`ReturnItem`](internal-8.ReturnItem.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-swap.d.ts:161

___

### return\_location\_id

• `Optional` **return\_location\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-swap.d.ts:167

___

### return\_shipping

• `Optional` **return\_shipping**: [`ReturnShipping`](internal-8.ReturnShipping-1.md)

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-swap.d.ts:162

___

### sales\_channel\_id

• `Optional` **sales\_channel\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-swap.d.ts:163
