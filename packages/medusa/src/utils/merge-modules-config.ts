import {
  ConfigModule,
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
} from "@medusajs/types"

import { ModulesDefinition } from "@medusajs/modules-sdk"
import { isObject } from "./is-object"

/**
 * Merge the modules config from the medusa-config file with the modules config from medusa package
 * @param modules
 * @param medusaInternalModulesConfig
 */
export function mergeModulesConfig(
  modules: ConfigModule["modules"],
  medusaInternalModulesConfig
) {
  for (const [moduleName, moduleConfig] of Object.entries(modules as any)) {
    const moduleDefinition = ModulesDefinition[moduleName]

    if (moduleDefinition?.isLegacy) {
      continue
    }

    const isModuleEnabled = moduleConfig === true || isObject(moduleConfig)

    if (!isModuleEnabled) {
      delete medusaInternalModulesConfig[moduleName]
    } else {
      medusaInternalModulesConfig[moduleName] = moduleConfig as Partial<
        InternalModuleDeclaration | ExternalModuleDeclaration
      >
    }
  }
}
