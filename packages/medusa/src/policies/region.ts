import { definePolicies } from "@zjedene-medusa/framework/utils"
import { generateResourcePolicies } from "../utils"

const regionResources = ["region"]

export const regionPolicies = definePolicies(
  generateResourcePolicies(regionResources)
)
