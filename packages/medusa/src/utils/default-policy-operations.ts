import { PolicyOperation } from "@medusajs/framework/utils"

// Default operations for all core resources.
export const defaultPolicyOperations = [
  PolicyOperation.read,
  PolicyOperation.create,
  PolicyOperation.update,
  PolicyOperation.delete,
]
