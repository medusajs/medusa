---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostDraftOrdersDraftOrderReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostDraftOrdersDraftOrderReq

**`Schema`**

AdminPostDraftOrdersDraftOrderReq
type: object
properties:
  region_id:
    type: string
    description: The ID of the Region to create the Draft Order in.
  country_code:
    type: string
    description: "The 2 character ISO code for the Country."
    externalDocs:
       url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
       description: See a list of codes.
  email:
    type: string
    description: "An email to be used in the Draft Order."
    format: email
  billing_address:
    description: "The Address to be used for billing purposes."
    anyOf:
      - $ref: "#/components/schemas/AddressPayload"
      - type: string
  shipping_address:
    description: "The Address to be used for shipping purposes."
    anyOf:
      - $ref: "#/components/schemas/AddressPayload"
      - type: string
  discounts:
    description: "An array of Discount codes to add to the Draft Order."
    type: array
    items:
      type: object
      required:
        - code
      properties:
        code:
          description: "The code that a Discount is identifed by."
          type: string
  no_notification_order:
    description: "An optional flag passed to the resulting order that indicates whether the customer should receive notifications about order updates."
    type: boolean
  customer_id:
    description: "The ID of the customer this draft order is associated with."
    type: string

## Properties

### billing\_address

• `Optional` **billing\_address**: `string` \| [`AddressPayload`](internal.AddressPayload.md)

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-draft-order.d.ts:116

___

### country\_code

• `Optional` **country\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-draft-order.d.ts:114

___

### customer\_id

• `Optional` **customer\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-draft-order.d.ts:119

___

### discounts

• `Optional` **discounts**: [`Discount`](internal-8.Discount-1.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-draft-order.d.ts:118

___

### email

• `Optional` **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-draft-order.d.ts:115

___

### no\_notification\_order

• `Optional` **no\_notification\_order**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-draft-order.d.ts:120

___

### region\_id

• `Optional` **region\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-draft-order.d.ts:113

___

### shipping\_address

• `Optional` **shipping\_address**: `string` \| [`AddressPayload`](internal.AddressPayload.md)

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/update-draft-order.d.ts:117
