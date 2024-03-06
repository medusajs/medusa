import { Product, ProductType, ShippingOption } from "@medusajs/medusa"
import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"
import { Button } from "@medusajs/ui"
import { OnChangeFn, RowSelectionState } from "@tanstack/react-table"
import {
  useAdminProductTypes,
  useAdminProducts,
  useAdminShippingOptions,
} from "medusa-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { SplitView } from "../../../../../components/layout/split-view"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useShippingOptionTableFilters } from "../../../../../hooks/table/filters/use-shipping-option-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useShippingOptionTableQuery } from "../../../../../hooks/table/query/use-shipping-option-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { Override } from "../../constants"
import { useProductOverrideTableColumns } from "../../hooks/columns/use-product-override-table-columns"
import { useProductTypeOverrideTableColumns } from "../../hooks/columns/use-product-type-override-table-columns"
import { useShippingOptionOverrideTableColumns } from "../../hooks/columns/use-shipping-option-override-table-columns"
import { useProductTypeOverrideTableFilters } from "../../hooks/filters/use-product-type-override-table-filters"
import { useProductTypeOverrideTableQuery } from "../../hooks/query/use-product-type-override-table-query"
import { OverrideOption } from "../../types"

const PAGE_SIZE = 50

const PRODUCT_PREFIX = "product"
const PRODUCT_TYPE_PREFIX = "product_type"
const SHIPPING_OPTION_PREFIX = "shipping_option"

type OverrideProps = {
  selected: OverrideOption[]
  onSave: (options: OverrideOption[]) => void
}

const initRowState = (selected: OverrideOption[] = []): RowSelectionState => {
  return selected.reduce((acc, { value }) => {
    acc[value] = true
    return acc
  }, {} as RowSelectionState)
}

const OverrideFooter = ({ onSave }: { onSave: () => void }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-end gap-x-2 border-t p-4">
      <SplitView.Close type="button" asChild>
        <Button variant="secondary" size="small">
          {t("actions.cancel")}
        </Button>
      </SplitView.Close>
      <Button size="small" type="button" onClick={onSave}>
        {t("actions.save")}
      </Button>
    </div>
  )
}

const ProductOverrideTable = ({ selected = [], onSave }: OverrideProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initRowState(selected)
  )
  const [intermediate, setIntermediate] = useState<Product[]>([])

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

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    let newState: RowSelectionState

    if (typeof fn === "function") {
      newState = fn(rowSelection)
    } else {
      newState = fn
    }

    const diff = Object.keys(newState).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (diff.length === 0) {
      return
    }

    const addedProducts = (products?.filter((p) => diff.includes(p.id!)) ??
      []) as Product[]

    if (addedProducts) {
      setIntermediate((prev) => {
        const update = Array.from(new Set([...prev, ...addedProducts]))

        return update
      })
    }

    setRowSelection(newState)
  }

  const handleSave = () => {
    const options = intermediate.map((p) => ({
      value: p.id!,
      label: p.title,
    }))

    onSave(options)
  }

  const columns = useProductOverrideTableColumns()
  const filters = useProductTableFilters()

  const { table } = useDataTable({
    data: (products ?? []) as Product[],
    columns: columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater: updater as OnChangeFn<RowSelectionState>,
    },
    prefix: PRODUCT_PREFIX,
  })

  if (isError) {
    throw error
  }

  return (
    <div className="flex size-full flex-col overflow-hidden">
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
      <OverrideFooter onSave={handleSave} />
    </div>
  )
}

const ProductTypeOverrideTable = ({ onSave, selected }: OverrideProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initRowState(selected)
  )
  const [intermediate, setIntermediate] = useState<ProductType[]>([])

  const { searchParams, raw } = useProductTypeOverrideTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PRODUCT_TYPE_PREFIX,
  })
  const { product_types, count, isLoading, isError, error } =
    useAdminProductTypes(
      {
        ...searchParams,
      },
      {
        keepPreviousData: true,
      }
    )

  const updater = (newState: RowSelectionState) => {
    const diff = Object.keys(newState).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (diff.length === 0) {
      return
    }

    const addedProductTypes =
      product_types?.filter((p) => diff.includes(p.id!)) ?? []

    if (addedProductTypes) {
      setIntermediate((prev) => {
        const update = Array.from(new Set([...prev, ...addedProductTypes]))

        return update
      })
    }

    setRowSelection(newState)
  }

  const handleSave = () => {
    const options = intermediate.map((p) => ({
      value: p.id!,
      label: p.value,
    }))

    onSave(options)
  }

  const columns = useProductTypeOverrideTableColumns()
  const filters = useProductTypeOverrideTableFilters()

  const { table } = useDataTable({
    data: product_types ?? [],
    columns: columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater: updater as OnChangeFn<RowSelectionState>,
    },
    prefix: PRODUCT_TYPE_PREFIX,
  })

  if (isError) {
    throw error
  }

  return (
    <div className="flex size-full flex-col overflow-hidden">
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
        orderBy={["value", "created_at", "updated_at"]}
        prefix={PRODUCT_PREFIX}
      />
      <OverrideFooter onSave={handleSave} />
    </div>
  )
}

const ShippingOptionOverrideTable = ({
  onSave,
  selected,
  regionId,
}: OverrideProps & { regionId: string }) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initRowState(selected)
  )
  const [intermediate, setIntermediate] = useState<ShippingOption[]>([])

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

  const updater = (newState: RowSelectionState) => {
    const diff = Object.keys(newState).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (diff.length === 0) {
      return
    }

    const addedShippingOptions =
      shipping_options?.filter((p) => diff.includes(p.id!)) ?? []

    if (addedShippingOptions) {
      setIntermediate((prev) => {
        const update = Array.from(new Set([...prev, ...addedShippingOptions]))

        return update
      })
    }

    setRowSelection(newState)
  }

  const handleSave = () => {
    const options = intermediate.map((p) => ({
      value: p.id!,
      label: p.name,
    }))

    onSave(options)
  }

  const columns = useShippingOptionOverrideTableColumns()
  const filters = useShippingOptionTableFilters()

  const { table } = useDataTable({
    data: (shipping_options ?? []) as unknown as PricedShippingOption[],
    columns: columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id!,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater: updater as OnChangeFn<RowSelectionState>,
    },
    prefix: SHIPPING_OPTION_PREFIX,
  })

  if (isError) {
    throw error
  }

  return (
    <div className="flex size-full flex-col overflow-hidden">
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
      <OverrideFooter onSave={handleSave} />
    </div>
  )
}

type OverrideTableProps = {
  product: OverrideProps
  productType: OverrideProps
  shippingOption: OverrideProps
  regionId: string
  selected: Override | null
}

export const OverrideTable = ({
  product,
  productType,
  shippingOption,
  regionId,
  selected,
}: OverrideTableProps) => {
  switch (selected) {
    case Override.PRODUCT:
      return <ProductOverrideTable {...product} />
    case Override.PRODUCT_TYPE:
      return <ProductTypeOverrideTable {...productType} />
    case Override.SHIPPING_OPTION:
      return (
        <ShippingOptionOverrideTable {...shippingOption} regionId={regionId} />
      )
    default:
      return null
  }
}
