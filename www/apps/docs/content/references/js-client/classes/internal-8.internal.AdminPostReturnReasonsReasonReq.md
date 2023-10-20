---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostReturnReasonsReasonReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostReturnReasonsReasonReq

**`Schema`**

AdminPostReturnReasonsReasonReq
type: object
properties:
  label:
    description: "The label to display to the Customer."
    type: string
  value:
    description: "A unique value of the return reason."
    type: string
  description:
    description: "The description of the Reason."
    type: string
  metadata:
    description: An optional set of key-value pairs with additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### description

• `Optional` **description**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/return-reasons/update-reason.d.ts:89

___

### label

• `Optional` **label**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/return-reasons/update-reason.d.ts:87

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/return-reasons/update-reason.d.ts:90

___

### value

• `Optional` **value**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/return-reasons/update-reason.d.ts:88
