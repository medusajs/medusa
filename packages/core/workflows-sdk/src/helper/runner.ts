import { asValue } from "@medusajs/deps/awilix"
import { MedusaModule } from "@medusajs/modules-sdk"
import type {
  IWorkflowEngineService,
  LoadedModule,
  MedusaContainer,
  WorkflowConfigOptions,
} from "@medusajs/types"
import { createMedusaContainer, Modules } from "@medusajs/utils"
import type {
  FlowCancelOptions,
  FlowRegisterStepFailureOptions,
  FlowRegisterStepSuccessOptions,
  FlowRetryStepOptions,
  FlowRunOptions,
} from "./type"

type ContainerInput = LoadedModule[] | MedusaContainer | undefined

/**
 * Turns what a caller passed as the container into one. Without one, the
 * modules loaded in this process are used.
 */
export function toContainer(input?: ContainerInput): MedusaContainer {
  if (input && !Array.isArray(input)) {
    return "cradle" in input
      ? input
      : createMedusaContainer(input as Record<string, unknown>)
  }

  const modules =
    Array.isArray(input) && input.length
      ? input
      : MedusaModule.getLoadedModules().map(
          (mod) => Object.values(mod)[0] as LoadedModule
        )

  const container = createMedusaContainer()
  for (const mod of modules) {
    const key = mod?.__definition?.key
    if (key) {
      container.register(key, asValue(mod))
    }
  }
  return container
}

export function resolveWorkflowEngine(
  container: MedusaContainer,
  workflowId: string
): IWorkflowEngineService {
  const engine = container.resolve<IWorkflowEngineService>(
    Modules.WORKFLOW_ENGINE,
    { allowUnregistered: true }
  )
  if (!engine) {
    throw new Error(
      `Cannot run workflow "${workflowId}": the workflow engine module ("${Modules.WORKFLOW_ENGINE}") is not registered in the container`
    )
  }
  return engine
}

/**
 * The direct-call API. Every method forwards to the workflow engine module,
 * so running a workflow directly behaves exactly like running it through the
 * module.
 */
export function createWorkflowRunner(
  workflow: { getName(): string },
  boundContainer?: ContainerInput
) {
  const workflowId = workflow.getName()
  let workflowOptions: WorkflowConfigOptions | undefined

  const engineFor = (container?: ContainerInput) => {
    const resolved = toContainer(container ?? boundContainer)
    const engine = resolveWorkflowEngine(resolved, workflowId)
    return { container: resolved, engine }
  }

  return {
    get container() {
      return toContainer(boundContainer)
    },

    config(options: WorkflowConfigOptions) {
      workflowOptions = { ...(workflowOptions ?? {}), ...options }
    },

    async run(args: FlowRunOptions = {}) {
      const { container: argsContainer, ...options } = args
      const { container, engine } = engineFor(argsContainer)
      return engine.run(workflow, {
        ...options,
        container,
        ...(workflowOptions ? { workflowOptions } : {}),
      })
    },

    async registerStepSuccess(
      args: FlowRegisterStepSuccessOptions = { idempotencyKey: "" }
    ) {
      const {
        idempotencyKey,
        response,
        container: argsContainer,
        ...options
      } = args
      const { container, engine } = engineFor(argsContainer)
      return engine.setStepSuccess({
        idempotencyKey,
        stepResponse: response,
        options: { ...options, container },
      })
    },

    async registerStepFailure(
      args: FlowRegisterStepFailureOptions = { idempotencyKey: "" }
    ) {
      const {
        idempotencyKey,
        response,
        container: argsContainer,
        ...options
      } = args
      const { container, engine } = engineFor(argsContainer)
      return engine.setStepFailure({
        idempotencyKey,
        stepResponse: response,
        options: { ...options, container },
      })
    },

    async retryStep(args: FlowRetryStepOptions = { idempotencyKey: "" }) {
      const { idempotencyKey, container: argsContainer, ...options } = args
      const { container, engine } = engineFor(argsContainer)
      return engine.retryStep({
        idempotencyKey,
        options: { ...options, container },
      })
    },

    async cancel(args: FlowCancelOptions = {}) {
      const { container: argsContainer, ...options } = args
      const { container, engine } = engineFor(argsContainer)
      return engine.cancel(workflow, { ...options, container })
    },
  }
}
