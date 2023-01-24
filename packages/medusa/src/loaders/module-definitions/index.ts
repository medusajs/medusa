import resolveCwd from "resolve-cwd"

import { ConfigModule, ModuleResolution } from "../../types/global"
import MODULE_DEFINITIONS from "./definitions"

export default ({ modules }: ConfigModule) => {
  const moduleResolutions = {} as Record<string, ModuleResolution>
  const projectModules = modules ?? {}

  for (const definition of MODULE_DEFINITIONS) {
    let resolutionPath = definition.defaultPackage

    const moduleConfiguration = projectModules[definition.key]

    if (typeof moduleConfiguration === "boolean") {
      if (!moduleConfiguration && definition.isRequired) {
        throw new Error(`Module: ${definition.label} is required`)
      }
      if (!moduleConfiguration) {
        moduleResolutions[definition.key] = {
          resolutionPath: false,
          definition,
          options: {},
        }
        continue
      }
    }

    // If user added a module and it's overridable, we resolve that instead
    if (
      definition.canOverride &&
      (typeof moduleConfiguration === "string" ||
        (typeof moduleConfiguration === "object" &&
          moduleConfiguration.resolve))
    ) {
      resolutionPath = resolveCwd(
        typeof moduleConfiguration === "string"
          ? moduleConfiguration
          : (moduleConfiguration.resolve as string)
      )
    }

    const moduleDeclaration =
      typeof moduleConfiguration === "object" ? moduleConfiguration : {}

    moduleResolutions[definition.key] = {
      resolutionPath,
      definition,
      moduleDeclaration: {
        ...definition.defaultModuleDeclaration,
        ...moduleDeclaration,
      },
      options:
        typeof moduleConfiguration === "object"
          ? moduleConfiguration.options ?? {}
          : {},
    }
  }

  return moduleResolutions
}
