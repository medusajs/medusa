import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ShippingProfileListTable } from "./components/shipping-profile-list-table"
import { ConfigurableShippingProfileListTable } from "./components/shipping-profile-list-table/configurable-shipping-profile-list-table"

export const ShippingProfileList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="shipping_profile.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ShippingProfileListTable">
            {isViewConfigEnabled ? (
              <ConfigurableShippingProfileListTable />
            ) : (
              <ShippingProfileListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
