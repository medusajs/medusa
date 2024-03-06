import { Product } from "@medusajs/medusa"
import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"
import { OnChangeFn, RowSelectionState } from "@tanstack/react-table"
import { useAdminProducts, useAdminShippingOptions } from "medusa-react"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useShippingOptionTableColumns } from "../../../../../hooks/table/columns/use-shipping-option-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useShippingOptionTableFilters } from "../../../../../hooks/table/filters/use-shipping-option-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useShippingOptionTableQuery } from "../../../../../hooks/table/query/use-shipping-option-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { OVERRIDE } from "../../constants"

const PAGE_SIZE = 50

const PRODUCT_PREFIX = "product"
const PRODUCT_TYPE_PREFIX = "product_type"
const SHIPPING_OPTION_PREFIX = "shipping_option"

type OverrideProps = {
  updater: OnChangeFn<RowSelectionState>
  state: RowSelectionState
}

const ProductOverrideTable = (props: OverrideProps) => {
  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PRODUCT_PREFIX,
  })
  const { products, count, isLoading, isError, error } = useAdminProducts(
    {
      ...searchParams,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useProductTableColumns()
  const filters = useProductTableFilters()

  const { table } = useDataTable({
    data: (products ?? []) as Product[],
    columns: columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: props,
  })

  if (isError) {
    throw error
  }

  return (
    <DataTable
      table={table}
      columns={columns}
      pageSize={PAGE_SIZE}
      count={count}
      queryObject={raw}
      pagination
      search
      filters={filters}
      isLoading={isLoading}
      layout="fill"
      orderBy={["title", "created_at", "updated_at"]}
      prefix={PRODUCT_PREFIX}
    />
  )
}

const ShippingOptionOverrideTable = (
  props: OverrideProps & { regionId: string }
) => {
  const { regionId, ...state } = props

  const { searchParams, raw } = useShippingOptionTableQuery({
    regionId,
    pageSize: PAGE_SIZE,
    prefix: SHIPPING_OPTION_PREFIX,
  })
  const { shipping_options, count, isLoading, isError, error } =
    useAdminShippingOptions(
      {
        ...searchParams,
      },
      {
        keepPreviousData: true,
      }
    )

  const columns = useShippingOptionTableColumns()
  const filters = useShippingOptionTableFilters()

  const { table } = useDataTable({
    data: (shipping_options ?? []) as unknown as PricedShippingOption[],
    columns: columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id!,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: state,
  })

  if (isError) {
    throw error
  }

  return (
    <DataTable
      table={table}
      columns={columns}
      pageSize={PAGE_SIZE}
      count={count}
      queryObject={raw}
      pagination
      search
      filters={filters}
      isLoading={isLoading}
      layout="fill"
      orderBy={["title", "created_at", "updated_at"]}
      prefix={SHIPPING_OPTION_PREFIX}
    />
  )
}

type OverrideTableProps = {
  product: OverrideProps
  productType: OverrideProps
  shippingOption: OverrideProps
  regionId: string
  selected: OVERRIDE | null
}

export const OverrideTable = ({
  product,
  productType,
  shippingOption,
  regionId,
  selected,
}: OverrideTableProps) => {
  switch (selected) {
    case OVERRIDE.PRODUCT:
      return <ProductOverrideTable {...product} />
    case OVERRIDE.PRODUCT_TYPE:
      return <div>Product type overrides</div>
    case OVERRIDE.SHIPPING_OPTION:
      return (
        <ShippingOptionOverrideTable {...shippingOption} regionId={regionId} />
      )
    default:
      return null
  }
}
