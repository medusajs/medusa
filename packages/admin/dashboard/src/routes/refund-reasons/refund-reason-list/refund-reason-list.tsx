import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { RefundReasonListTable } from "./components/refund-reason-list-table"

export const RefundReasonList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="refund_reason.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="RefundReasonListTable">
            <RefundReasonListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
