import { FlagSettings } from "../../types/feature-flags"

const PricingIntegrationFeatureFlag: FlagSettings = {
  key: "isolate_pricing_domain",
  default_val: false,
  env_key: "MEDUSA_FF_ISOLATE_PRICING_DOMAIN",
  description: "[WIP] use price module integration for pricing",
}

export default PricingIntegrationFeatureFlag
