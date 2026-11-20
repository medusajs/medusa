import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { SectionRow } from "../../../../../components/common/section"

type AuditLogRequestSectionProps = {
  request: HttpTypes.AdminAuditLogRequest | null
}

export const AuditLogRequestSection = ({
  request,
}: AuditLogRequestSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">{t("auditLogs.request.header")}</Heading>
      </div>
      {request ? (
        <>
          <SectionRow
            title={t("auditLogs.request.method")}
            value={request.method}
          />
          <SectionRow
            title={t("auditLogs.request.route")}
            value={request.route}
          />
          <SectionRow
            title={t("auditLogs.request.path")}
            value={request.path}
          />
          <SectionRow
            title={t("auditLogs.request.statusCode")}
            value={String(request.status_code)}
          />
          <SectionRow
            title={t("auditLogs.request.requestId")}
            value={request.request_id}
          />
          <SectionRow
            title={t("auditLogs.request.ipAddress")}
            value={request.ip_address}
          />
          <SectionRow
            title={t("auditLogs.request.userAgent")}
            value={request.user_agent}
          />
        </>
      ) : (
        <div className="px-6 py-4">
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {t("auditLogs.request.none")}
          </Text>
        </div>
      )}
    </Container>
  )
}
