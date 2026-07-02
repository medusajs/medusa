import type { LoadedModule, ModuleJoinerConfig } from "@medusajs/types"

export interface MedusaModuleGlobal {
  getLoadedModules(
    aliases?: Map<string, string>
  ): { [key: string]: LoadedModule }[]
  getAllJoinerConfigs(): ModuleJoinerConfig[]
  setJoinerConfig(
    moduleKey: string,
    config: ModuleJoinerConfig
  ): ModuleJoinerConfig
}

declare global {
  // eslint-disable-next-line no-var
  var MedusaModule: MedusaModuleGlobal
}

export const MedusaModule: MedusaModuleGlobal = new Proxy(
  {} as MedusaModuleGlobal,
  {
    get(_target, prop) {
      const mod = global.MedusaModule

      if (!mod) {
        throw new Error(
          "MedusaModule is not available on global. Ensure @medusajs/modules-sdk is loaded."
        )
      }

      const value = mod[prop as keyof MedusaModuleGlobal]

      if (typeof value === "function") {
        return value.bind(mod)
      }

      return value
    },
  }
)
