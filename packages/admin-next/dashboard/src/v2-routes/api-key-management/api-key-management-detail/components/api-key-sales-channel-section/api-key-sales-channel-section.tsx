import { PencilSquare, Plus, Trash } from "@medusajs/icons"
import { AdminApiKeyResponse, AdminSalesChannelResponse } from "@medusajs/types"
import { Checkbox, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useBatchRemoveSalesChannelsFromApiKey } from "../../../../../hooks/api/api-keys"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"
import { useSalesChannelTableColumns } from "../../../../../hooks/table/columns/use-sales-channel-table-columns"
import { useSalesChannelTableFilters } from "../../../../../hooks/table/filters/use-sales-channel-table-filters"
import { useSalesChannelTableQuery } from "../../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type ApiKeySalesChannelSectionProps = {
  apiKey: AdminApiKeyResponse["api_key"]
}

const PAGE_SIZE = 10

export const ApiKeySalesChannelSection = ({
  apiKey,
}: ApiKeySalesChannelSectionProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { raw, searchParams } = useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { sales_channels, count, isLoading } = useSalesChannels(
    { ...searchParams, publishable_key_id: apiKey.id },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
  const filters = useSalesChannelTableFilters()

  const { table } = useDataTable({
    data: sales_channels ?? [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    meta: {
      apiKey: apiKey.id,
    },
  })

  const { mutateAsync } = useBatchRemoveSalesChannelsFromApiKey(apiKey.id)

  const handleRemove = async () => {
    const keys = Object.keys(rowSelection)

    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.removeSalesChannel.warningBatch", {
        count: keys.length,
      }),
      confirmText: t("actions.continue"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      {
        sales_channel_ids: keys,
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t(
              "apiKeyManagement.removeSalesChannel.successToastBatch",
              {
                count: keys.length,
              }
            ),
            dismissLabel: t("general.close"),
          })
          setRowSelection({})
        },
        onError: (err) => {
          toast.error(t("general.error"), {
            description: err.message,
            dismissLabel: t("general.close"),
          })
        },
      }
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("salesChannels.domain")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <Plus />,
                  label: t("actions.add"),
                  to: "sales-channels",
                },
              ],
            },
          ]}
        />
      </div>
      <DataTable
        table={table}
        columns={columns}
        filters={filters}
        count={count}
        isLoading={isLoading}
        queryObject={raw}
        navigateTo={(row) => `/settings/sales-channels/${row.id}`}
        orderBy={["name", "created_at", "updated_at"]}
        commands={[
          {
            action: handleRemove,
            label: t("actions.remove"),
            shortcut: "r",
          },
        ]}
        pageSize={PAGE_SIZE}
        pagination
        search
      />
    </Container>
  )
}

const SalesChannelActions = ({
  salesChannel,
  apiKey,
}: {
  salesChannel: AdminSalesChannelResponse["sales_channel"]
  apiKey: string
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useBatchRemoveSalesChannelsFromApiKey(apiKey)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.removeSalesChannel.warning", {
        name: salesChannel.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      {
        sales_channel_ids: [salesChannel.id],
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t("apiKeyManagement.removeSalesChannel.successToast", {
              count: 1,
            }),
            dismissLabel: t("general.close"),
          })
        },
        onError: (err) => {
          toast.error(t("general.error"), {
            description: err.message,
            dismissLabel: t("general.close"),
          })
        },
      }
    )
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/settings/sales-channels/${salesChannel.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
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
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { apiKey } = table.options.meta as {
            apiKey: string
          }

          return (
            <SalesChannelActions salesChannel={row.original} apiKey={apiKey} />
          )
        },
      }),
    ],
    [base]
  )
}
