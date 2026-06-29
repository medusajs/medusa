import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { ShippingOptionTypeListTable } from "./components/shipping-option-type-list-table"

export const ShippingOptionTypeList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="shipping_option_type.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ShippingOptionTypeListTable">
            <ShippingOptionTypeListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
