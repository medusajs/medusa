import { FlagSettings } from "../../types/feature-flags"

const AnalyticsFeatureFlag: FlagSettings = {
  key: "analytics",
  default_val: true,
  env_key: "MEDUSA_FF_ANALYTICS",
  description:
    "Enable Medusa to collect data on usage, errors and performance for the purpose of improving the product",
}

export default AnalyticsFeatureFlag
