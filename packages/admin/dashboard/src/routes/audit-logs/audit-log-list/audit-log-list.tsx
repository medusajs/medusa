import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { AuditLogListTable } from "./components/audit-log-list-table"

export const AuditLogList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="audit_log.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="AuditLogListTable">
            <AuditLogListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
