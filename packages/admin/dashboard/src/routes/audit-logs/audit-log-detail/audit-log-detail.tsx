import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useTranslation } from "react-i18next"
import { useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
import { useAuditLog } from "../../../hooks/api/audit-logs"
import { AuditLogGeneralSection } from "./components/audit-log-general-section"
import { AuditLogRequestSection } from "./components/audit-log-request-section"
import { auditLogLoader } from "./loader"

export const AuditLogDetail = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof auditLogLoader>
  >

  const { audit_log, isPending, isError, error } = useAuditLog(id!, undefined, {
    initialData,
  })

  if (isError) {
    throw error
  }

  if (isPending || !audit_log) {
    return <SingleColumnPageSkeleton sections={2} showJSON />
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="audit_log.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={audit_log}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="AuditLogGeneralSection">
              <AuditLogGeneralSection auditLog={audit_log} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="AuditLogRequestSection">
              <AuditLogRequestSection request={audit_log.request} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="AuditLogRequestDataSection">
              <JsonViewSection
                title={t("auditLogs.fields.requestData")}
                data={audit_log.request_data ?? {}}
              />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="AuditLogResponseDataSection">
              <JsonViewSection
                title={t("auditLogs.fields.responseData")}
                data={audit_log.response_data ?? {}}
              />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="AuditLogMetadataSection">
              <JsonViewSection
                title={t("fields.metadata")}
                data={audit_log.metadata ?? {}}
              />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="JsonViewSection">
              <JsonViewSection data={audit_log} />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}
