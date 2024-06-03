import { HttpTypes } from "@medusajs/types"
import { Button, Checkbox } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { DataTable } from "../../../../../components/table/data-table"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"
import { useUpdateStockLocationSalesChannels } from "../../../../../hooks/api/stock-locations"
import { useSalesChannelTableColumns } from "../../../../../hooks/table/columns/use-sales-channel-table-columns"
import { useSalesChannelTableFilters } from "../../../../../hooks/table/filters/use-sales-channel-table-filters"
import { useSalesChannelTableQuery } from "../../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type EditSalesChannelsFormProps = {
  location: HttpTypes.AdminStockLocation
}

const EditSalesChannelsSchema = zod.object({
  sales_channels: zod.array(zod.string()).optional(),
})

const PAGE_SIZE = 50

export const LocationEditSalesChannelsForm = ({
  location,
}: EditSalesChannelsFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditSalesChannelsSchema>>({
    defaultValues: {
      sales_channels: location.sales_channels?.map((sc) => sc.id) ?? [],
    },
    resolver: zodResolver(EditSalesChannelsSchema),
  })

  const { setValue } = form

  const initialState =
    location.sales_channels?.reduce((acc, curr) => {
      acc[curr.id] = true
      return acc
    }, {} as RowSelectionState) ?? {}

  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialState)

  useEffect(() => {
    const ids = Object.keys(rowSelection)
    setValue("sales_channels", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [rowSelection, setValue])

  const { searchParams, raw } = useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { sales_channels, count, isLoading, isError, error } = useSalesChannels(
    {
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useSalesChannelTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: sales_channels ?? [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  const { mutateAsync, isPending: isMutating } =
    useUpdateStockLocationSalesChannels(location.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    const originalIds = location.sales_channels?.map((sc) => sc.id)

    const arr = data.sales_channels ?? []

    await mutateAsync(
      {
        add: arr.filter((i) => !originalIds?.includes(i)),
        remove: originalIds?.filter((i) => !arr.includes(i)),
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <div className="flex h-full flex-col overflow-hidden">
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" isLoading={isMutating} onClick={handleSubmit}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body>
          <DataTable
            table={table}
            columns={columns}
            pageSize={PAGE_SIZE}
            isLoading={isLoading}
            count={count}
            filters={filters}
            search
            pagination
            orderBy={["name", "created_at", "updated_at"]}
            queryObject={raw}
            layout="fill"
          />
        </RouteFocusModal.Body>
      </div>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminSalesChannel>()

const useColumns = () => {
  const columns = useSalesChannelTableColumns()

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
      ...columns,
    ],
    [columns]
  )
}
