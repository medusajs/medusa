import { zodResolver } from "@hookform/resolvers/zod"
import { AdminSalesChannelResponse } from "@medusajs/types"
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
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { DataTable } from "../../../../../components/table/data-table"
import { useBatchAddSalesChannelsToApiKey } from "../../../../../hooks/api/api-keys"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"
import { useSalesChannelTableColumns } from "../../../../../hooks/table/columns/use-sales-channel-table-columns"
import { useSalesChannelTableQuery } from "../../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type ApiKeySalesChannelFormProps = {
  apiKey: string
  preSelected?: string[]
}

const AddSalesChannelsToApiKeySchema = zod.object({
  sales_channel_ids: zod.array(zod.string()),
})

const PAGE_SIZE = 50

export const ApiKeySalesChannelsForm = ({
  apiKey,
  preSelected = [],
}: ApiKeySalesChannelFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddSalesChannelsToApiKeySchema>>({
    defaultValues: {
      sales_channel_ids: [],
    },
    resolver: zodResolver(AddSalesChannelsToApiKeySchema),
  })

  const { setValue } = form

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { mutateAsync, isPending } = useBatchAddSalesChannelsToApiKey(apiKey)

  const { raw, searchParams } = useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
  })

  const columns = useColumns()

  const { sales_channels, count, isLoading } = useSalesChannels(
    { ...searchParams },
    {
      placeholderData: keepPreviousData,
    }
  )

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const state = typeof fn === "function" ? fn(rowSelection) : fn

    const ids = Object.keys(state)

    setValue("sales_channel_ids", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setRowSelection(state)
  }

  const { table } = useDataTable({
    data: sales_channels ?? [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: (row) => {
      return !preSelected.includes(row.original.id!)
    },
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: rowSelection,
      updater,
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        sales_channel_ids: values.sales_channel_ids,
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t("apiKeyManagement.salesChannels.successToast", {
              count: values.sales_channel_ids.length,
            }),
            dismissLabel: t("general.close"),
          })

          handleSuccess()
        },
        onError: (err) => {
          toast.error(t("general.error"), {
            description: err.message,
            dismissLabel: t("general.close"),
          })
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            {form.formState.errors.sales_channel_ids && (
              <Hint variant="error">
                {form.formState.errors.sales_channel_ids.message}
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
        <RouteFocusModal.Body>
          <DataTable
            table={table}
            columns={columns}
            count={count}
            pageSize={PAGE_SIZE}
            pagination
            search
            isLoading={isLoading}
            queryObject={raw}
            orderBy={["name", "created_at", "updated_at"]}
            layout="fill"
          />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const columnHelper =
  createColumnHelper<AdminSalesChannelResponse["sales_channel"]>()

const useColumns = () => {
  const { t } = useTranslation()
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
          const isPreSelected = !row.getCanSelect()
          const isSelected = row.getIsSelected() || isPreSelected

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isPreSelected}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isPreSelected) {
            return (
              <Tooltip
                content={t(
                  "apiKeyManagement.salesChannels.alreadyAddedTooltip"
                )}
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
