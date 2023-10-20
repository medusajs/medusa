---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDeleteCustomerGroupsGroupCustomerBatchReq

[internal](../modules/internal-6.md).AdminDeleteCustomerGroupsGroupCustomerBatchReq

**`Schema`**

AdminDeleteCustomerGroupsGroupCustomerBatchReq
type: object
required:
  - customer_ids
properties:
  customer_ids:
    description: "The ids of the customers to remove"
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

packages/medusa/dist/api/routes/admin/customer-groups/delete-customers-batch.d.ts:95
