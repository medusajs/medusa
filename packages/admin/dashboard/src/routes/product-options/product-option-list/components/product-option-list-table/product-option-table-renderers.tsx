import { Badge } from "@medusajs/ui"
import { defineCellRenderer } from "../../../../../lib/table/cell-renderers"

// "Global" vs "Product-specific" badge derived from is_exclusive.
defineCellRenderer("product_option_exclusivity", {
  render: (value, _row, _column, t) => {
    const isExclusive = Boolean(value)

    return (
      <Badge size="xsmall" color={isExclusive ? "grey" : "blue"}>
        {t(`general.${isExclusive ? "exclusive" : "global"}`)}
      </Badge>
    )
  },
})
