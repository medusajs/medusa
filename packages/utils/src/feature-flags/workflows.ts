import { FeatureFlagTypes } from "@medusajs/types"

export const WorkflowsFeatureFlag: FeatureFlagTypes.FlagSettings = {
  key: "workflows",
  default_val: false,
  env_key: "MEDUSA_FF_WORKFLOW_ENGINES",
  description: "[WIP] Enable workflows",
}
