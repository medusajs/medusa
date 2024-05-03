import { FeatureFlagTypes } from "@medusajs/types"

export const MedusaV2Flag: FeatureFlagTypes.FlagSettings = {
  key: "medusa_v2",
  default_val: false,
  env_key: "MEDUSA_FF_MEDUSA_V2",
  description: "[WIP] Enable Medusa V2",
}
