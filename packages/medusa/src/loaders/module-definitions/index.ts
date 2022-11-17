import resolveCwd from "resolve-cwd"

import { ConfigModule, ModuleResolution } from "../../types/global"
import MODULE_DEFINITIONS from "./definitions"

export default ({ modules }: ConfigModule) => {
  const moduleResolutions = {} as Record<string, ModuleResolution>
  const projectModules = modules ?? {}

  for (const definition of MODULE_DEFINITIONS) {
    let resolutionPath = definition.defaultPackage

    // If user added a module and it's overridable, we resolve that instead
    if (definition.canOverride && definition.key in projectModules) {
      const mod = projectModules[definition.key]
      resolutionPath = resolveCwd(mod)
    }

    moduleResolutions[definition.key] = {
      resolutionPath,
      definition,
    }
  }

  return moduleResolutions
}
