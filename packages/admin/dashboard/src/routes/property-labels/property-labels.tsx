import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { LayoutComposer } from "../../components/layout-composer"
import { PropertyLabelsList } from "./components/property-labels-list"

export const PropertyLabels = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="property_label.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="PropertyLabelListTable">
            <PropertyLabelsList />
          </LayoutComposer.Entry>
        ),
      }}
    ></LayoutComposer>
  )
}
