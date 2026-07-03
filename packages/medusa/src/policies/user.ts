import { definePolicies } from "@medusajs/framework/utils"
import { generateResourcePolicies } from "../utils"

const userResources = [
  "user",
  "api_key",
  "invite",
  "rbac_role",
  "rbac_policy",
]

export const userPolicies = definePolicies(
  generateResourcePolicies(userResources)
)
