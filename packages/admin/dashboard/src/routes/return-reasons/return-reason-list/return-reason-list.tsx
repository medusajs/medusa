import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { ReturnReasonListTable } from "./components/return-reason-list-table"

export const ReturnReasonList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="return_reason.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ReturnReasonListTable">
            <ReturnReasonListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
