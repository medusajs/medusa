import { OnChangeFn, RowSelectionState } from "@tanstack/react-table"
import { useMemo, useState } from "react"

import {
  DateComparisonOperator,
  NumericalComparisonOperator,
} from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { AdminOrderLineItem } from "@medusajs/types"

import { useReturnItemTableColumns } from "./use-return-item-table-columns"
import { useReturnItemTableFilters } from "./use-return-item-table-filters"
import { useReturnItemTableQuery } from "./use-return-item-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { DataTable } from "../../../../../components/table/data-table"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"

const PAGE_SIZE = 50
const PREFIX = "rit"

type AddReturnItemsTableProps = {
  onSelectionChange: (ids: string[]) => void
  selectedItems: string[]
  items: AdminOrderLineItem[]
  currencyCode: string
}

export const AddReturnItemsTable = ({
  onSelectionChange,
  selectedItems,
  items,
  currencyCode,
}: AddReturnItemsTableProps) => {
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

  const { searchParams, raw } = useReturnItemTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const queriedItems = useMemo(() => {
    const {
      order,
      offset,
      limit,
      q,
      created_at,
      updated_at,
      refundable_amount,
      returnable_quantity,
    } = searchParams

    let results: AdminOrderLineItem[] = items

    if (q) {
      results = results.filter((i) => {
        return (
          i.variant.product.title.toLowerCase().includes(q.toLowerCase()) ||
          i.variant.title.toLowerCase().includes(q.toLowerCase()) ||
          i.variant.sku?.toLowerCase().includes(q.toLowerCase())
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

    if (returnable_quantity) {
      results = filterByNumber(
        results,
        returnable_quantity,
        "returnable_quantity",
        currencyCode
      )
    }

    if (refundable_amount) {
      results = filterByNumber(
        results,
        refundable_amount,
        "refundable_amount",
        currencyCode
      )
    }

    return results.slice(offset, offset + limit)
  }, [items, currencyCode, searchParams])

  const columns = useReturnItemTableColumns(currencyCode)
  const filters = useReturnItemTableFilters()

  const { table } = useDataTable({
    data: queriedItems as AdminOrderLineItem[],
    columns: columns,
    count: items.length,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: (row) => {
      return row.original.quantity - (row.original.returned_quantity || 0) > 0
    },
    rowSelection: {
      state: rowSelection,
      updater,
    },
  })

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={queriedItems.length}
        filters={filters}
        pagination
        layout="fill"
        search
        orderBy={[
          "product_title",
          "variant_title",
          "sku",
          "returnable_quantity",
          "refundable_amount",
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
      aValue = a.variant.product.title
      bValue = b.variant.product.title
    } else if (field === "variant_title") {
      aValue = a.variant.title
      bValue = b.variant.title
    } else if (field === "sku") {
      aValue = a.variant.sku
      bValue = b.variant.sku
    } else if (field === "returnable_quantity") {
      aValue = a.quantity - (a.returned_quantity || 0)
      bValue = b.quantity - (b.returned_quantity || 0)
    } else if (field === "refundable_amount") {
      aValue = a.refundable || 0
      bValue = b.refundable || 0
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

const defaultOperators = {
  eq: undefined,
  gt: undefined,
  gte: undefined,
  lt: undefined,
  lte: undefined,
}

const filterByNumber = (
  items: AdminOrderLineItem[],
  value: NumericalComparisonOperator | number,
  field: "returnable_quantity" | "refundable_amount",
  currency_code: string
) => {
  const { eq, gt, lt, gte, lte } =
    typeof value === "object"
      ? { ...defaultOperators, ...value }
      : { ...defaultOperators, eq: value }

  return items.filter((i) => {
    const returnableQuantity = i.quantity - (i.returned_quantity || 0)
    const refundableAmount = getStylizedAmount(i.refundable || 0, currency_code)

    const itemValue =
      field === "returnable_quantity" ? returnableQuantity : refundableAmount

    if (eq) {
      return itemValue === eq
    }

    let isValid = true

    if (gt) {
      isValid = isValid && itemValue > gt
    }

    if (gte) {
      isValid = isValid && itemValue >= gte
    }

    if (lt) {
      isValid = isValid && itemValue < lt
    }

    if (lte) {
      isValid = isValid && itemValue <= lte
    }

    return isValid
  })
}
