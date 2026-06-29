import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { CustomerGroupListTable } from "./components/customer-group-list-table"

export const CustomerGroupsList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="customer_group.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="CustomerGroupListTable">
            <CustomerGroupListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
