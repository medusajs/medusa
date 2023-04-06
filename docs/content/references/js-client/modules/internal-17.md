# Namespace: internal

## Classes

- [AdminDeletePriceListPricesPricesReq](../classes/internal-17.AdminDeletePriceListPricesPricesReq.md)
- [AdminGetPriceListPaginationParams](../classes/internal-17.AdminGetPriceListPaginationParams.md)
- [AdminGetPriceListsPriceListProductsParams](../classes/internal-17.AdminGetPriceListsPriceListProductsParams.md)
- [AdminPostPriceListPricesPricesReq](../classes/internal-17.AdminPostPriceListPricesPricesReq.md)
- [AdminPostPriceListsPriceListPriceListReq](../classes/internal-17.AdminPostPriceListsPriceListPriceListReq.md)
- [AdminPostPriceListsPriceListReq](../classes/internal-17.AdminPostPriceListsPriceListReq.md)
- [AdminPriceListPricesCreateReq](../classes/internal-17.AdminPriceListPricesCreateReq.md)
- [AdminPriceListPricesUpdateReq](../classes/internal-17.AdminPriceListPricesUpdateReq.md)
- [CustomerGroup](../classes/internal-17.CustomerGroup.md)
- [CustomerGroup](../classes/internal-17.CustomerGroup-1.md)
- [FilterablePriceListProps](../classes/internal-17.FilterablePriceListProps.md)

## Type Aliases

### AdminPriceListDeleteBatchRes

Ƭ **AdminPriceListDeleteBatchRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deleted` | `boolean` |
| `ids` | `string`[] |
| `object` | `string` |

#### Defined in

medusa/dist/api/routes/admin/price-lists/index.d.ts:13

___

### AdminPriceListRes

Ƭ **AdminPriceListRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `price_list` | [`PriceList`](../classes/internal.PriceList.md) |

#### Defined in

medusa/dist/api/routes/admin/price-lists/index.d.ts:10

___

### AdminPriceListsListRes

Ƭ **AdminPriceListsListRes**: [`PaginatedResponse`](internal-2.md#paginatedresponse) & { `price_lists`: [`PriceList`](../classes/internal.PriceList.md)[]  }

#### Defined in

medusa/dist/api/routes/admin/price-lists/index.d.ts:21

## Variables

### AdminGetPriceListsPriceListProductsParams\_base

• `Const` **AdminGetPriceListsPriceListProductsParams\_base**: [`"/home/runner/work/medusa/medusa/packages/medusa/dist/types/global"`](internal-7.__home_runner_work_medusa_medusa_packages_medusa_dist_types_global_.md)

#### Defined in

medusa/dist/api/routes/admin/price-lists/list-price-list-products.d.ts:175
