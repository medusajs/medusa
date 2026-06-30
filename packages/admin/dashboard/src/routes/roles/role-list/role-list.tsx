import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useRequireRbacFeature } from "../../../hooks/use-require-rbac-feature"
import { RoleListTable } from "./components/role-list-table"

export const RoleList = () => {
  const isRbacEnabled = useRequireRbacFeature()

  if (!isRbacEnabled) {
    return null
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="role.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="RoleListTable">
            <RoleListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
