import { PricedVariant } from "@medusajs/client-types"
import { useTranslation } from "react-i18next"
import { OnChangeFn, RowSelectionState } from "@tanstack/react-table"
import { useState } from "react"
import { useAdminVariants } from "medusa-react"
import { Button } from "@medusajs/ui"
import { Order } from "@medusajs/medusa"

import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table.tsx"
import { SplitView } from "../../../../../components/layout/split-view"

import { useVariantTableQuery } from "./use-variant-table-query"
import { useVariantTableColumns } from "./use-variant-table-columns"
import { useVariantTableFilters } from "./use-variant-table-filters"

const PAGE_SIZE = 50

export type Option = {
  value: string
  label: string
}

const Footer = ({
  onSave,
  isAddingItems,
}: {
  isAddingItems: boolean
  onSave: () => void
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-end gap-x-2 border-t p-4">
      <SplitView.Close type="button" asChild>
        <Button variant="secondary" size="small">
          {t("general.close")}
        </Button>
      </SplitView.Close>
      <Button
        isLoading={isAddingItems}
        size="small"
        type="button"
        onClick={onSave}
      >
        {t("general.add")}
      </Button>
    </div>
  )
}

type VariantTableProps = {
  onSave: (ids: string[]) => Promise<void>
  isAddingItems: boolean
  order: Order
}

export const VariantTable = ({
  onSave,
  order,
  isAddingItems,
}: VariantTableProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [intermediate, setIntermediate] = useState<string[]>([])

  const { searchParams, raw } = useVariantTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { variants, count, isLoading, isError, error } = useAdminVariants(
    {
      ...searchParams,
      region_id: order.region_id,
      cart_id: order.cart_id,
      customer_id: order.customer_id,
      currency_code: order.currency_code,
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
      const addedProducts = (variants?.filter((v) => added.includes(v.id!)) ??
        []) as PricedVariant[]

      if (addedProducts.length > 0) {
        const newConditions = addedProducts.map((p) => p.id!)

        setIntermediate((prev) => {
          const filteredPrev = prev.filter((p) => newState[p])
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
        return prev.filter((p) => !removed.includes(p))
      })

      setRowSelection(newState)
    }
  }

  const handleSave = () => {
    onSave(intermediate)
  }

  const columns = useVariantTableColumns(order.currency_code)
  const filters = useVariantTableFilters()

  const { table } = useDataTable({
    data: (variants ?? []) as PricedVariant[],
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
      />
      <Footer isAddingItems={isAddingItems} onSave={handleSave} />
    </div>
  )
}
