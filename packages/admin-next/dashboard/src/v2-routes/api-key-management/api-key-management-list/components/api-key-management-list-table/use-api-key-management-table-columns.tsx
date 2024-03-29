import { PencilSquare, Trash, XCircle } from "@medusajs/icons"
import { PublishableApiKey } from "@medusajs/medusa"
import { Copy, Text, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import {
  adminPublishableApiKeysKeys,
  useAdminCustomDelete,
  useAdminCustomPost,
  useAdminDeletePublishableApiKey,
  useAdminRevokePublishableApiKey,
} from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DateCell } from "../../../../../components/table/table-cells/common/date-cell"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import { ApiKeyDTO } from "@medusajs/types"

const columnHelper = createColumnHelper<ApiKeyDTO>()

export const useApiKeyManagementTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ getValue }) => (
          <div className="flex size-full items-center">
            <span className="truncate">{getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("redacted", {
        header: "Token",
        cell: ({ getValue, row }) => {
          const token = getValue()

          return (
            <div
              className="bg-ui-bg-subtle border-ui-border-base box-border flex w-fit max-w-[220px] cursor-default items-center gap-x-0.5 overflow-hidden rounded-full border pl-2 pr-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Text size="xsmall" leading="compact" className="truncate">
                {token}
              </Text>
              <Copy
                content={row.original.token}
                variant="mini"
                className="text-ui-fg-subtle"
              />
            </div>
          )
        },
      }),
      columnHelper.accessor("revoked_at", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const revokedAt = getValue()

          return (
            <StatusCell color={revokedAt ? "red" : "green"}>
              {revokedAt ? t("general.revoked") : t("general.active")}
            </StatusCell>
          )
        },
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.created"),
        cell: ({ getValue }) => {
          const date = getValue()

          return <DateCell date={date} />
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <ApiKeyActions apiKey={row.original as any} />
        },
      }),
    ],
    [t]
  )
}

const ApiKeyActions = ({ apiKey }: { apiKey: PublishableApiKey }) => {
  const { mutateAsync: revokeAsync } = useAdminCustomPost(
    `/api-keys/${apiKey.id}/revoke`,
    [
      adminPublishableApiKeysKeys.lists(),
      adminPublishableApiKeysKeys.detail(apiKey.id),
    ]
  )
  const { mutateAsync: deleteAsync } = useAdminCustomDelete(
    `/api-keys/${apiKey.id}`,
    [
      adminPublishableApiKeysKeys.lists(),
      adminPublishableApiKeysKeys.detail(apiKey.id),
    ]
  )

  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.deleteKeyWarning", {
        title: apiKey.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await deleteAsync()
  }

  const handleRevoke = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.revokeKeyWarning", {
        title: apiKey.title,
      }),
      confirmText: t("apiKeyManagement.revoke"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await revokeAsync({})
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/settings/api-key-management/${apiKey.id}`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <XCircle />,
              label: t("apiKeyManagement.revoke"),
              onClick: handleRevoke,
            },
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
