import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { CustomerListTable } from "./components/customer-list-table"

export const CustomersList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="customer.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="CustomerListTable">
            <CustomerListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
