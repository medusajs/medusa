import { HttpTypes } from "@medusajs/types"
import { TextCell } from "../../../../../components/table/table-cells/common/text-cell"
import { StatusCell } from "../../../../../components/table/table-cells/promotion/status-cell"
import {
  defineCellRenderer,
  registerCellResolver,
} from "../../../../../lib/table/cell-renderers"

/**
 * Promotion-specific cell renderers, registered in the GLOBAL registry so
 * consuming apps can override them under the same render mode key. Imported for
 * its side effect by the configurable promotion table.
 */

defineCellRenderer("promotion_method", {
  render: (_value, row, _column, t) => {
    const isAutomatic = (row as HttpTypes.AdminPromotion).is_automatic
    return (
      <TextCell
        text={
          isAutomatic
            ? t("promotions.form.method.automatic.title")
            : t("promotions.form.method.code.title")
        }
      />
    )
  },
})

// Status derived from the promotion status + its campaign window/budget.
// Component resolver: reuses the shared promotion StatusCell as-is.
registerCellResolver("promotion_status", (_value, row) => (
  <StatusCell promotion={row as HttpTypes.AdminPromotion} />
))
