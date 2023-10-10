---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostDiscountsDiscountDynamicCodesReq

[internal](../modules/internal-8.md).AdminPostDiscountsDiscountDynamicCodesReq

**`Schema`**

AdminPostDiscountsDiscountDynamicCodesReq
type: object
required:
  - code
properties:
  code:
    type: string
    description: A unique code that will be used to redeem the Discount
  usage_limit:
    type: number
    description: Maximum number of times the discount code can be used
    default: 1
  metadata:
    type: object
    description: An optional set of key-value pairs to hold additional information.
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### code

• **code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/discounts/create-dynamic-code.d.ts:89

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/discounts/create-dynamic-code.d.ts:91

___

### usage\_limit

• **usage\_limit**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/discounts/create-dynamic-code.d.ts:90
