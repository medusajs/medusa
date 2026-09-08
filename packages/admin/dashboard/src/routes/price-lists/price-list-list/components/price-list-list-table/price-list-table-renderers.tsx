import { HttpTypes } from "@medusajs/types"
import {
  defineCellRenderer,
  registerCellResolver,
} from "../../../../../lib/table/cell-renderers"
import { getPriceListStatus } from "../../../common/utils"
import { PriceCountCell } from "./price-count-cell"

// Status is derived from the raw status plus start/end dates. Value resolver:
// returns the { color, label } variant; the generic status renderer draws the pill.
registerCellResolver("price_list_status", (_value, row, t) => {
  const { color, text } = getPriceListStatus(t, row as HttpTypes.AdminPriceList)
  return { color, label: text }
})

// Price override count is fetched per row by PriceCountCell.
defineCellRenderer("price_overrides_count", {
  render: (_value, row) => {
    return <PriceCountCell priceListId={(row as HttpTypes.AdminPriceList).id} />
  },
})
