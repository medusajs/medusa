---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostCustomerGroupsReq

[internal](../modules/internal-6.md).AdminPostCustomerGroupsReq

**`Schema`**

AdminPostCustomerGroupsReq
type: object
required:
  - name
properties:
  name:
    type: string
    description: Name of the customer group
  metadata:
    type: object
    description: Metadata of the customer group.
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/customer-groups/create-customer-group.d.ts:83

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customer-groups/create-customer-group.d.ts:82
