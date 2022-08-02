import { FlagSettings } from "../../types/feature-flags"

const TaxInclusiveFeatureFlag: FlagSettings = {
  key: "tax_inclusive",
  default_val: false,
  env_key: "MEDUSA_FF_TAX_INCLUSIVE",
  description: "[WIP] Enable the tax inclusive feature",
}

export default TaxInclusiveFeatureFlag
