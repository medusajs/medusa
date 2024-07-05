import { HttpTypes } from "@medusajs/types"
import { Button, Checkbox } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { useSearchParams } from "react-router-dom"
import {
  StackedDrawer,
  StackedFocusModal,
} from "../../../../../components/modals"
import { DataTable } from "../../../../../components/table/data-table"
import {
  useCollections,
  useCustomerGroups,
  useProductTypes,
  useProducts,
  useTags,
} from "../../../../../hooks/api"
import {
  useCollectionTableColumns,
  useCustomerGroupTableColumns,
  useProductTableColumns,
  useProductTagTableColumns,
  useProductTypeTableColumns,
} from "../../../../../hooks/table/columns"
import {
  useCollectionTableFilters,
  useCustomerGroupTableFilters,
  useProductTableFilters,
  useProductTagTableFilters,
  useProductTypeTableFilters,
} from "../../../../../hooks/table/filters"
import {
  useCollectionTableQuery,
  useCustomerGroupTableQuery,
  useProductTableQuery,
  useProductTagTableQuery,
  useProductTypeTableQuery,
} from "../../../../../hooks/table/query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { TaxRateRuleReferenceType } from "../../constants"
import { TaxRateRuleReference } from "../../schemas"

type TargetFormProps = {
  referenceType: TaxRateRuleReferenceType
  type: "focus" | "drawer"
  state: TaxRateRuleReference[]
  setState: (state: TaxRateRuleReference[]) => void
}

function initRowSelection(state: TaxRateRuleReference[]) {
  return state.reduce((acc, reference) => {
    acc[reference.value] = true
    return acc
  }, {} as RowSelectionState)
}

export const TargetForm = ({
  referenceType,
  type,
  setState,
  state,
}: TargetFormProps) => {
  const { t } = useTranslation()
  const Component = type === "focus" ? StackedFocusModal : StackedDrawer

  const [intermediate, setIntermediate] =
    useState<TaxRateRuleReference[]>(state)

  const handleSave = () => {
    setState(intermediate)
  }

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <Component.Body className="min-h-0 p-0">
        <Table
          referenceType={referenceType}
          initialRowState={initRowSelection(state)}
          intermediate={intermediate}
          setIntermediate={setIntermediate}
        />
      </Component.Body>
      <Component.Footer>
        <Component.Close asChild>
          <Button variant="secondary" size="small" type="button">
            {t("actions.cancel")}
          </Button>
        </Component.Close>
        <Button type="button" size="small" onClick={handleSave}>
          {t("actions.save")}
        </Button>
      </Component.Footer>
    </div>
  )
}

type TableProps = {
  referenceType: TaxRateRuleReferenceType
  initialRowState: RowSelectionState
  intermediate: TaxRateRuleReference[]
  setIntermediate: (state: TaxRateRuleReference[]) => void
}

const Table = ({ referenceType, ...props }: TableProps) => {
  switch (referenceType) {
    case TaxRateRuleReferenceType.CUSTOMER_GROUP:
      return <CustomerGroupTable {...props} />
    case TaxRateRuleReferenceType.PRODUCT:
      return <ProductTable {...props} />
    case TaxRateRuleReferenceType.PRODUCT_COLLECTION:
      return <ProductCollectionTable {...props} />
    case TaxRateRuleReferenceType.PRODUCT_TYPE:
      return <ProductTypeTable {...props} />
    case TaxRateRuleReferenceType.PRODUCT_TAG:
      return <ProductTagTable {...props} />
    default:
      return null
  }
}

type TableImplementationProps = {
  initialRowState: RowSelectionState
  intermediate: TaxRateRuleReference[]
  setIntermediate: (state: TaxRateRuleReference[]) => void
}

const PAGE_SIZE = 50

const PREFIX_CUSTOMER_GROUP = "cg"

const CustomerGroupTable = ({
  initialRowState,
  intermediate,
  setIntermediate,
}: TableImplementationProps) => {
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialRowState)

  useCleanupSearchParams()

  const { searchParams, raw } = useCustomerGroupTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX_CUSTOMER_GROUP,
  })
  const { customer_groups, count, isLoading, isError, error } =
    useCustomerGroups(searchParams, {
      placeholderData: keepPreviousData,
    })

  const updater: OnChangeFn<RowSelectionState> = (value) => {
    const state = typeof value === "function" ? value(rowSelection) : value
    const currentIds = Object.keys(rowSelection)

    const ids = Object.keys(state)

    const newIds = ids.filter((id) => !currentIds.includes(id))
    const removedIds = currentIds.filter((id) => !ids.includes(id))

    const newCustomerGroups =
      customer_groups
        ?.filter((cg) => newIds.includes(cg.id))
        .map((cg) => ({ value: cg.id, label: cg.name! })) || []

    const filteredIntermediate = intermediate.filter(
      (cg) => !removedIds.includes(cg.value)
    )

    setIntermediate([...filteredIntermediate, ...newCustomerGroups])
    setRowSelection(state)
  }

  const filters = useCustomerGroupTableFilters()
  const columns = useGroupColumns()

  const { table } = useDataTable({
    data: customer_groups || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    pageSize: PAGE_SIZE,
    prefix: PREFIX_CUSTOMER_GROUP,
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
      isLoading={isLoading}
      filters={filters}
      orderBy={["name", "created_at", "updated_at"]}
      layout="fill"
      pagination
      search
      prefix={PREFIX_CUSTOMER_GROUP}
      queryObject={raw}
    />
  )
}

const cgColumnHelper = createColumnHelper<HttpTypes.AdminCustomerGroup>()

const useGroupColumns = () => {
  const base = useCustomerGroupTableColumns()

  return useMemo(
    () => [
      cgColumnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
    ],
    [base]
  )
}

const PREFIX_PRODUCT = "p"

const ProductTable = ({
  initialRowState,
  intermediate,
  setIntermediate,
}: TableImplementationProps) => {
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialRowState)

  useCleanupSearchParams()

  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX_PRODUCT,
  })

  const { products, count, isLoading, isError, error } = useProducts(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const updater: OnChangeFn<RowSelectionState> = (value) => {
    const state = typeof value === "function" ? value(rowSelection) : value
    const currentIds = Object.keys(rowSelection)

    const ids = Object.keys(state)

    const newIds = ids.filter((id) => !currentIds.includes(id))
    const removedIds = currentIds.filter((id) => !ids.includes(id))

    const newProducts =
      products
        ?.filter((p) => newIds.includes(p.id))
        .map((p) => ({
          value: p.id,
          label: p.title!,
        })) || []

    const filteredIntermediate = intermediate.filter(
      (p) => !removedIds.includes(p.value)
    )

    setIntermediate([...filteredIntermediate, ...newProducts])
    setRowSelection(state)
  }

  const filters = useProductTableFilters()
  const columns = useProductColumns()

  const { table } = useDataTable({
    data: products || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    pageSize: PAGE_SIZE,
    prefix: PREFIX_PRODUCT,
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
      isLoading={isLoading}
      filters={filters}
      orderBy={["title", "created_at", "updated_at"]}
      layout="fill"
      pagination
      search
      prefix={PREFIX_PRODUCT}
      queryObject={raw}
    />
  )
}

const pColumnHelper = createColumnHelper<HttpTypes.AdminProduct>()

const useProductColumns = () => {
  const base = useProductTableColumns()

  return useMemo(
    () => [
      pColumnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
    ],
    [base]
  )
}

const PREFIX_PRODUCT_COLLECTION = "pc"

const ProductCollectionTable = ({
  initialRowState,
  intermediate,
  setIntermediate,
}: TableImplementationProps) => {
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialRowState)

  useCleanupSearchParams()

  const { searchParams, raw } = useCollectionTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX_PRODUCT_COLLECTION,
  })

  const { collections, count, isLoading, isError, error } = useCollections(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const updater: OnChangeFn<RowSelectionState> = (value) => {
    const state = typeof value === "function" ? value(rowSelection) : value
    const currentIds = Object.keys(rowSelection)

    const ids = Object.keys(state)

    const newIds = ids.filter((id) => !currentIds.includes(id))
    const removedIds = currentIds.filter((id) => !ids.includes(id))

    const newCollections =
      collections
        ?.filter((p) => newIds.includes(p.id))
        .map((p) => ({
          value: p.id,
          label: p.title,
        })) || []

    const filteredIntermediate = intermediate.filter(
      (p) => !removedIds.includes(p.value)
    )

    setIntermediate([...filteredIntermediate, ...newCollections])
    setRowSelection(state)
  }

  const filters = useCollectionTableFilters()
  const columns = useCollectionColumns()

  const { table } = useDataTable({
    data: collections || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    pageSize: PAGE_SIZE,
    prefix: PREFIX_PRODUCT_COLLECTION,
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
      isLoading={isLoading}
      filters={filters}
      orderBy={["title", "created_at", "updated_at"]}
      layout="fill"
      pagination
      search
      prefix={PREFIX_PRODUCT_COLLECTION}
      queryObject={raw}
    />
  )
}

const pcColumnHelper = createColumnHelper<HttpTypes.AdminCollection>()

const useCollectionColumns = () => {
  const base = useCollectionTableColumns()

  return useMemo(
    () => [
      pcColumnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
    ],
    [base]
  )
}

const PREFIX_PRODUCT_TYPE = "pt"

const ProductTypeTable = ({
  initialRowState,
  intermediate,
  setIntermediate,
}: TableImplementationProps) => {
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialRowState)

  useCleanupSearchParams()

  const { searchParams, raw } = useProductTypeTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX_PRODUCT_TYPE,
  })

  const { product_types, count, isLoading, isError, error } = useProductTypes(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const updater: OnChangeFn<RowSelectionState> = (value) => {
    const state = typeof value === "function" ? value(rowSelection) : value
    const currentIds = Object.keys(rowSelection)

    const ids = Object.keys(state)

    const newIds = ids.filter((id) => !currentIds.includes(id))
    const removedIds = currentIds.filter((id) => !ids.includes(id))

    const newTypes =
      product_types
        ?.filter((p) => newIds.includes(p.id))
        .map((p) => ({
          value: p.id,
          label: p.value,
        })) || []

    const filteredIntermediate = intermediate.filter(
      (p) => !removedIds.includes(p.value)
    )

    setIntermediate([...filteredIntermediate, ...newTypes])
    setRowSelection(state)
  }

  const filters = useProductTypeTableFilters()
  const columns = useProductTypeColumns()

  const { table } = useDataTable({
    data: product_types || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    pageSize: PAGE_SIZE,
    prefix: PREFIX_PRODUCT_TYPE,
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
      isLoading={isLoading}
      filters={filters}
      orderBy={["value", "created_at", "updated_at"]}
      layout="fill"
      pagination
      search
      prefix={PREFIX_PRODUCT_TYPE}
      queryObject={raw}
    />
  )
}

const ptColumnHelper = createColumnHelper<HttpTypes.AdminProductType>()

const useProductTypeColumns = () => {
  const base = useProductTypeTableColumns()

  return useMemo(
    () => [
      ptColumnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
    ],
    [base]
  )
}

const PREFIX_PRODUCT_TAG = "ptag"

const ProductTagTable = ({
  initialRowState,
  intermediate,
  setIntermediate,
}: TableImplementationProps) => {
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialRowState)

  useCleanupSearchParams()

  const { searchParams, raw } = useProductTagTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX_PRODUCT_TAG,
  })

  const { product_tags, count, isLoading, isError, error } = useTags(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const updater: OnChangeFn<RowSelectionState> = (value) => {
    const state = typeof value === "function" ? value(rowSelection) : value
    const currentIds = Object.keys(rowSelection)

    const ids = Object.keys(state)

    const newIds = ids.filter((id) => !currentIds.includes(id))
    const removedIds = currentIds.filter((id) => !ids.includes(id))

    const newTags =
      product_tags
        ?.filter((p) => newIds.includes(p.id))
        .map((p) => ({
          value: p.id,
          label: p.value,
        })) || []

    const filteredIntermediate = intermediate.filter(
      (p) => !removedIds.includes(p.value)
    )

    setIntermediate([...filteredIntermediate, ...newTags])
    setRowSelection(state)
  }

  const filters = useProductTagTableFilters()
  const columns = useProductTagColumns()

  const { table } = useDataTable({
    data: product_tags || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    pageSize: PAGE_SIZE,
    prefix: PREFIX_PRODUCT_TAG,
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
      isLoading={isLoading}
      filters={filters}
      orderBy={["value", "created_at", "updated_at"]}
      layout="fill"
      pagination
      search
      prefix={PREFIX_PRODUCT_TAG}
      queryObject={raw}
    />
  )
}

const ptagColumnHelper = createColumnHelper<HttpTypes.AdminProductTag>()

const useProductTagColumns = () => {
  const base = useProductTagTableColumns()

  return useMemo(
    () => [
      ptagColumnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
    ],
    [base]
  )
}

const useCleanupSearchParams = () => {
  const [_, setSearchParams] = useSearchParams()

  useEffect(() => {
    return () => {
      setSearchParams({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
