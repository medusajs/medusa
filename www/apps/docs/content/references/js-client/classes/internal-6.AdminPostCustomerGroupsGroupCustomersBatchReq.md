---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostCustomerGroupsGroupCustomersBatchReq

[internal](../modules/internal-6.md).AdminPostCustomerGroupsGroupCustomersBatchReq

**`Schema`**

AdminPostCustomerGroupsGroupCustomersBatchReq
type: object
required:
  - customer_ids
properties:
  customer_ids:
    description: "The ids of the customers to add"
    type: array
    items:
      type: object
      required:
        - id
      properties:
        id:
          description: ID of the customer
          type: string

## Properties

### customer\_ids

• **customer\_ids**: [`CustomerGroupsBatchCustomer`](internal-6.CustomerGroupsBatchCustomer.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/customer-groups/add-customers-batch.d.ts:95
