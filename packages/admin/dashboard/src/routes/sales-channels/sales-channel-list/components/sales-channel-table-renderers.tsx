import { registerCellResolver } from "../../../../lib/table/cell-renderers"

/**
 * Sales-channel-specific cell resolvers, registered in the GLOBAL registry so
 * consuming apps can override them. Imported for its side effect by the
 * configurable sales channel table.
 */

// Enabled / disabled status derived from is_disabled. Value resolver.
registerCellResolver("sales_channel_status", (value, _row, t) => ({
  color: value ? "grey" : "green",
  label: value ? t("general.disabled") : t("general.enabled"),
}))
