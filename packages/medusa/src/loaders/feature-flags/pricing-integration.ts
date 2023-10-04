import { FlagSettings } from "../../types/feature-flags"

const PricingIntegrationFeatureFlag: FlagSettings = {
  key: "pricing_integration",
  default_val: false,
  env_key: "MEDUSA_FF_PRICING_INTEGRATION",
  description: "[WIP] use price module integration for pricing",
}

export default PricingIntegrationFeatureFlag
