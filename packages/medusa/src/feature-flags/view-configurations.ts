import { FlagSettings } from "@zjedene-medusa/framework/feature-flags"

const ViewConfigurationsFeatureFlag: FlagSettings = {
  key: "view_configurations",
  default_val: false,
  env_key: "MEDUSA_FF_VIEW_CONFIGURATIONS",
  description: "[WIP] Enable view configurations for data tables",
}

export default ViewConfigurationsFeatureFlag