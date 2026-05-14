import { FlagSettings } from "@medusajs/framework/feature-flags"

const RbacFeatureFlag: FlagSettings = {
  key: "rbac",
  default_val: false,
  env_key: "MEDUSA_FF_RBAC",
  description: "Enable role based access control",
}

export default RbacFeatureFlag
