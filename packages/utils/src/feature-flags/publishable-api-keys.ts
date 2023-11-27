import { FeatureFlagTypes } from "@medusajs/types"

export const PublishableAPIKeysFeatureFlag: FeatureFlagTypes.FlagSettings = {
  key: "publishable_api_keys",
  default_val: true,
  env_key: "MEDUSA_FF_PUBLISHABLE_API_KEYS",
  description: "[WIP] Enable the publishable API keys feature",
}
