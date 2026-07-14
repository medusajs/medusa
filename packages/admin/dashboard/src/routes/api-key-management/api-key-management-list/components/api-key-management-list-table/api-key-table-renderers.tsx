import { Badge } from "@medusajs/ui"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import { TextCell } from "../../../../../components/table/table-cells/common/text-cell"
import { registerCellRenderer } from "../../../../../lib/table/cell-renderers"
import {
  getApiKeyStatusProps,
  getApiKeyTypeProps,
  prettifyRedactedToken,
} from "../../../common/utils"

/**
 * Api-key-specific cell renderers, registered in the GLOBAL registry so
 * consuming apps can override them under the same render mode key. Imported for
 * its side effect by the configurable api key table.
 */

// Redacted token, shown as a badge.
registerCellRenderer("api_key_token", {
  render: (value) => (
    <Badge size="2xsmall">{prettifyRedactedToken(String(value ?? ""))}</Badge>
  ),
})

// Publishable / secret type label.
registerCellRenderer("api_key_type", {
  render: (value, _row, _column, t) => (
    <TextCell text={getApiKeyTypeProps(value, t).label} />
  ),
})

// Active / revoked status derived from revoked_at.
registerCellRenderer("api_key_status", {
  render: (value, _row, _column, t) => {
    const { color, label } = getApiKeyStatusProps(value, t)
    return <StatusCell color={color}>{label}</StatusCell>
  },
  align: "center",
})
