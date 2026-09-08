import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ReturnReasonListTable } from "./components/return-reason-list-table"
import { ConfigurableReturnReasonListTable } from "./components/return-reason-list-table/configurable-return-reason-list-table"

export const ReturnReasonList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="return_reason.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ReturnReasonListTable">
            {isViewConfigEnabled ? (
              <ConfigurableReturnReasonListTable />
            ) : (
              <ReturnReasonListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
