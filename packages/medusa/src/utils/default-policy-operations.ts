import { PolicyOperation } from "@medusajs/framework/utils"

// Default operations for all resources
export const defaultPolicyOperations = Object.keys(PolicyOperation).filter(
  (key) => key !== "ALL" && key !== "*"
)
