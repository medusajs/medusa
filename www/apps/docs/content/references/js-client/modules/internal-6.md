---
displayed_sidebar: jsClientSidebar
---

# Module: internal

## Classes

- [AdminDeleteCustomerGroupsGroupCustomerBatchReq](../classes/internal-6.AdminDeleteCustomerGroupsGroupCustomerBatchReq.md)
- [AdminGetCustomerGroupsGroupParams](../classes/internal-6.AdminGetCustomerGroupsGroupParams.md)
- [AdminGetCustomerGroupsParams](../classes/internal-6.AdminGetCustomerGroupsParams.md)
- [AdminPostCustomerGroupsGroupCustomersBatchReq](../classes/internal-6.AdminPostCustomerGroupsGroupCustomersBatchReq.md)
- [AdminPostCustomerGroupsGroupReq](../classes/internal-6.AdminPostCustomerGroupsGroupReq.md)
- [AdminPostCustomerGroupsReq](../classes/internal-6.AdminPostCustomerGroupsReq.md)
- [CustomerGroupsBatchCustomer](../classes/internal-6.CustomerGroupsBatchCustomer.md)
- [FilterableCustomerGroupProps](../classes/internal-6.FilterableCustomerGroupProps.md)
- [FindParams](../classes/internal-6.FindParams.md)
- [StringComparisonOperator](../classes/internal-6.StringComparisonOperator.md)

## Type Aliases

### AdminCustomerGroupsListRes

Ƭ **AdminCustomerGroupsListRes**: [`PaginatedResponse`](internal-2.md#paginatedresponse) & { `customer_groups`: [`CustomerGroup`](../classes/internal-3.CustomerGroup.md)[]  }

**`Schema`**

AdminCustomerGroupsListRes
type: object
required:
  - customer_groups
  - count
  - offset
  - limit
properties:
  customer_groups:
    type: array
    description: An array of customer group details.
    items:
      $ref: "#/components/schemas/CustomerGroup"
  count:
    type: integer
    description: The total number of items available
  offset:
    type: integer
    description: The number of customer groups skipped when retrieving the customer groups.
  limit:
    type: integer
    description: The number of items per page

#### Defined in

packages/medusa/dist/api/routes/admin/customer-groups/index.d.ts:63

___

### AdminCustomerGroupsRes

Ƭ **AdminCustomerGroupsRes**: `Object`

**`Schema`**

AdminCustomerGroupsRes
type: object
required:
  - customer_group
properties:
  customer_group:
    description: Customer group details.
    $ref: "#/components/schemas/CustomerGroup"

#### Type declaration

| Name | Type |
| :------ | :------ |
| `customer_group` | [`CustomerGroup`](../classes/internal-3.CustomerGroup.md) |

#### Defined in

packages/medusa/dist/api/routes/admin/customer-groups/index.d.ts:15
