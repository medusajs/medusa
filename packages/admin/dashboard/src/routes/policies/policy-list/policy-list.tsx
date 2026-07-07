import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useRequireRbacFeature } from "../../../hooks/use-require-rbac-feature"
import { PolicyListTable } from "./components/policy-list-table"

export const PolicyList = () => {
  const isRbacEnabled = useRequireRbacFeature()

  if (!isRbacEnabled) {
    return null
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="policy.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="PolicyListTable">
            <PolicyListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
