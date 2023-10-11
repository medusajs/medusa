---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostStoreReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostStoreReq

**`Schema`**

AdminPostStoreReq
type: object
properties:
  name:
    description: "The name of the Store"
    type: string
  swap_link_template:
    description: "A template for Swap links - use `{{cart_id}}` to insert the Swap Cart ID"
    type: string
    example: "http://example.com/swaps/{{cart_id}}"
  payment_link_template:
    description: "A template for payment links - use `{{cart_id}}` to insert the Cart ID"
    example: "http://example.com/payments/{{cart_id}}"
    type: string
  invite_link_template:
    description: "A template for invite links - use `{{invite_token}}` to insert the invite token"
    example: "http://example.com/invite?token={{invite_token}}"
    type: string
  default_currency_code:
    description: "The default currency code of the Store."
    type: string
    externalDocs:
      url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
      description: See a list of codes.
  currencies:
    description: "Array of available currencies in the store. Each currency is in 3 character ISO code format."
    type: array
    items:
      type: string
      externalDocs:
        url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
        description: See a list of codes.
  metadata:
    description: "An optional set of key-value pairs with additional information."
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### currencies

• `Optional` **currencies**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/store/update-store.d.ts:110

___

### default\_currency\_code

• `Optional` **default\_currency\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/store/update-store.d.ts:109

___

### invite\_link\_template

• `Optional` **invite\_link\_template**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/store/update-store.d.ts:108

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/store/update-store.d.ts:111

___

### name

• `Optional` **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/store/update-store.d.ts:105

___

### payment\_link\_template

• `Optional` **payment\_link\_template**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/store/update-store.d.ts:107

___

### swap\_link\_template

• `Optional` **swap\_link\_template**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/store/update-store.d.ts:106
