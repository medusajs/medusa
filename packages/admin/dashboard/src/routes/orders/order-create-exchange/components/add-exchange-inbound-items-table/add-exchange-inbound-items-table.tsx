import { AdminOrderLineItem, DateComparisonOperator } from "@medusajs/types"
import { OnChangeFn, RowSelectionState } from "@tanstack/react-table"
import { useMemo, useState } from "react"

import { useTranslation } from "react-i18next"
import { _DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { getReturnableQuantity } from "../../../../../lib/rma"
import { useExchangeItemTableColumns } from "./use-exchange-item-table-columns"
import { useExchangeItemTableFilters } from "./use-exchange-item-table-filters"
import { useExchangeItemTableQuery } from "./use-exchange-item-table-query"

const PAGE_SIZE = 50
const PREFIX = "rit"

type AddExchangeInboundItemsTableProps = {
  onSelectionChange: (ids: string[]) => void
  selectedItems: string[]
  items: AdminOrderLineItem[]
  currencyCode: string
}

export const AddExchangeInboundItemsTable = ({
  onSelectionChange,
  selectedItems,
  items,
  currencyCode,
}: AddExchangeInboundItemsTableProps) => {
  const { t } = useTranslation()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    selectedItems.reduce((acc, id) => {
      acc[id] = true
      return acc
    }, {} as RowSelectionState)
  )

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const newState: RowSelectionState =
      typeof fn === "function" ? fn(rowSelection) : fn

    setRowSelection(newState)
    onSelectionChange(Object.keys(newState))
  }

  const { searchParams, raw } = useExchangeItemTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const queriedItems = useMemo(() => {
    const { order, offset, limit, q, created_at, updated_at } = searchParams

    let results: AdminOrderLineItem[] = items

    if (q) {
      results = results.filter((i) => {
        return (
          i.product_title?.toLowerCase().includes(q.toLowerCase()) ||
          i.variant_title?.toLowerCase().includes(q.toLowerCase()) ||
          i.variant_sku?.toLowerCase().includes(q.toLowerCase())
        )
      })
    }

    if (order) {
      const direction = order[0] === "-" ? "desc" : "asc"
      const field = order.replace("-", "")

      results = sortItems(results, field, direction)
    }

    if (created_at) {
      results = filterByDate(results, created_at, "created_at")
    }

    if (updated_at) {
      results = filterByDate(results, updated_at, "updated_at")
    }

    return results.slice(offset, offset + limit)
  }, [items, currencyCode, searchParams])

  const columns = useExchangeItemTableColumns(currencyCode)
  const filters = useExchangeItemTableFilters()

  const { table } = useDataTable({
    data: queriedItems as AdminOrderLineItem[],
    columns: columns,
    count: queriedItems.length,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: (row) => {
      return getReturnableQuantity(row.original) > 0
    },
    rowSelection: {
      state: rowSelection,
      updater,
    },
  })

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <_DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={queriedItems.length}
        filters={filters}
        pagination
        layout="fill"
        search
        orderBy={[
          { key: "product_title", label: t("fields.product") },
          { key: "variant_title", label: t("fields.variant") },
          { key: "sku", label: t("fields.sku") },
        ]}
        prefix={PREFIX}
        queryObject={raw}
      />
    </div>
  )
}

const sortItems = (
  items: AdminOrderLineItem[],
  field: string,
  direction: "asc" | "desc"
) => {
  return items.sort((a, b) => {
    let aValue: any
    let bValue: any

    if (field === "product_title") {
      aValue = a.product_title
      bValue = b.product_title
    } else if (field === "variant_title") {
      aValue = a.variant_title
      bValue = b.variant_title
    } else if (field === "sku") {
      aValue = a.variant_sku
      bValue = b.variant_sku
    }

    if (aValue < bValue) {
      return direction === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return direction === "asc" ? 1 : -1
    }
    return 0
  })
}

const filterByDate = (
  items: AdminOrderLineItem[],
  date: DateComparisonOperator,
  field: "created_at" | "updated_at"
) => {
  const { gt, gte, lt, lte } = date

  return items.filter((i) => {
    const itemDate = new Date(i[field])
    let isValid = true

    if (gt) {
      isValid = isValid && itemDate > new Date(gt)
    }

    if (gte) {
      isValid = isValid && itemDate >= new Date(gte)
    }

    if (lt) {
      isValid = isValid && itemDate < new Date(lt)
    }

    if (lte) {
      isValid = isValid && itemDate <= new Date(lte)
    }

    return isValid
  })
}
