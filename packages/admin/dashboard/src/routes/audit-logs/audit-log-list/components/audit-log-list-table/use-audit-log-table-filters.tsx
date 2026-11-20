import { HttpTypes } from "@medusajs/types"
import { createDataTableFilterHelper } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { useDataTableDateFilters } from "../../../../../components/data-table/helpers/general/use-data-table-date-filters"
import { AUDIT_LOG_OUTCOMES } from "../../../common/constants"

const filterHelper = createDataTableFilterHelper<HttpTypes.AdminAuditLog>()

export const useAuditLogTableFilters = () => {
  const { t } = useTranslation()
  const dateFilters = useDataTableDateFilters()

  return useMemo(() => {
    // Reuse the shared date filter's presets and custom range for started_at.
    const createdAtFilter = dateFilters.find(
      (filter) => filter.id === "created_at"
    )!

    return [
      filterHelper.accessor("outcome", {
        type: "multiselect",
        label: t("auditLogs.fields.outcome"),
        options: AUDIT_LOG_OUTCOMES.map((outcome) => ({
          label: t(`auditLogs.outcome.${outcome}`),
          value: outcome,
        })),
      }),
      filterHelper.accessor("actor_type", {
        type: "string",
        label: t("auditLogs.fields.actorType"),
      }),
      filterHelper.accessor("action", {
        type: "string",
        label: t("auditLogs.fields.action"),
      }),
      filterHelper.accessor("resource_type", {
        type: "string",
        label: t("auditLogs.fields.resourceType"),
      }),
      {
        ...createdAtFilter,
        id: "started_at",
        label: t("auditLogs.fields.startedAt"),
      },
    ]
  }, [dateFilters, t])
}
