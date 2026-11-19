import { Container } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { DataTable } from "../../../../../components/data-table"
import { useAuditLogs } from "../../../../../hooks/api/audit-logs"
import { AUDIT_LOG_PAGE_SIZE } from "../../../common/constants"
import { useAuditLogActorUsers } from "../../../common/use-audit-log-actor-users"
import { useAuditLogTableColumns } from "./use-audit-log-table-columns"
import { useAuditLogTableFilters } from "./use-audit-log-table-filters"
import { useAuditLogTableQuery } from "./use-audit-log-table-query"

export const AuditLogListTable = () => {
  const { t } = useTranslation()
  const { searchParams } = useAuditLogTableQuery()

  const { audit_logs, count, isPending, isError, error } = useAuditLogs(
    searchParams,
    { placeholderData: keepPreviousData }
  )

  const actorUsers = useAuditLogActorUsers(audit_logs)
  const columns = useAuditLogTableColumns(actorUsers)
  const filters = useAuditLogTableFilters()

  // Providers aren't required to support `q`, so a failed search shows the
  // provider's message in place of the rows instead of the error page.
  const searchError = isError && searchParams.q ? error : null

  if (isError && !searchError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <DataTable
        data={searchError ? [] : audit_logs}
        columns={columns}
        filters={filters}
        getRowId={(row) => row.id}
        rowHref={(row) => row.id}
        rowCount={searchError ? 0 : count}
        pageSize={AUDIT_LOG_PAGE_SIZE}
        heading={t("auditLogs.domain")}
        subHeading={t("auditLogs.subtitle")}
        isLoading={isPending}
        emptyState={{
          empty: {
            heading: t("auditLogs.list.empty.heading"),
            description: t("auditLogs.list.empty.description"),
          },
          filtered: searchError
            ? {
                heading: t("auditLogs.list.searchError.heading"),
                description: searchError.message,
              }
            : {
                heading: t("auditLogs.list.filtered.heading"),
                description: t("auditLogs.list.filtered.description"),
              },
        }}
      />
    </Container>
  )
}
