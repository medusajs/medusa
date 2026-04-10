import { FlagSettings } from "@medusajs/framework/feature-flags"

const RbacFilterFieldsFeatureFlag: FlagSettings = {
  key: "rbac_filter_fields",
  default_val: false,
  env_key: "MEDUSA_FF_RBAC_FILTER_FIELDS",
  description: "Enable requests fields filtering based on user roles",
}

export default RbacFilterFieldsFeatureFlag
