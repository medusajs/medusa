import { definePolicies } from "@medusajs/framework/utils"
import { generateResourcePolicies } from "../utils"

const translationResources = ["translation", "translation_settings"]

export const translationPolicies = definePolicies(
  generateResourcePolicies(translationResources)
)
