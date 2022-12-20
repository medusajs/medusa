import resolveCwd from "resolve-cwd"

import { ConfigModule, ModuleResolution } from "../../types/global"
import MODULE_DEFINITIONS from "./definitions"

export default ({ modules }: ConfigModule) => {
  const moduleResolutions = {} as Record<string, ModuleResolution>
  const projectModules = modules ?? {}

  for (const definition of MODULE_DEFINITIONS) {
    let resolutionPath = definition.defaultPackage

    const mod = projectModules[definition.key]

    if (typeof mod === "boolean") {
      if (!mod && definition.isRequired) {
        throw new Error(`Module: ${definition.label} is required`)
      }
      if (!mod) {
        moduleResolutions[definition.key] = {
          resolutionPath: undefined,
          definition,
          options: {},
        }
        continue
      }
    }

    // If user added a module and it's overridable, we resolve that instead
    if (
      definition.canOverride &&
      (typeof mod === "string" || (typeof mod === "object" && mod.resolve))
    ) {
      resolutionPath = resolveCwd(
        typeof mod === "string" ? mod : (mod.resolve as string)
      )
    }

    moduleResolutions[definition.key] = {
      resolutionPath,
      definition,
      options: typeof mod === "object" ? mod.options ?? {} : {},
    }
  }

  return moduleResolutions
}
