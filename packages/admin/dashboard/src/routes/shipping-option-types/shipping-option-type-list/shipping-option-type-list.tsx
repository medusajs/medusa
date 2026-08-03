import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ShippingOptionTypeListTable } from "./components/shipping-option-type-list-table"
import { ConfigurableShippingOptionTypeListTable } from "./components/shipping-option-type-list-table/configurable-shipping-option-type-list-table"

export const ShippingOptionTypeList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="shipping_option_type.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ShippingOptionTypeListTable">
            {isViewConfigEnabled ? (
              <ConfigurableShippingOptionTypeListTable />
            ) : (
              <ShippingOptionTypeListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
