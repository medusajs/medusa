import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { CustomerGroupListTable } from "./components/customer-group-list-table"
import { ConfigurableCustomerGroupListTable } from "./components/customer-group-list-table/configurable-customer-group-list-table"

export const CustomerGroupsList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="customer_group.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="CustomerGroupListTable">
            {isViewConfigEnabled ? (
              <ConfigurableCustomerGroupListTable />
            ) : (
              <CustomerGroupListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
