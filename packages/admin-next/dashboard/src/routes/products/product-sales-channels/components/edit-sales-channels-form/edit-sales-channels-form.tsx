import { Product, SalesChannel } from "@medusajs/medusa"
import { Button, Checkbox, FocusModal } from "@medusajs/ui"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useAdminSalesChannels, useAdminUpdateProduct } from "medusa-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/table/data-table"
import { useSalesChannelTableColumns } from "../../../../../hooks/table/columns/use-sales-channel-table-columns"
import { useSalesChannelTableFilters } from "../../../../../hooks/table/filters/use-sales-channel-table-filters"
import { useSalesChannelTableQuery } from "../../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type EditSalesChannelsFormProps = {
  product: Product
  subscribe: (state: boolean) => void
  onSuccessfulSubmit: () => void
}

const PAGE_SIZE = 50

export const EditSalesChannelsForm = ({
  product,
  subscribe,
  onSuccessfulSubmit,
}: EditSalesChannelsFormProps) => {
  const { t } = useTranslation()

  const initialState =
    product.sales_channels?.reduce((acc, curr) => {
      acc[curr.id] = true
      return acc
    }, {} as RowSelectionState) ?? {}

  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialState)

  const isDirty = Object.entries(initialState).some(
    ([key, value]) => value !== rowSelection[key]
  )

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty, subscribe])

  const { searchParams, raw } = useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { sales_channels, count, isLoading, isError, error } =
    useAdminSalesChannels(
      {
        ...searchParams,
      },
      {
        keepPreviousData: true,
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

  const { mutateAsync, isLoading: isMutating } = useAdminUpdateProduct(
    product.id
  )

  const handleSubmit = async () => {
    const selected = Object.keys(rowSelection).filter((key) => {
      return rowSelection[key]
    })

    const sales_channels = selected.map((id) => {
      return {
        id,
      }
    })

    await mutateAsync(
      {
        sales_channels,
      },
      {
        onSuccess: () => {
          onSuccessfulSubmit()
        },
      }
    )
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <FocusModal.Header>
        <div className="flex items-center justify-end gap-x-2">
          <FocusModal.Close asChild>
            <Button size="small" variant="secondary">
              {t("actions.cancel")}
            </Button>
          </FocusModal.Close>
          <Button size="small" isLoading={isMutating} onClick={handleSubmit}>
            {t("actions.save")}
          </Button>
        </div>
      </FocusModal.Header>
      <FocusModal.Body>
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
      </FocusModal.Body>
    </div>
  )
}

const columnHelper = createColumnHelper<SalesChannel>()

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
