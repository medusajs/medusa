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

import {
  StackedFocusModal,
  useStackedModal,
} from "../../../../../../../components/modals"
import { DataTable } from "../../../../../../../components/table/data-table"
import { useSalesChannels } from "../../../../../../../hooks/api/sales-channels"
import { useSalesChannelTableColumns } from "../../../../../../../hooks/table/columns/use-sales-channel-table-columns"
import { useSalesChannelTableFilters } from "../../../../../../../hooks/table/filters/use-sales-channel-table-filters"
import { useSalesChannelTableQuery } from "../../../../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../../../../hooks/use-data-table"
import { ProductCreateSchemaType } from "../../../../types"
import { SC_STACKED_MODAL_ID } from "../../constants"

type ProductCreateSalesChannelStackedModalProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

const PAGE_SIZE = 50

export const ProductCreateSalesChannelStackedModal = ({
  form,
}: ProductCreateSalesChannelStackedModalProps) => {
  const { t } = useTranslation()
  const { getValues, setValue } = form
  const { setIsOpen, getIsOpen } = useStackedModal()

  const [selection, setSelection] = useState<RowSelectionState>({})
  const [state, setState] = useState<{ id: string; name: string }[]>([])

  const { searchParams, raw } = useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
    prefix: SC_STACKED_MODAL_ID,
  })
  const { sales_channels, count, isLoading, isError, error } = useSalesChannels(
    {
      ...searchParams,
    }
  )

  const open = getIsOpen(SC_STACKED_MODAL_ID)

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
    setIsOpen(SC_STACKED_MODAL_ID, false)
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
    prefix: SC_STACKED_MODAL_ID,
  })

  if (isError) {
    throw error
  }

  return (
    <StackedFocusModal.Content className="flex flex-col overflow-hidden">
      <StackedFocusModal.Header />
      <StackedFocusModal.Body className="flex-1 overflow-hidden">
        <DataTable
          table={table}
          columns={columns}
          pageSize={PAGE_SIZE}
          filters={filters}
          isLoading={isLoading}
          layout="fill"
          orderBy={[
            { key: "name", label: t("fields.name") },
            { key: "created_at", label: t("fields.createdAt") },
            { key: "updated_at", label: t("fields.updatedAt") },
          ]}
          queryObject={raw}
          search
          pagination
          count={count}
          prefix={SC_STACKED_MODAL_ID}
        />
      </StackedFocusModal.Body>
      <StackedFocusModal.Footer>
        <div className="flex items-center justify-end gap-x-2">
          <StackedFocusModal.Close asChild>
            <Button size="small" variant="secondary" type="button">
              {t("actions.cancel")}
            </Button>
          </StackedFocusModal.Close>
          <Button size="small" onClick={handleAdd} type="button">
            {t("actions.save")}
          </Button>
        </div>
      </StackedFocusModal.Footer>
    </StackedFocusModal.Content>
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
