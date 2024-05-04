import { FeatureFlagTypes } from "@medusajs/types"

export const OrderEditingFeatureFlag: FeatureFlagTypes.FlagSettings = {
  key: "order_editing",
  default_val: true,
  env_key: "MEDUSA_FF_ORDER_EDITING",
  description: "[WIP] Enable the order editing feature",
}
