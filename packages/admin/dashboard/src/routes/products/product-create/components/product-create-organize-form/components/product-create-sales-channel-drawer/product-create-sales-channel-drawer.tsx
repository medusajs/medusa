import { AdminSalesChannelResponse } from "@medusajs/types"
import { Button, Checkbox } from "@medusajs/ui"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { SplitView } from "../../../../../../../components/layout/split-view"
import { DataTable } from "../../../../../../../components/table/data-table"
import { useSalesChannels } from "../../../../../../../hooks/api/sales-channels"
import { useSalesChannelTableColumns } from "../../../../../../../hooks/table/columns/use-sales-channel-table-columns"
import { useSalesChannelTableFilters } from "../../../../../../../hooks/table/filters/use-sales-channel-table-filters"
import { useSalesChannelTableQuery } from "../../../../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../../../../hooks/use-data-table"
import { ProductCreateSchemaType } from "../../../../types"
import { useProductCreateDetailsContext } from "../product-create-organize-context"

type ProductCreateSalesChannelDrawerProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

const PAGE_SIZE = 50
const PREFIX = "sc"

export const ProductCreateSalesChannelDrawer = ({
  form,
}: ProductCreateSalesChannelDrawerProps) => {
  const { t } = useTranslation()
  const { open, onOpenChange } = useProductCreateDetailsContext()
  const { getValues, setValue } = form

  const [selection, setSelection] = useState<RowSelectionState>({})
  const [state, setState] = useState<{ id: string; name: string }[]>([])

  const { searchParams, raw } = useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { sales_channels, count, isLoading, isError, error } = useSalesChannels(
    {
      ...searchParams,
    }
  )

  useEffect(() => {
    if (!open) {
      return
    }

    const salesChannels = getValues("sales_channels")

    if (salesChannels) {
      setState(
        salesChannels.map((channel) => ({
          id: channel.id,
          name: channel.name,
        }))
      )

      setSelection(
        salesChannels.reduce(
          (acc, channel) => ({
            ...acc,
            [channel.id]: true,
          }),
          {}
        )
      )
    }
  }, [open, getValues])

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const value = typeof fn === "function" ? fn(selection) : fn
    const ids = Object.keys(value)

    const addedIdsSet = new Set(ids.filter((id) => value[id] && !selection[id]))

    let addedSalesChannels: { id: string; name: string }[] = []

    if (addedIdsSet.size > 0) {
      addedSalesChannels =
        sales_channels?.filter((channel) => addedIdsSet.has(channel.id)) ?? []
    }

    setState((prev) => {
      const filteredPrev = prev.filter((channel) => value[channel.id])
      return Array.from(new Set([...filteredPrev, ...addedSalesChannels]))
    })
    setSelection(value)
  }

  const handleAdd = () => {
    setValue("sales_channels", state, {
      shouldDirty: true,
      shouldTouch: true,
    })
    onOpenChange(false)
  }

  const filters = useSalesChannelTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: sales_channels ?? [],
    columns,
    count: sales_channels?.length ?? 0,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: selection,
      updater,
    },
    prefix: PREFIX,
  })

  if (isError) {
    throw error
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex-1">
        <DataTable
          table={table}
          columns={columns}
          pageSize={PAGE_SIZE}
          filters={filters}
          isLoading={isLoading}
          layout="fill"
          orderBy={["name", "created_at", "updated_at"]}
          queryObject={raw}
          search
          pagination
          count={count}
          prefix={PREFIX}
        />
      </div>
      <div className="flex items-center justify-end gap-x-2 border-t px-6 py-4">
        <SplitView.Close asChild>
          <Button size="small" variant="secondary" type="button">
            {t("actions.cancel")}
          </Button>
        </SplitView.Close>
        <Button size="small" onClick={handleAdd} type="button">
          {t("actions.add")}
        </Button>
      </div>
    </div>
  )
}

const columnHelper =
  createColumnHelper<AdminSalesChannelResponse["sales_channel"]>()

const useColumns = () => {
  const base = useSalesChannelTableColumns()

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
