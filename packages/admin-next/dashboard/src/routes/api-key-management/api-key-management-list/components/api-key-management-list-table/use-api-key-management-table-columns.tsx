import { AdminApiKeyResponse } from "@medusajs/types"
import { Badge, Copy, Text } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { MouseEvent, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { DateCell } from "../../../../../components/table/table-cells/common/date-cell"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import { TextCell } from "../../../../../components/table/table-cells/common/text-cell"
import {
  getApiKeyStatusProps,
  getApiKeyTypeProps,
  prettifyRedactedToken,
} from "../../../common/utils"
import { ApiKeyRowActions } from "./api-key-row-actions"

const columnHelper = createColumnHelper<AdminApiKeyResponse["api_key"]>()

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
          const isSecret = row.original.type === "secret"

          if (isSecret) {
            return <Badge size="2xsmall">{prettifyRedactedToken(token)}</Badge>
          }

          const clickHandler = (e: MouseEvent) => e.stopPropagation()

          return (
            <Badge size="2xsmall" className="max-w-40" onClick={clickHandler}>
              <Copy
                content={row.original.token}
                className="text-ui-fg-subtle"
                asChild
              >
                <Text size="xsmall" leading="compact" className="truncate">
                  {prettifyRedactedToken(token)}
                </Text>
              </Copy>
            </Badge>
          )
        },
      }),
      columnHelper.accessor("type", {
        header: t("fields.type"),
        cell: ({ getValue }) => {
          const { label } = getApiKeyTypeProps(getValue(), t)

          return <TextCell text={label} />
        },
      }),
      columnHelper.accessor("revoked_at", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const { color, label } = getApiKeyStatusProps(getValue(), t)

          return <StatusCell color={color}>{label}</StatusCell>
        },
      }),
      columnHelper.accessor("last_used_at", {
        header: t("apiKeyManagement.table.lastUsedAtHeader"),
        cell: ({ getValue }) => {
          const date = getValue()

          return <DateCell date={date} />
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
          return <ApiKeyRowActions apiKey={row.original as any} />
        },
      }),
    ],
    [t]
  )
}
