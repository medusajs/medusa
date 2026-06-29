import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { ShippingProfileListTable } from "./components/shipping-profile-list-table"

export const ShippingProfileList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="shipping_profile.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ShippingProfileListTable">
            <ShippingProfileListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
