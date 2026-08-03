import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { CustomerListTable } from "./components/customer-list-table"
import { ConfigurableCustomerListTable } from "./components/customer-list-table/configurable-customer-list-table"

export const CustomersList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="customer.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="CustomerListTable">
            {isViewConfigEnabled ? (
              <ConfigurableCustomerListTable />
            ) : (
              <CustomerListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
