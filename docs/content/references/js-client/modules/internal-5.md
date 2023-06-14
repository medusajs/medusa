# Namespace: internal

## Classes

- [AdminDeleteCustomerGroupsGroupCustomerBatchReq](../classes/internal-5.AdminDeleteCustomerGroupsGroupCustomerBatchReq.md)
- [AdminGetCustomerGroupsGroupParams](../classes/internal-5.AdminGetCustomerGroupsGroupParams.md)
- [AdminGetCustomerGroupsParams](../classes/internal-5.AdminGetCustomerGroupsParams.md)
- [AdminGetCustomersParams](../classes/internal-5.AdminGetCustomersParams.md)
- [AdminListCustomerSelector](../classes/internal-5.AdminListCustomerSelector.md)
- [AdminPostCustomerGroupsGroupCustomersBatchReq](../classes/internal-5.AdminPostCustomerGroupsGroupCustomersBatchReq.md)
- [AdminPostCustomerGroupsGroupReq](../classes/internal-5.AdminPostCustomerGroupsGroupReq.md)
- [AdminPostCustomerGroupsReq](../classes/internal-5.AdminPostCustomerGroupsReq.md)
- [CustomerGroupsBatchCustomer](../classes/internal-5.CustomerGroupsBatchCustomer.md)
- [FilterableCustomerGroupProps](../classes/internal-5.FilterableCustomerGroupProps.md)
- [FindParams](../classes/internal-5.FindParams.md)
- [StringComparisonOperator](../classes/internal-5.StringComparisonOperator.md)

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
