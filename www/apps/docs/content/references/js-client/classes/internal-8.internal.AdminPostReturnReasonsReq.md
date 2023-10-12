---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostReturnReasonsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostReturnReasonsReq

**`Schema`**

AdminPostReturnReasonsReq
type: object
required:
 - label
 - value
properties:
  label:
    description: "The label to display to the Customer."
    type: string
  value:
    description: "A unique value of the return reason."
    type: string
  parent_return_reason_id:
    description: "The ID of the parent return reason."
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

packages/medusa/dist/api/routes/admin/return-reasons/create-reason.d.ts:96

___

### label

• **label**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/return-reasons/create-reason.d.ts:94

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/return-reasons/create-reason.d.ts:97

___

### parent\_return\_reason\_id

• `Optional` **parent\_return\_reason\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/return-reasons/create-reason.d.ts:95

___

### value

• **value**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/return-reasons/create-reason.d.ts:93
