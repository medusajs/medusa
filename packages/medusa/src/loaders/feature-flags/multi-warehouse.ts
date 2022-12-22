import { FlagSettings } from "../../types/feature-flags"

const MultiWarehouseFeatureFlag: FlagSettings = {
  key: "multi_warehouse",
  default_val: false,
  env_key: "MEDUSA_FF_MULTI_WAREHOUSE",
  description: "[WIP] Enable the multi warehouse feature",
}

export default MultiWarehouseFeatureFlag
