import { IWorkflowEngineService, MedusaContainer } from "@medusajs/types"
import { isFileSkipped, Modules } from "@medusajs/utils"
import { isWorkflow } from "@medusajs/workflows-sdk"
import { logger } from "../logger"
import { ResourceLoader } from "../utils/resource-loader"

/**
 * The workflows among a module's exports.
 */
export function collectWorkflows(exports: Record<string, unknown>): unknown[] {
  return [...new Set(Object.values(exports ?? {}).filter(isWorkflow))]
}

/**
 * Makes workflows runnable. Only workflows registered here can be run.
 */
export async function registerWorkflows(
  container: MedusaContainer,
  workflows: unknown[]
) {
  if (!workflows.length) {
    return
  }
  const workflowEngine = container.resolve<IWorkflowEngineService>(
    Modules.WORKFLOW_ENGINE,
    { allowUnregistered: true }
  )
  if (!workflowEngine?.registerWorkflows) {
    logger.warn(
      `The workflow engine module is not registered; ${workflows.length} workflows were not registered.`
    )
    return
  }
  await workflowEngine.registerWorkflows(workflows)
}

export class WorkflowLoader extends ResourceLoader {
  protected resourceName = "workflow"
  #workflows: unknown[] = []

  constructor(sourceDir: string | string[], container: MedusaContainer) {
    super(sourceDir, container)
  }

  protected async onFileLoaded(
    path: string,
    fileExports: Record<string, unknown>
  ) {
    // A skipped file (for example behind a disabled feature flag) is imported
    // but its workflows are not registered.
    if (isFileSkipped(fileExports)) {
      return
    }

    logger.debug(`Registering workflows from ${path}.`)
    this.#workflows.push(...collectWorkflows(fileExports))
  }

  /**
   * Imports the workflow files, which also attaches hook handlers, then
   * registers every workflow they export in one call.
   */
  async load() {
    // Unlike other loaders, also pick up workflows defined in an
    // `index.[js,ts]` file (e.g. `src/workflows/<name>/index.ts`).
    await super.discoverResources({ allowIndex: true })

    await registerWorkflows(this.container, this.#workflows)
    this.#workflows = []

    this.logger.debug(`Workflows registered.`)
  }
}
