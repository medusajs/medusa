import { HttpTypes } from "@medusajs/types"
import { Container, Copy, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { SectionRow } from "../../../../../components/common/section"
import { useDate } from "../../../../../hooks/use-date"
import { AuditLogOutcomeBadge } from "../../../common/audit-log-outcome-badge"
import {
  getActorUserName,
  useAuditLogActorUsers,
} from "../../../common/use-audit-log-actor-users"

type AuditLogGeneralSectionProps = {
  auditLog: HttpTypes.AdminAuditLog
}

export const AuditLogGeneralSection = ({
  auditLog,
}: AuditLogGeneralSectionProps) => {
  const { t } = useTranslation()
  const { getFullDate } = useDate()
  const actorUsers = useAuditLogActorUsers([auditLog])
  const actorUser = auditLog.actor_id
    ? actorUsers.get(auditLog.actor_id)
    : undefined

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between gap-x-4 px-6 py-4">
        <div className="flex min-w-0 items-center gap-x-1">
          <Heading className="truncate">{auditLog.action}</Heading>
          <Copy content={auditLog.action} className="text-ui-fg-muted" />
        </div>
        <AuditLogOutcomeBadge outcome={auditLog.outcome} />
      </div>
      <SectionRow title={t("fields.id")} value={auditLog.id} />
      <SectionRow
        title={t("auditLogs.fields.startedAt")}
        value={getFullDate({ date: auditLog.started_at, includeTime: true })}
      />
      <SectionRow
        title={t("auditLogs.fields.endedAt")}
        value={getFullDate({ date: auditLog.ended_at, includeTime: true })}
      />
      {actorUser && (
        <SectionRow
          title={t("auditLogs.fields.actor")}
          value={
            <Link
              to={`/settings/users/${actorUser.id}`}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover flex flex-col"
            >
              <span>{getActorUserName(actorUser)}</span>
              {getActorUserName(actorUser) !== actorUser.email && (
                <span className="text-ui-fg-subtle">{actorUser.email}</span>
              )}
            </Link>
          }
        />
      )}
      <SectionRow
        title={t("auditLogs.fields.actorType")}
        value={auditLog.actor_type}
      />
      <SectionRow
        title={t("auditLogs.fields.actorId")}
        value={auditLog.actor_id}
      />
      <SectionRow
        title={t("auditLogs.fields.impersonatorId")}
        value={auditLog.impersonator_id}
      />
      <SectionRow
        title={t("auditLogs.fields.resourceType")}
        value={auditLog.resource_type}
      />
      <SectionRow
        title={t("auditLogs.fields.resourceId")}
        value={auditLog.resource_id}
      />
    </Container>
  )
}
