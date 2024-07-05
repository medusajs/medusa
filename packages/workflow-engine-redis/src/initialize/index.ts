import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MODULE_PACKAGE_NAMES,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"

import { ModulesSdkTypes } from "@medusajs/types"
import { IWorkflowEngineService } from "@medusajs/workflows-sdk"
import { moduleDefinition } from "../module-definition"
import { InitializeModuleInjectableDependencies } from "../types"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<IWorkflowEngineService> => {
  const loaded =
    // eslint-disable-next-line max-len
    await MedusaModule.bootstrap<IWorkflowEngineService>({
      moduleKey: Modules.WORKFLOW_ENGINE,
      defaultPath: MODULE_PACKAGE_NAMES[Modules.WORKFLOW_ENGINE],
      declaration: options as
        | InternalModuleDeclaration
        | ExternalModuleDeclaration,
      injectedDependencies,
      moduleExports: moduleDefinition,
    })

  return loaded[Modules.WORKFLOW_ENGINE]
}
