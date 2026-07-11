import { HttpTypes } from "@medusajs/types"
import { registerCellRenderer } from "../../../../../lib/table/cell-renderers"
import { getPriceListStatus } from "../../../common/utils"
import { PriceCountCell } from "./price-count-cell"
import { DataTableStatusIndicator } from "../../../../../components/data-table/components/data-table-status-cell/data-table-status-cell"

// Status is derived from the raw status plus start/end dates.
// Use the shrink-to-fit indicator (not the w-full cell) so the column's
// center alignment can actually center it.
registerCellRenderer("price_list_status", {
  render: (_value, row, _column, t) => {
    const { color, text } = getPriceListStatus(
      t,
      row as HttpTypes.AdminPriceList
    )
    return (
      <DataTableStatusIndicator color={color}>{text}</DataTableStatusIndicator>
    )
  },
  align: "center",
})

// Price override count is fetched per row by PriceCountCell.
registerCellRenderer("price_overrides_count", {
  render: (_value, row) => {
    return <PriceCountCell priceListId={(row as HttpTypes.AdminPriceList).id} />
  },
})
