import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { ModulesSdkTypes } from "@medusajs/types"
import { WorkflowOrchestratorTypes } from "@medusajs/workflows-sdk"
import { moduleDefinition } from "../module-definition"
import { InitializeModuleInjectableDependencies } from "../types"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<WorkflowOrchestratorTypes.IWorkflowsModuleService> => {
  const loaded =
    // eslint-disable-next-line max-len
    await MedusaModule.bootstrap<WorkflowOrchestratorTypes.IWorkflowsModuleService>(
      {
        moduleKey: Modules.WORKFLOW_ENGINE,
        defaultPath: MODULE_PACKAGE_NAMES[Modules.WORKFLOW_ENGINE],
        declaration: options as
          | InternalModuleDeclaration
          | ExternalModuleDeclaration,
        injectedDependencies,
        moduleExports: moduleDefinition,
      }
    )

  return loaded[Modules.WORKFLOW_ENGINE]
}
