import { asValue } from "@medusajs/framework/awilix"
import type { MedusaContainer } from "@medusajs/framework/types"
import { createMedusaContainer, Modules } from "@medusajs/framework/utils"
import {
  brandWorkflow,
  createWorkflow as sdkCreateWorkflow,
  getWorkflowDefinition,
} from "@medusajs/framework/workflows-sdk"
import { createEngine } from "@medusajs/workflow-engine"
import { WorkflowsModuleService } from "../../services"

type Harness = {
  container: MedusaContainer
  service: WorkflowsModuleService
}

let current: Harness | undefined

export function createTestHarness(): Harness {
  const container = createMedusaContainer()
  const service = new WorkflowsModuleService({
    workflowEngine: createEngine(),
    sharedContainer: container,
    logger: { error: () => {}, warn: () => {} } as any,
  })
  container.register(Modules.WORKFLOW_ENGINE, asValue(service))
  return { container, service }
}

/**
 * Gives each test a fresh module instance. Workflows created with the
 * `createWorkflow` below are registered on it.
 */
export function useTestEngine() {
  beforeEach(() => {
    current = createTestHarness()
  })

  afterEach(async () => {
    await current?.service.engine.shutdown()
    current = undefined
  })

  return {
    get container() {
      return harness().container
    },
    get service() {
      return harness().service
    },
  }
}

function harness(): Harness {
  if (!current) {
    throw new Error("useTestEngine() must be called in the test file")
  }
  return current
}

function withEngine(container?: any) {
  const { container: defaultContainer, service } = harness()
  const target = container ?? defaultContainer
  if (target?.register && !target.hasRegistration?.(Modules.WORKFLOW_ENGINE)) {
    target.register(Modules.WORKFLOW_ENGINE, asValue(service))
  }
  return target
}

/**
 * `createWorkflow` that registers the workflow on the test's module instance,
 * as the loaders do in an app, and runs it there when no container is given.
 */
export const createWorkflow: typeof sdkCreateWorkflow = ((
  nameOrConfig: any,
  composer: any
) => {
  const workflow: any = sdkCreateWorkflow(nameOrConfig, composer)
  const definition = getWorkflowDefinition(workflow)
  harness().service.engine.register(definition)

  const wrapped: any = (container?: any) => workflow(withEngine(container))
  wrapped.getName = workflow.getName
  wrapped.hooks = workflow.hooks
  wrapped.runAsStep = workflow.runAsStep
  wrapped.run = (args: any = {}) =>
    workflow.run({ ...args, container: withEngine(args.container) })
  brandWorkflow(wrapped, definition)
  return wrapped
}) as any
