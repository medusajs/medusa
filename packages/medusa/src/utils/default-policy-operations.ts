import { PolicyOperation, WILDCARD } from "@zjedene-medusa/framework/utils"

// Default operations for all resources
export const defaultPolicyOperations = Object.keys(PolicyOperation).filter(
  (key) => key !== "ALL" && key !== WILDCARD
)
