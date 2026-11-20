import { HttpTypes } from "@medusajs/types"
import { createDataTableColumnHelper } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { useDate } from "../../../../../hooks/use-date"
import { AuditLogOutcomeBadge } from "../../../common/audit-log-outcome-badge"
import {
  AuditLogActorUser,
  getActorUserName,
} from "../../../common/use-audit-log-actor-users"
import { TwoLineCell } from "./two-line-cell"

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminAuditLog>()
const NO_ACTOR_USERS = new Map<string, AuditLogActorUser>()

export const useAuditLogTableColumns = (
  actorUsers: Map<string, AuditLogActorUser> = NO_ACTOR_USERS
) => {
  const { t } = useTranslation()
  const { getFullDate } = useDate()

  return useMemo(
    () => [
      columnHelper.accessor("started_at", {
        size: 180,
        header: t("auditLogs.fields.time"),
        cell: ({ row }) =>
          getFullDate({ date: row.original.started_at, includeTime: true }),
        enableSorting: true,
        sortAscLabel: t("filters.sorting.dateAsc"),
        sortDescLabel: t("filters.sorting.dateDesc"),
      }),
      columnHelper.accessor("actor_id", {
        size: 260,
        header: t("auditLogs.fields.actor"),
        cell: ({ row }) => {
          const { actor_type, actor_id, impersonator_id } = row.original
          const user =
            actor_type === "user" && actor_id
              ? actorUsers.get(actor_id)
              : undefined

          return (
            <TwoLineCell
              primary={user ? getActorUserName(user) : (actor_id ?? actor_type)}
              secondary={
                impersonator_id
                  ? t("auditLogs.impersonatedBy", { id: impersonator_id })
                  : user
                    ? user.email
                    : actor_id
                      ? actor_type
                      : null
              }
            />
          )
        },
      }),
      // The DataTable reserves the `action` column id for the row actions menu.
      columnHelper.display({
        id: "audit_action",
        size: 240,
        header: t("auditLogs.fields.action"),
        cell: ({ row }) => <TwoLineCell primary={row.original.action} />,
      }),
      columnHelper.accessor("resource_id", {
        size: 280,
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
        size: 130,
        header: t("auditLogs.fields.outcome"),
        cell: ({ row }) => (
          <AuditLogOutcomeBadge outcome={row.original.outcome} />
        ),
      }),
    ],
    [t, getFullDate, actorUsers]
  )
}
