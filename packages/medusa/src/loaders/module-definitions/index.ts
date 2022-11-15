import glob from "glob"
import path from "path"
import resolveCwd from "resolve-cwd"

import { ModuleDefinition, ModuleResolution } from "../../types/global"

export default ({ modules }: { modules: Record<string, string> }) => {
  const moduleResolutions = {} as Record<string, ModuleResolution>
  const projectModules = modules ?? {}

  const definitionsDir = path.join(__dirname, "*.{j,t}s")
  const definitions = glob.sync(definitionsDir, {
    ignore: ["**/index.js", "**/index.ts", "**/*.d.ts"],
  })

  for (const def of definitions) {
    const definition: ModuleDefinition = require(def).default

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
