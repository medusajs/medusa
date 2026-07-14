import { DataTableStatusCell } from "../../../../components/data-table/components/data-table-status-cell/data-table-status-cell"
import { registerCellRenderer } from "../../../../lib/table/cell-renderers"

/**
 * Sales-channel-specific cell renderers, registered in the GLOBAL registry so
 * consuming apps can override them. Imported for its side effect by the
 * configurable sales channel table.
 */

// Enabled / disabled status derived from is_disabled.
registerCellRenderer("sales_channel_status", {
  render: (value, _row, _column, t) => (
    <DataTableStatusCell color={value ? "grey" : "green"}>
      {value ? t("general.disabled") : t("general.enabled")}
    </DataTableStatusCell>
  ),
})
