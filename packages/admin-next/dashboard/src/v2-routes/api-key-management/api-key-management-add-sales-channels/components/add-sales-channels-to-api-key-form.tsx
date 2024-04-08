import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, Hint, StatusBadge, Tooltip } from "@medusajs/ui"
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
} from "../../../../components/route-modal"
import { useBatchAddSalesChannelsToApiKey } from "../../../../hooks/api/api-keys"
import { useSalesChannelTableQuery } from "../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../hooks/use-data-table"
import { useSalesChannels } from "../../../../hooks/api/sales-channels"
import { keepPreviousData } from "@tanstack/react-query"
import { DataTable } from "../../../../components/table/data-table"
import { AdminSalesChannelResponse } from "@medusajs/types"

type AddSalesChannelsToApiKeyFormProps = {
  apiKey: string
  preSelected: string[]
}

const AddSalesChannelsToApiKeySchema = zod.object({
  sales_channel_ids: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 50

export const AddSalesChannelsToApiKeyForm = ({
  apiKey,
  preSelected,
}: AddSalesChannelsToApiKeyFormProps) => {
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

  // @ts-ignore
  const { mutateAsync, isLoading: isMutating } =
    useBatchAddSalesChannelsToApiKey(apiKey)

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
          handleSuccess()
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
            <Button size="small" type="submit" isLoading={isMutating}>
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
              <Tooltip content={t("store.currencyAlreadyAdded")} side="right">
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ getValue }) => (
          <div className="w-[200px] truncate">
            <span>{getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("is_disabled", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <div>
              <StatusBadge color={value ? "grey" : "green"}>
                {value ? t("general.disabled") : t("general.enabled")}
              </StatusBadge>
            </div>
          )
        },
      }),
    ],
    [t]
  )
}
