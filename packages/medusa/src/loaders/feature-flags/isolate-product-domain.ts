import { FlagSettings } from "../../types/feature-flags"

const IsolateProductDomainFeatureFlag: FlagSettings = {
  key: "isolate_product_domain",
  default_val: false,
  env_key: "MEDUSA_FF_ISOLATE_PRODUCT_DOMAIN",
  description: "[WIP] Isolate product domain dependencies from the core",
}

export default IsolateProductDomainFeatureFlag
