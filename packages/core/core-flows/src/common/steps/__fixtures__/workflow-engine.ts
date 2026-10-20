import { asValue } from "@medusajs/framework/awilix"
import type { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createEngine } from "@medusajs/workflow-engine"

/**
 * Registers an in-memory workflow engine module on the container and the
 * given workflows on it, as the loaders do in an app.
 */
export async function registerWorkflowEngine(
  container: MedusaContainer,
  ...workflows: object[]
) {
  // Loaded at runtime: a declared dependency would make a cycle, since the
  // module depends on test-utils, which depends on core-flows.
  const { WorkflowsModuleService } = require("@medusajs/workflows")
  const service = new WorkflowsModuleService({
    workflowEngine: createEngine(),
    sharedContainer: container,
    logger: { error: () => {}, warn: () => {} },
  })
  await service.registerWorkflows(workflows)
  container.register(Modules.WORKFLOW_ENGINE, asValue(service))
  return service
}
