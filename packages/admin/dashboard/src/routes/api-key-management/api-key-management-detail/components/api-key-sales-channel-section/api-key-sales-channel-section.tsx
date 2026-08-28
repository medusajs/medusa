import { PencilSquare, Trash } from "@medusajs/icons"
import { AdminApiKeyResponse, HttpTypes } from "@medusajs/types"
import {
  Container,
  createDataTableColumnHelper,
  createDataTableCommandHelper,
  DataTableRowSelectionState,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { RowSelectionState } from "@tanstack/react-table"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { DataTable } from "../../../../../components/data-table"
import * as hooks from "../../../../../components/data-table/helpers/sales-channels"
import { useBatchRemoveSalesChannelsFromApiKey } from "../../../../../hooks/api/api-keys"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"
import {
  useApiKeyPermissions,
  useSalesChannelPermissions,
} from "../../../../../hooks/use-resource-permissions"

type ApiKeySalesChannelSectionProps = {
  apiKey: AdminApiKeyResponse["api_key"]
}

const PAGE_SIZE = 10
const PREFIX = "sc"

export const ApiKeySalesChannelSection = ({
  apiKey,
}: ApiKeySalesChannelSectionProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { t } = useTranslation()
  const { canUpdate: canUpdateApiKey } = useApiKeyPermissions()
  const { canUpdate: canUpdateSalesChannels } = useSalesChannelPermissions()

  const canUpdate = canUpdateApiKey && canUpdateSalesChannels

  const searchParams = hooks.useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const { sales_channels, count, isPending } = useSalesChannels(
    { ...searchParams, publishable_key_id: apiKey.id },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns(apiKey.id, canUpdate)
  const filters = hooks.useSalesChannelTableFilters()
  const commands = useCommands(apiKey.id, setRowSelection, canUpdate)
  const emptyState = hooks.useSalesChannelTableEmptyState()

  return (
    <Container className="divide-y p-0">
      <DataTable
        data={sales_channels}
        columns={columns}
        filters={filters}
        commands={commands}
        heading={t("salesChannels.domain")}
        headingLevel="h2"
        getRowId={(row) => row.id}
        rowCount={count}
        isLoading={isPending}
        emptyState={emptyState}
        rowSelection={{
          state: rowSelection,
          onRowSelectionChange: setRowSelection,
        }}
        rowHref={(row) => `/settings/sales-channels/${row.id}`}
        action={
          canUpdate
            ? {
                label: t("actions.add"),
                to: "sales-channels",
              }
            : undefined
        }
        prefix={PREFIX}
        pageSize={PAGE_SIZE}
      />
    </Container>
  )
}

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminSalesChannel>()

const useColumns = (id: string, canUpdate: boolean) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const base = hooks.useSalesChannelTableColumns()

  const { mutateAsync } = useBatchRemoveSalesChannelsFromApiKey(id)

  const handleDelete = useCallback(
    async (salesChannel: HttpTypes.AdminSalesChannel) => {
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
            t("apiKeyManagement.removeSalesChannel.successToast", {
              count: 1,
            })
          )
        },
        onError: (err) => {
          toast.error(err.message)
        },
      })
    },
    [mutateAsync, prompt, t]
  )

  return useMemo(
    () => [
      ...(canUpdate ? [columnHelper.select()] : []),
      ...base,
      ...(canUpdate
        ? [
            columnHelper.action({
              actions: (ctx) => [
                [
                  {
                    label: t("actions.edit"),
                    icon: <PencilSquare />,
                    onClick: () => {
                      navigate(
                        `/settings/sales-channels/${ctx.row.original.id}/edit`
                      )
                    },
                  },
                ],
                [
                  {
                    icon: <Trash />,
                    label: t("actions.delete"),
                    onClick: () => handleDelete(ctx.row.original),
                  },
                ],
              ],
            }),
          ]
        : []),
    ],
    [base, handleDelete, navigate, t, canUpdate]
  )
}

const commandHelper = createDataTableCommandHelper()

const useCommands = (
  id: string,
  setRowSelection: (state: DataTableRowSelectionState) => void,
  canUpdate: boolean
) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useBatchRemoveSalesChannelsFromApiKey(id)

  const handleRemove = useCallback(
    async (rowSelection: DataTableRowSelectionState) => {
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

      await mutateAsync(keys, {
        onSuccess: () => {
          toast.success(
            t("apiKeyManagement.removeSalesChannel.successToastBatch", {
              count: keys.length,
            })
          )
          setRowSelection({})
        },
        onError: (err) => {
          toast.error(err.message)
        },
      })
    },
    [mutateAsync, prompt, t, setRowSelection]
  )

  return useMemo(() => {
    if (!canUpdate) {
      return []
    }

    return [
      commandHelper.command({
        action: handleRemove,
        label: t("actions.remove"),
        shortcut: "r",
      }),
    ]
  }, [handleRemove, t, canUpdate])
}
