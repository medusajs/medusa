import resolveCwd from "resolve-cwd"

import { ConfigModule, ModuleResolution } from "../../types/global"
import MODULE_DEFINITIONS from "./definitions"

export default ({ modules }: ConfigModule) => {
  const moduleResolutions = {} as Record<string, ModuleResolution>
  const projectModules = modules ?? {}

  for (const definition of MODULE_DEFINITIONS) {
    let resolutionPath = definition.defaultPackage

    const module = projectModules[definition.key]

    if (typeof module === "boolean") {
      if (!module && definition.isRequired) {
        throw new Error(`Module: ${definition.label} is required`)
      }
      if (!module) {
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
      (typeof module === "string" ||
        (typeof module === "object" && module.resolve))
    ) {
      resolutionPath = resolveCwd(
        typeof module === "string" ? module : (module.resolve as string)
      )
    }

    moduleResolutions[definition.key] = {
      resolutionPath,
      definition,
      options: typeof module === "object" ? module.options ?? {} : {},
    }
  }

  return moduleResolutions
}
