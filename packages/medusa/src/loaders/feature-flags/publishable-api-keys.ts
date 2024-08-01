import { FlagSettings } from "@medusajs/framework"

const PublishableAPIKeysFeatureFlag: FlagSettings = {
  key: "publishable_api_keys",
  default_val: true,
  env_key: "MEDUSA_FF_PUBLISHABLE_API_KEYS",
  description: "[WIP] Enable the publishable API keys feature",
}

export default PublishableAPIKeysFeatureFlag
