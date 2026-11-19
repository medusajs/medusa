import { HttpTypes } from "@medusajs/types"
import { StatusBadge } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type Outcome = HttpTypes.AdminAuditLog["outcome"]

const OUTCOME_COLORS: Record<Outcome, "green" | "orange" | "red"> = {
  succeeded: "green",
  denied: "orange",
  failed: "red",
}

export const AuditLogOutcomeBadge = ({ outcome }: { outcome: Outcome }) => {
  const { t } = useTranslation()

  return (
    <StatusBadge color={OUTCOME_COLORS[outcome] ?? "grey"}>
      {t(`auditLogs.outcome.${outcome}`, { defaultValue: outcome })}
    </StatusBadge>
  )
}
