import type { ModuleJoinerConfig } from "@medusajs/types"

const joinerConfigs = new Map<string, ModuleJoinerConfig>()

global.MedusaModule = {
  getLoadedModules: () => [],
  getAllJoinerConfigs: () => [...joinerConfigs.values()],
  setJoinerConfig: (moduleKey, config) => {
    joinerConfigs.set(moduleKey, config)
    return config
  },
}

export function clearMedusaModuleMock(): void {
  joinerConfigs.clear()
}
