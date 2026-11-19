import { HttpTypes } from "@medusajs/types"
import { createDataTableColumnHelper } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { useDate } from "../../../../../hooks/use-date"
import { AuditLogOutcomeBadge } from "../../../common/audit-log-outcome-badge"
import { TwoLineCell } from "./two-line-cell"

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminAuditLog>()

export const useAuditLogTableColumns = () => {
  const { t } = useTranslation()
  const { getFullDate } = useDate()

  return useMemo(
    () => [
      columnHelper.accessor("started_at", {
        header: t("auditLogs.fields.time"),
        cell: ({ row }) =>
          getFullDate({ date: row.original.started_at, includeTime: true }),
        enableSorting: true,
        sortAscLabel: t("filters.sorting.dateAsc"),
        sortDescLabel: t("filters.sorting.dateDesc"),
      }),
      columnHelper.accessor("actor_id", {
        header: t("auditLogs.fields.actor"),
        cell: ({ row }) => {
          const { actor_type, actor_id, impersonator_id } = row.original

          return (
            <TwoLineCell
              primary={actor_id ?? actor_type}
              secondary={
                impersonator_id
                  ? t("auditLogs.impersonatedBy", { id: impersonator_id })
                  : actor_id
                    ? actor_type
                    : null
              }
            />
          )
        },
      }),
      columnHelper.accessor("action", {
        header: t("auditLogs.fields.action"),
        cell: ({ row }) => <TwoLineCell primary={row.original.action} />,
      }),
      columnHelper.accessor("resource_id", {
        header: t("auditLogs.fields.resource"),
        cell: ({ row }) => {
          const { resource_type, resource_id } = row.original

          if (!resource_type && !resource_id) {
            return "-"
          }

          return (
            <TwoLineCell
              primary={resource_id ?? resource_type!}
              secondary={resource_id ? resource_type : null}
            />
          )
        },
      }),
      columnHelper.accessor("outcome", {
        header: t("auditLogs.fields.outcome"),
        cell: ({ row }) => (
          <AuditLogOutcomeBadge outcome={row.original.outcome} />
        ),
      }),
    ],
    [t, getFullDate]
  )
}
