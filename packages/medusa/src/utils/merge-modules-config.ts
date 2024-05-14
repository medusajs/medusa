import { ConfigModule } from "@medusajs/types"

/**
 * Merge the modules config from the medusa-config file with the modules config from medusa package
 * @param modules
 * @param medusaInternalModulesConfig
 */
export function mergeModulesConfig(
  modules: ConfigModule["modules"] = {},
  medusaInternalModulesConfig = {}
) {
  const modules_ = ({ ...modules } as ConfigModule["modules"])!

  const userModulesConfigKeys = Object.keys(modules)
  const internalModulesConfigKeys = Object.keys(medusaInternalModulesConfig)

  const allModulesKeys = new Set([
    ...userModulesConfigKeys,
    ...internalModulesConfigKeys,
  ])

  for (const moduleName of allModulesKeys) {
    const internalModuleConfig = medusaInternalModulesConfig[moduleName]

    modules_[moduleName] ??= internalModuleConfig
  }

  return modules_
}
