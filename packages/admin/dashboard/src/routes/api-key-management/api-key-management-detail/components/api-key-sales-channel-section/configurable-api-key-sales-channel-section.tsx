import { PencilSquare, Trash } from "@medusajs/icons"
import { AdminApiKeyResponse, HttpTypes } from "@medusajs/types"
import { DataTableCommand, toast, usePrompt } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useBatchRemoveSalesChannelsFromApiKey } from "../../../../../hooks/api/api-keys"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"
import { createTableAdapter } from "../../../../../lib/table/table-adapters"
// Registers the `sales_channel_status` renderer for the is_disabled pill.
import "../../../../sales-channels/sales-channel-list/components/sales-channel-table-renderers"

const ALLOWED_FILTERS = [
  "id",
  "name",
  "description",
  "is_disabled",
  "created_at",
  "updated_at",
  "deleted_at",
]

const ApiKeySalesChannelRowActions = ({
  salesChannel,
  apiKeyId,
}: {
  salesChannel: HttpTypes.AdminSalesChannel
  apiKeyId: string
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useBatchRemoveSalesChannelsFromApiKey(apiKeyId)

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
    await mutateAsync([salesChannel.id], {
      onSuccess: () => {
        toast.success(
          t("apiKeyManagement.removeSalesChannel.successToast", { count: 1 })
        )
      },
      onError: (err) => toast.error(err.message),
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              to: `/settings/sales-channels/${salesChannel.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              icon: <Trash />,
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

export const ConfigurableApiKeySalesChannelSection = ({
  apiKey,
}: {
  apiKey: AdminApiKeyResponse["api_key"]
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useBatchRemoveSalesChannelsFromApiKey(apiKey.id)

  const commands = useMemo<DataTableCommand[]>(
    () => [
      {
        label: t("actions.remove"),
        shortcut: "r",
        action: async (selection) => {
          const ids = Object.keys(selection)
          const res = await prompt({
            title: t("general.areYouSure"),
            description: t("apiKeyManagement.removeSalesChannel.warningBatch", {
              count: ids.length,
            }),
            confirmText: t("actions.continue"),
            cancelText: t("actions.cancel"),
          })
          if (!res) {
            return
          }
          await mutateAsync(ids, {
            onSuccess: () => {
              toast.success(
                t("apiKeyManagement.removeSalesChannel.successToastBatch", {
                  count: ids.length,
                })
              )
            },
            onError: (err) => toast.error(err.message),
          })
        },
      },
    ],
    [t, prompt, mutateAsync]
  )

  const adapter = useMemo(
    () =>
      createTableAdapter<HttpTypes.AdminSalesChannel>({
        entity: "sales-channels",
        viewConfigurationKey: "sales-channels-api-key",
        queryPrefix: "apisc",
        pageSize: 10,
        enableRowSelection: true,
        commands,
        emptyState: {
          empty: { heading: t("general.noRecordsMessage") },
          filtered: {
            heading: t("general.noRecordsMessage"),
            description: t("general.noRecordsMessageFiltered"),
          },
        },
        useData: (fields, params) => {
          const { sales_channels, count, isError, error, isLoading } =
            useSalesChannels(
              {
                fields,
                ...params,
                publishable_key_id: apiKey.id,
              },
              {
                placeholderData: (previousData: any, previousQuery: any) => {
                  const prevFields =
                    previousQuery?.[previousQuery?.length - 1]?.query?.fields
                  if (prevFields && prevFields !== fields) {
                    return undefined
                  }
                  return previousData
                },
              }
            )
          return { data: sales_channels, count, isLoading, isError, error }
        },
        getRowHref: (row) => `/settings/sales-channels/${row.id}`,
        renderRowActions: (row) => (
          <ApiKeySalesChannelRowActions
            salesChannel={row}
            apiKeyId={apiKey.id}
          />
        ),
        transformColumns: (columns) =>
          columns.map((column) => ({
            ...column,
            filter: !ALLOWED_FILTERS.includes(column.field)
              ? { ...column.filter, enabled: false }
              : column.filter,
          })),
      }),
    [t, apiKey.id, commands]
  )

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("salesChannels.domain")}
      actions={[{ label: t("actions.add"), to: "sales-channels" }]}
    />
  )
}
