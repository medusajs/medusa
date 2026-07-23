import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { RefundReasonListTable } from "./components/refund-reason-list-table"
import { ConfigurableRefundReasonListTable } from "./components/refund-reason-list-table/configurable-refund-reason-list-table"

export const RefundReasonList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="refund_reason.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="RefundReasonListTable">
            {isViewConfigEnabled ? (
              <ConfigurableRefundReasonListTable />
            ) : (
              <RefundReasonListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
