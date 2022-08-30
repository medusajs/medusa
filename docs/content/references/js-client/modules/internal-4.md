# Namespace: internal

## Classes

- [AdminDeleteCustomerGroupsGroupCustomerBatchReq](../classes/internal-4.AdminDeleteCustomerGroupsGroupCustomerBatchReq.md)
- [AdminGetCustomerGroupsGroupParams](../classes/internal-4.AdminGetCustomerGroupsGroupParams.md)
- [AdminGetCustomerGroupsParams](../classes/internal-4.AdminGetCustomerGroupsParams.md)
- [AdminGetCustomersParams](../classes/internal-4.AdminGetCustomersParams.md)
- [AdminListCustomerSelector](../classes/internal-4.AdminListCustomerSelector.md)
- [AdminPostCustomerGroupsGroupCustomersBatchReq](../classes/internal-4.AdminPostCustomerGroupsGroupCustomersBatchReq.md)
- [AdminPostCustomerGroupsGroupReq](../classes/internal-4.AdminPostCustomerGroupsGroupReq.md)
- [AdminPostCustomerGroupsReq](../classes/internal-4.AdminPostCustomerGroupsReq.md)
- [CustomerGroupsBatchCustomer](../classes/internal-4.CustomerGroupsBatchCustomer.md)
- [FilterableCustomerGroupProps](../classes/internal-4.FilterableCustomerGroupProps.md)
- [FindParams](../classes/internal-4.FindParams.md)
- [StringComparisonOperator](../classes/internal-4.StringComparisonOperator.md)

## Type Aliases

### AdminCustomerGroupsListRes

Ƭ **AdminCustomerGroupsListRes**: [`PaginatedResponse`](internal-2.md#paginatedresponse) & { `customer_groups`: [`CustomerGroup`](../classes/internal.CustomerGroup.md)[]  }

#### Defined in

medusa/dist/api/routes/admin/customer-groups/index.d.ts:9

___

### AdminCustomerGroupsRes

Ƭ **AdminCustomerGroupsRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `customer_group` | [`CustomerGroup`](../classes/internal.CustomerGroup.md) |

#### Defined in

medusa/dist/api/routes/admin/customer-groups/index.d.ts:5

___

### AdminCustomersListRes

Ƭ **AdminCustomersListRes**: [`PaginatedResponse`](internal-2.md#paginatedresponse) & { `customers`: [`Customer`](../classes/internal.Customer.md)[]  }

#### Defined in

medusa/dist/api/routes/admin/customers/index.d.ts:9
