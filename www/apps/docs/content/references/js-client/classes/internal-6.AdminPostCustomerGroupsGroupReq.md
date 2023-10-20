---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostCustomerGroupsGroupReq

[internal](../modules/internal-6.md).AdminPostCustomerGroupsGroupReq

**`Schema`**

AdminPostCustomerGroupsGroupReq
type: object
properties:
  name:
    description: "Name of the customer group"
    type: string
  metadata:
    description: "Metadata of the customer group."
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/customer-groups/update-customer-group.d.ts:83

___

### name

• `Optional` **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customer-groups/update-customer-group.d.ts:82
