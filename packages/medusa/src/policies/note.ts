import { definePolicies } from "@medusajs/framework/utils"
import { generateResourcePolicies } from "../utils"

const noteResources = ["note"]

export const notePolicies = definePolicies(
  generateResourcePolicies(noteResources)
)
