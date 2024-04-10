import {
  CustomerGroup,
  Product,
  ProductTag,
  ProductType,
} from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { OnChangeFn, RowSelectionState } from "@tanstack/react-table"
import { useAdminProductTags } from "medusa-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { SplitView } from "../../../../../components/layout/split-view"
import { DataTable } from "../../../../../components/table/data-table"

import { useDataTable } from "../../../../../hooks/use-data-table"

import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useProductConditionsTableColumns } from "../../hooks/columns/use-product-conditions-table-columns"

import { useCustomerGroupTableQuery } from "../../../../../hooks/table/query/use-customer-group-table-query"
import { useCustomerGroupConditionsTableColumns } from "../../hooks/columns/use-customer-group-conditions-table-columns"
import { useCustomerGroupConditionsTableFilters } from "../../hooks/filters/use-customer-group-conditions-table-filters"

import { useProductTypeConditionsTableColumns } from "../../hooks/columns/use-product-type-conditions-table-columns"
import { useProductTypeConditionsTableFilters } from "../../hooks/filters/use-product-type-conditions-table-filters"
import { useProductTypeConditionsTableQuery } from "../../hooks/query/use-product-type-conditions-table-query"

import { useProductCollectionConditionsTableColumns } from "../../hooks/columns/use-product-collection-conditions-table-columns"
import { useProductCollectionConditionsTableFilters } from "../../hooks/filters/use-product-collection-conditions-table-filters"
import { useProductCollectionConditionsTableQuery } from "../../hooks/query/use-product-collection-conditions-table-query"

import { useProductTagConditionsTableColumns } from "../../hooks/columns/use-product-tag-conditions-table-columns"
import { useProductTagConditionsTableFilters } from "../../hooks/filters/use-product-tag-conditions-table-filters"
import { useProductTagConditionsTableQuery } from "../../hooks/query/use-product-tag-conditions-table-query"

import { ProductCollectionDTO } from "@medusajs/types"
import { useCollections } from "../../../../../hooks/api/collections"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"
import { useProductTypes } from "../../../../../hooks/api/product-types"
import { useProducts } from "../../../../../hooks/api/products"
import { ConditionEntities } from "../../constants"
import { ConditionsOption } from "../../types"

const PAGE_SIZE = 50

const PRODUCT_PREFIX = "product"
const PRODUCT_TYPE_PREFIX = "product_type"
const PRODUCT_COLLECTION_PREFIX = "product_collection"
const CUSTOMER_GROUP_PREFIX = "customer_group"
const PRODUCT_TAG_PREFIX = "customer_group"

type ConditionsProps = {
  selected: ConditionsOption[]
  onSave: (options: ConditionsOption[]) => void
}

const initRowState = (selected: ConditionsOption[] = []): RowSelectionState => {
  return selected.reduce((acc, { value }) => {
    acc[value] = true
    return acc
  }, {} as RowSelectionState)
}

const ConditionsFooter = ({ onSave }: { onSave: () => void }) => {
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

const ProductConditionsTable = ({ selected = [], onSave }: ConditionsProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initRowState(selected)
  )

  const [intermediate, setIntermediate] = useState<ConditionsOption[]>(selected)

  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PRODUCT_PREFIX,
  })
  const { products, count, isLoading, isError, error } = useProducts(
    {
      ...searchParams,
    },
    {
      keepPreviousData: true,
    }
  )

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const newState: RowSelectionState =
      typeof fn === "function" ? fn(rowSelection) : fn

    const added = Object.keys(newState).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (added.length) {
      const addedProducts = (products?.filter((p) => added.includes(p.id!)) ??
        []) as Product[]

      if (addedProducts.length > 0) {
        const newConditions = addedProducts.map((p) => ({
          label: p.title,
          value: p.id!,
        }))

        setIntermediate((prev) => {
          const filteredPrev = prev.filter((p) => p.value in newState)
          return Array.from(new Set([...filteredPrev, ...newConditions]))
        })
      }

      setRowSelection(newState)
    }

    const removed = Object.keys(rowSelection).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (removed.length) {
      setIntermediate((prev) => {
        return prev.filter((p) => !removed.includes(p.value))
      })

      setRowSelection(newState)
    }
  }

  const handleSave = () => {
    onSave(intermediate)
  }

  const columns = useProductConditionsTableColumns()
  const filters = useProductTableFilters()

  const { table } = useDataTable({
    data: products ?? [],
    columns: columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater,
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
      <ConditionsFooter onSave={handleSave} />
    </div>
  )
}

const CustomerGroupConditionsTable = ({
  selected = [],
  onSave,
}: ConditionsProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initRowState(selected)
  )

  const [intermediate, setIntermediate] = useState<ConditionsOption[]>(selected)

  const { searchParams, raw } = useCustomerGroupTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PRODUCT_PREFIX,
  })
  const { customer_groups, count, isLoading, isError, error } =
    useCustomerGroups(
      {
        ...searchParams,
      },
      {
        keepPreviousData: true,
      }
    )

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const newState: RowSelectionState =
      typeof fn === "function" ? fn(rowSelection) : fn

    const added = Object.keys(newState).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (added.length) {
      const addedGroups =
        customer_groups?.filter((p) => added.includes(p.id!)) ?? []

      if (addedGroups.length > 0) {
        const newConditions = addedGroups.map((p) => ({
          label: p.name,
          value: p.id!,
        }))

        setIntermediate((prev) => {
          const filteredPrev = prev.filter((p) => p.value in newState)
          return Array.from(new Set([...filteredPrev, ...newConditions]))
        })
      }

      setRowSelection(newState)
    }

    const removed = Object.keys(rowSelection).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (removed.length) {
      setIntermediate((prev) => {
        return prev.filter((p) => !removed.includes(p.value))
      })

      setRowSelection(newState)
    }
  }

  const handleSave = () => {
    onSave(intermediate)
  }

  const columns = useCustomerGroupConditionsTableColumns()
  const filters = useCustomerGroupConditionsTableFilters()

  const { table } = useDataTable({
    data: (customer_groups ?? []) as CustomerGroup[],
    columns: columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    prefix: CUSTOMER_GROUP_PREFIX,
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
        orderBy={["name", "created_at", "updated_at"]}
        prefix={CUSTOMER_GROUP_PREFIX}
      />
      <ConditionsFooter onSave={handleSave} />
    </div>
  )
}

const ProductTypeConditionsTable = ({
  onSave,
  selected = [],
}: ConditionsProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initRowState(selected)
  )
  const [intermediate, setIntermediate] = useState<ConditionsOption[]>(selected)

  const { searchParams, raw } = useProductTypeConditionsTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PRODUCT_TYPE_PREFIX,
  })
  const { product_types, count, isLoading, isError, error } = useProductTypes(
    {
      ...searchParams,
    },
    {
      keepPreviousData: true,
    }
  )

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const newState: RowSelectionState =
      typeof fn === "function" ? fn(rowSelection) : fn

    const added = Object.keys(newState).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (added.length) {
      const addedTypes = (product_types?.filter((p) => added.includes(p.id!)) ??
        []) as ProductType[]

      if (addedTypes.length > 0) {
        const newConditions = addedTypes.map((p) => ({
          label: p.value,
          value: p.id!,
        }))

        setIntermediate((prev) => {
          const filteredPrev = prev.filter((p) => p.value in newState)
          return Array.from(new Set([...filteredPrev, ...newConditions]))
        })
      }

      setRowSelection(newState)
    }
    const removed = Object.keys(rowSelection).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (removed.length) {
      setIntermediate((prev) => {
        return prev.filter((p) => !removed.includes(p.value))
      })

      setRowSelection(newState)
    }
  }

  const handleSave = () => {
    onSave(intermediate)
  }

  const columns = useProductTypeConditionsTableColumns()
  const filters = useProductTypeConditionsTableFilters()

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
      updater,
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
        prefix={PRODUCT_TYPE_PREFIX}
      />
      <ConditionsFooter onSave={handleSave} />
    </div>
  )
}

const ProductCollectionConditionsTable = ({
  onSave,
  selected = [],
}: ConditionsProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initRowState(selected)
  )
  const [intermediate, setIntermediate] = useState<ConditionsOption[]>(selected)

  const { searchParams, raw } = useProductCollectionConditionsTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PRODUCT_COLLECTION_PREFIX,
  })
  const { collections, count, isPending, isError, error } = useCollections(
    {
      ...searchParams,
    },
    {
      keepPreviousData: true,
    }
  )

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const newState: RowSelectionState =
      typeof fn === "function" ? fn(rowSelection) : fn

    const added = Object.keys(newState).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (added.length) {
      const addedCollections = (collections?.filter((p) =>
        added.includes(p.id!)
      ) ?? []) as ProductCollectionDTO[]

      if (addedCollections.length > 0) {
        const newConditions = addedCollections.map((p) => ({
          label: p.title,
          value: p.id!,
        }))

        setIntermediate((prev) => {
          const filteredPrev = prev.filter((p) => p.value in newState)
          return Array.from(new Set([...filteredPrev, ...newConditions]))
        })
      }

      setRowSelection(newState)
    }

    const removed = Object.keys(rowSelection).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (removed.length) {
      setIntermediate((prev) => {
        return prev.filter((p) => !removed.includes(p.value))
      })

      setRowSelection(newState)
    }
  }

  const handleSave = () => {
    onSave(intermediate)
  }

  const columns = useProductCollectionConditionsTableColumns()
  const filters = useProductCollectionConditionsTableFilters()

  const { table } = useDataTable({
    data: collections ?? [],
    columns: columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    prefix: PRODUCT_COLLECTION_PREFIX,
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
        isLoading={isPending}
        layout="fill"
        orderBy={["title", "handle", "created_at", "updated_at"]}
        prefix={PRODUCT_COLLECTION_PREFIX}
      />
      <ConditionsFooter onSave={handleSave} />
    </div>
  )
}

const ProductTagConditionsTable = ({
  onSave,
  selected = [],
}: ConditionsProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initRowState(selected)
  )
  const [intermediate, setIntermediate] = useState<ConditionsOption[]>(selected)

  const { searchParams, raw } = useProductTagConditionsTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PRODUCT_TAG_PREFIX,
  })

  // TODO: replace this with useProductTags when its available
  const { product_tags, count, isLoading, isError, error } =
    useAdminProductTags(
      {
        ...searchParams,
      },
      {
        keepPreviousData: true,
      }
    )

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const newState: RowSelectionState =
      typeof fn === "function" ? fn(rowSelection) : fn

    const added = Object.keys(newState).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (added.length) {
      const addedTags = (product_tags?.filter((p) => added.includes(p.id!)) ??
        []) as ProductTag[]

      if (addedTags.length > 0) {
        const newConditions = addedTags.map((p) => ({
          label: p.value,
          value: p.id!,
        }))

        setIntermediate((prev) => {
          const filteredPrev = prev.filter((p) => p.value in newState)
          return Array.from(new Set([...filteredPrev, ...newConditions]))
        })
      }

      setRowSelection(newState)
    }

    const removed = Object.keys(rowSelection).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    if (removed.length) {
      setIntermediate((prev) => {
        return prev.filter((p) => !removed.includes(p.value))
      })

      setRowSelection(newState)
    }
  }

  const handleSave = () => {
    onSave(intermediate)
  }

  const columns = useProductTagConditionsTableColumns()
  const filters = useProductTagConditionsTableFilters()

  const { table } = useDataTable({
    data: product_tags ?? [],
    columns: columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    prefix: PRODUCT_TAG_PREFIX,
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
        orderBy={["title", "handle", "created_at", "updated_at"]}
        prefix={PRODUCT_TAG_PREFIX}
      />
      <ConditionsFooter onSave={handleSave} />
    </div>
  )
}

type ConditionsTableProps = {
  product: ConditionsProps
  productType: ConditionsProps
  productTag: ConditionsProps
  productCollection: ConditionsProps
  customerGroup: ConditionsProps
  selected: ConditionEntities | null
}

export const ConditionsDrawer = ({
  product,
  productType,
  customerGroup,
  productCollection,
  productTag,
  selected,
}: ConditionsTableProps) => {
  switch (selected) {
    case ConditionEntities.PRODUCT:
      return <ProductConditionsTable {...product} />
    case ConditionEntities.PRODUCT_TYPE:
      return <ProductTypeConditionsTable {...productType} />
    case ConditionEntities.PRODUCT_COLLECTION:
      return <ProductCollectionConditionsTable {...productCollection} />
    case ConditionEntities.PRODUCT_TAG:
      return <ProductTagConditionsTable {...productTag} />
    case ConditionEntities.CUSTOMER_GROUP:
      return <CustomerGroupConditionsTable {...customerGroup} />
    default:
      return null
  }
}
