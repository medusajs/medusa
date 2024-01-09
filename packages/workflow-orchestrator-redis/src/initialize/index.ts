import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import {
  IWorkflowOrchestratorModuleService,
  ModulesSdkTypes,
} from "@medusajs/types"
import { moduleDefinition } from "../module-definition"
import {
  InitializeModuleInjectableDependencies,
  RedisWorkflowOrchestratorOptions,
} from "../types"

export const initialize = async (
  options?:
    | (ModulesSdkTypes.ModuleServiceInitializeOptions & {
        redis: RedisWorkflowOrchestratorOptions
      })
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<IWorkflowOrchestratorModuleService> => {
  const loaded =
    await MedusaModule.bootstrap<IWorkflowOrchestratorModuleService>({
      moduleKey: Modules.WORKFLOW_ORCHESTRATOR,
      defaultPath: MODULE_PACKAGE_NAMES[Modules.WORKFLOW_ORCHESTRATOR],
      declaration: options as
        | InternalModuleDeclaration
        | ExternalModuleDeclaration,
      injectedDependencies,
      moduleExports: moduleDefinition,
    })

  return loaded[Modules.WORKFLOW_ORCHESTRATOR]
}
