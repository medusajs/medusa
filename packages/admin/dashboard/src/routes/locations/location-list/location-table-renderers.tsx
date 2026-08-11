import { HttpTypes } from "@medusajs/types"
import { StatusBadge } from "@medusajs/ui"

import { ListSummary } from "../../../components/common/list-summary"
import { PlaceholderCell } from "../../../components/table/table-cells/common/placeholder-cell"
import { defineCellRenderer } from "../../../lib/table/cell-renderers"
import { FulfillmentSetType } from "../common/constants"

/**
 * Stock-location-specific cell renderers, registered in the GLOBAL registry so
 * consuming apps can override them. Imported for its side effect by the
 * configurable location table.
 */

const fulfillmentRenderer = (setType: FulfillmentSetType) => ({
  render: (_value: any, row: any, _column: any, t: any) => {
    const location = row as HttpTypes.AdminStockLocation
    const exists = !!location.fulfillment_sets?.find((f) => f.type === setType)

    return (
      <StatusBadge color={exists ? "green" : "grey"}>
        {t(exists ? "statuses.enabled" : "statuses.disabled")}
      </StatusBadge>
    )
  },
})

defineCellRenderer(
  "stock_location_shipping",
  fulfillmentRenderer(FulfillmentSetType.Shipping)
)
defineCellRenderer(
  "stock_location_pickup",
  fulfillmentRenderer(FulfillmentSetType.Pickup)
)

defineCellRenderer("stock_location_sales_channels", {
  render: (_value, row) => {
    const location = row as HttpTypes.AdminStockLocation
    const salesChannels = location.sales_channels

    if (!salesChannels?.length) {
      return <PlaceholderCell />
    }

    return (
      <div className="flex items-center">
        <ListSummary inline n={1} list={salesChannels.map((s) => s.name)} />
      </div>
    )
  },
})
