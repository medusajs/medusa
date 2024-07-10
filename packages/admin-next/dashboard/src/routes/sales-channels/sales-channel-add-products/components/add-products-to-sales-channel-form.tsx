import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes, SalesChannelDTO } from "@medusajs/types"
import { Button, Checkbox, Hint, Tooltip, toast } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { RouteFocusModal, useRouteModal } from "../../../../components/modals"
import { DataTable } from "../../../../components/table/data-table"
import { useProducts } from "../../../../hooks/api/products"
import { useSalesChannelAddProducts } from "../../../../hooks/api/sales-channels"
import { useProductTableColumns } from "../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../hooks/use-data-table"

type AddProductsToSalesChannelFormProps = {
  salesChannel: SalesChannelDTO
}

const AddProductsToSalesChannelSchema = zod.object({
  product_ids: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 50

export const AddProductsToSalesChannelForm = ({
  salesChannel,
}: AddProductsToSalesChannelFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddProductsToSalesChannelSchema>>({
    defaultValues: {
      product_ids: [],
    },
    resolver: zodResolver(AddProductsToSalesChannelSchema),
  })

  const { setValue } = form

  const { mutateAsync, isPending } = useSalesChannelAddProducts(salesChannel.id)

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const state = typeof fn === "function" ? fn(rowSelection) : fn

    const ids = Object.keys(state)

    setValue("product_ids", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setRowSelection(state)
  }

  const { searchParams, raw } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const {
    products,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useProducts(
    {
      fields: "*variants,*sales_channels",
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
  const filters = useProductTableFilters(["sales_channel_id"])

  const { table } = useDataTable({
    data: products ?? [],
    columns,
    enableRowSelection: (row) => {
      return !row.original.sales_channels
        ?.map((sc) => sc.id)
        .includes(salesChannel.id)
    },
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    count,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    meta: {
      salesChannelId: salesChannel.id,
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        product_ids: values.product_ids,
      },
      {
        onSuccess: () => {
          toast.success(t("salesChannels.toast.update"))
          handleSuccess()
        },
        onError: (error) => toast.error(error.message),
      }
    )
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            {form.formState.errors.product_ids && (
              <Hint variant="error">
                {form.formState.errors.product_ids.message}
              </Hint>
            )}
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex size-full flex-col overflow-y-auto">
          <DataTable
            table={table}
            count={count}
            columns={columns}
            pageSize={PAGE_SIZE}
            isLoading={isLoading}
            filters={filters}
            orderBy={["title", "status", "created_at", "updated_at"]}
            queryObject={raw}
            layout="fill"
            pagination
            search
            noRecords={{
              message: t("salesChannels.products.add.list.noRecordsMessage"),
            }}
          />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>()

const useColumns = () => {
  const base = useProductTableColumns()
  const { t } = useTranslation()

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
        cell: ({ row, table }) => {
          const { salesChannelId } = table.options.meta as {
            salesChannelId: string
          }

          const isAdded = row.original.sales_channels
            ?.map((sc) => sc.id)
            .includes(salesChannelId)

          const isSelected = row.getIsSelected() || isAdded

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isAdded}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isAdded) {
            return (
              <Tooltip
                content={t("salesChannels.productAlreadyAdded")}
                side="right"
              >
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      ...base,
    ],
    [t, base]
  )
}
