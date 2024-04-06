import { PencilSquare, Trash } from "@medusajs/icons"
import {
  Button,
  Checkbox,
  Container,
  Heading,
  StatusBadge,
  usePrompt,
} from "@medusajs/ui"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import {
  adminPublishableApiKeysKeys,
  useAdminCustomPost,
  useAdminRemovePublishableKeySalesChannelsBatch,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"
import { useSalesChannelTableQuery } from "../../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { DataTable } from "../../../../../components/table/data-table"
import { keepPreviousData } from "@tanstack/react-query"
import { AdminApiKeyResponse, AdminSalesChannelResponse } from "@medusajs/types"
import { useBatchRemoveSalesChannelsFromApiKey } from "../../../../../hooks/api/api-keys"

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

  const columns = useColumns({ apiKey: apiKey.id })
  // const filters = useProductTableFilters(["sales_channel_id"])

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
  })

  const { mutateAsync } = useBatchRemoveSalesChannelsFromApiKey(apiKey.id)

  const handleRemove = async () => {
    const keys = Object.keys(rowSelection)

    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.removeSalesChannelsWarning", {
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
          setRowSelection({})
        },
      }
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("salesChannels.domain")}</Heading>
        <Button variant="secondary" size="small" asChild>
          <Link to="add-sales-channels">{t("general.add")}</Link>
        </Button>
      </div>
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
        commands={[
          {
            action: handleRemove,
            label: t("actions.remove"),
            shortcut: "r",
          },
        ]}
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
      description: t("apiKeyManagement.removeSalesChannelWarning", {
        name: salesChannel.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync({
      sales_channel_ids: [salesChannel.id],
    })
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

const useColumns = ({ apiKey }: { apiKey: string }) => {
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
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ getValue }) => getValue(),
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
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          return (
            <SalesChannelActions salesChannel={row.original} apiKey={apiKey} />
          )
        },
      }),
    ],
    [t]
  )
}
