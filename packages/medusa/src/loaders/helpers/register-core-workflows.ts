import {
  collectWorkflows,
  registerWorkflows,
} from "@medusajs/framework/workflows"
import { MedusaContainer } from "@medusajs/framework/types"

/**
 * Registers every workflow core-flows exports, so it can be run.
 */
export async function registerCoreWorkflows(container: MedusaContainer) {
  const coreFlows = await import("@medusajs/core-flows")
  await registerWorkflows(container, collectWorkflows(coreFlows))
}
