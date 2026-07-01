import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { UserListTable } from "./components/user-list-table"

export const UserList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="user.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="UserListTable">
            <UserListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
