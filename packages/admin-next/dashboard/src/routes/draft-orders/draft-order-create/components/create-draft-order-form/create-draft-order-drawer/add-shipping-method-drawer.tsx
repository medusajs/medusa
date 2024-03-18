import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"
import { Button, Checkbox } from "@medusajs/ui"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useAdminShippingOptions } from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { SplitView } from "../../../../../../components/layout/split-view"
import { DataTable } from "../../../../../../components/table/data-table"
import { useShippingOptionTableColumns } from "../../../../../../hooks/table/columns/use-shipping-option-table-columns"
import { useShippingOptionTableFilters } from "../../../../../../hooks/table/filters/use-shipping-option-table-filters"
import { useShippingOptionTableQuery } from "../../../../../../hooks/table/query/use-shipping-option-table-query"
import { useDataTable } from "../../../../../../hooks/use-data-table"
import { ShippingMethod } from "../types"

type AddShippingMethodDrawerProps = {
  onSave: (items: ShippingMethod[]) => void
  items?: ShippingMethod[]
  regionId?: string
}

const PAGE_SIZE = 50
const PREFIX = "sh"

const initRowState = (items: ShippingMethod[]): RowSelectionState => {
  return items.reduce((acc, curr) => {
    acc[curr.option_id] = true
    return acc
  }, {} as RowSelectionState)
}

export const AddShippingMethodDrawer = ({
  onSave,
  items = [],
  regionId,
}: AddShippingMethodDrawerProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initRowState(items)
  )
  const [intermediate, setIntermediate] = useState<ShippingMethod[]>(items)

  const { t } = useTranslation()

  const { searchParams, raw } = useShippingOptionTableQuery({
    regionId: regionId!,
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { shipping_options, count, isLoading, isError, error } =
    useAdminShippingOptions(
      {
        ...searchParams,
        is_return: false,
      },
      {
        enabled: !!regionId,
        keepPreviousData: true,
      }
    )

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const newState: RowSelectionState =
      typeof fn === "function" ? fn(rowSelection) : fn

    const diff = Object.keys(newState).filter(
      (k) => newState[k] !== rowSelection[k]
    )

    const addedMethods =
      shipping_options?.filter((p) => diff.includes(p.id)) ?? []

    const newMethods: ShippingMethod[] = addedMethods.map((v) => ({
      option_id: v.id,
      option_title: v.name,
      price: v.amount || 0,
      region_id: v.region_id,
    }))

    setIntermediate((prev) => {
      const filteredPrev = prev.filter((p) =>
        Object.keys(newState).includes(p.option_id)
      )

      const update = Array.from(new Set([...filteredPrev, ...newMethods]))
      return update
    })

    setRowSelection(newState)
  }

  const handleSave = () => {
    onSave(intermediate)
  }

  const columns = useOptionColumns()
  const filters = useShippingOptionTableFilters()

  const { table } = useDataTable({
    data: (shipping_options || []) as unknown as PricedShippingOption[],
    columns,
    count,
    pageSize: PAGE_SIZE,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id!,
    prefix: PREFIX,
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
        count={count}
        isLoading={isLoading}
        queryObject={raw}
        pageSize={PAGE_SIZE}
        pagination
        search
        filters={filters}
        prefix={PREFIX}
        layout="fill"
      />
      <div className="flex items-center justify-end gap-x-2 border-t p-4">
        <SplitView.Close type="button" asChild>
          <Button variant="secondary" size="small">
            {t("actions.cancel")}
          </Button>
        </SplitView.Close>
        <Button size="small" type="button" onClick={handleSave}>
          {t("actions.save")}
        </Button>
      </div>
    </div>
  )
}

const columnHelper = createColumnHelper<PricedShippingOption>()

const useOptionColumns = () => {
  const base = useShippingOptionTableColumns()

  return useMemo(
    () => [
      columnHelper.display({
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
