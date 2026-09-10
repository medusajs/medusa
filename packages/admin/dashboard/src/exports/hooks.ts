/**
 * Public hook exports for `@medusajs/dashboard/hooks`.
 */

export {
  customersQueryKeys,
  useCustomer,
  useCustomerAddress,
  useCustomers,
  useListCustomerAddresses,
} from "../hooks/api/customers"

export {
  ordersQueryKeys,
  useOrder,
  useOrderChanges,
  useOrderPreview,
  useUpdateOrder,
} from "../hooks/api/orders"

export { useRequestOrderEdit } from "../hooks/api/order-edits"

export {
  productsQueryKeys,
  useCreateProduct,
  useDeleteProduct,
  useDeleteVariantLazy,
  useProduct,
  useProductVariants,
  useProducts,
  useUpdateProduct,
  useUpdateProductVariantsBatch,
  variantsQueryKeys,
} from "../hooks/api/products"

export {
  productVariantQueryKeys,
  useInfiniteVariants,
  useVariants,
} from "../hooks/api/product-variants"

export { promotionsQueryKeys, usePromotions } from "../hooks/api/promotions"

export { regionsQueryKeys, useRegion, useRegions } from "../hooks/api/regions"

export {
  salesChannelsQueryKeys,
  useSalesChannel,
  useSalesChannelAddProducts,
  useSalesChannelRemoveProducts,
  useSalesChannels,
} from "../hooks/api/sales-channels"

export {
  shippingOptionsQueryKeys,
  useShippingOption,
  useShippingOptions,
} from "../hooks/api/shipping-options"

export {
  pricePreferencesQueryKeys,
  usePricePreferences,
} from "../hooks/api/price-preferences"

export { storeQueryKeys, useStore } from "../hooks/api/store"

export { useUser } from "../hooks/api/users"

export { useComboboxData } from "../hooks/use-combobox-data"
export { useDate } from "../hooks/use-date"
export { useDebouncedSearch } from "../hooks/use-debounced-search"
export { useQueryParams } from "../hooks/use-query-params"

export { useDataTableDateColumns } from "../components/data-table/helpers/general/use-data-table-date-columns"
export { useDataTableDateFilters } from "../components/data-table/helpers/general/use-data-table-date-filters"

export {
  useSalesChannelTableColumns,
  useSalesChannelTableEmptyState,
  useSalesChannelTableFilters,
  useSalesChannelTableQuery,
} from "../components/data-table/helpers/sales-channels"

export * from "../hooks/use-resource-permissions"
export {
  usePermissions,
  useRegisterPermissions,
  useRequiredPermissions,
  PermissionsProvider,
  PermissionsRequirement,
} from "../providers/permissions-provider"
export {
  PermissionGuard,
  type PermissionGuardProps,
} from "../components/common/permission-guard/permission-guard"
export {
  RoleGuard,
  type RoleGuardProps,
} from "../components/common/role-guard/role-guard"
export { NoPermissions } from "../routes/no-permissions/no-permissions"
