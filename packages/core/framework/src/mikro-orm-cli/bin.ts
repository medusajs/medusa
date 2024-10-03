/**
 * Custom wrapper on top of MikroORM CLI to override the issue
 * they have when importing TypeScript files.
 *
 * They have hardcoded the module system of TypeScript to CommonJS
 * and that makes it impossible to use any other module system
 * like Node16 or NodeNext and so on.
 *
 * With this wrapper, we monkey patch the code responsible for register
 * ts-node and then boot their CLI. Since, the code footprint is
 * small, we should be okay with managing this wrapper.
 */

import { isAbsolute, join } from "path"
import { ConfigurationLoader } from "@mikro-orm/core"
import { CLIConfigurator, CLIHelper } from "@mikro-orm/cli"

/**
 * Monkey patching the TSNode registration of Mikro ORM to not use
 * hardcoded module system with TypeScript.
 */
ConfigurationLoader.registerTsNode = async function (
  configPath = "tsconfig.json"
) {
  const tsConfigPath = isAbsolute(configPath)
    ? configPath
    : join(process.cwd(), configPath)

  const tsNode = require(require.resolve("ts-node", { paths: [tsConfigPath] }))
  if (!tsNode) {
    return false
  }

  const { options } = tsNode.register({
    project: tsConfigPath,
    transpileOnly: true,
  }).config

  if (Object.entries(options?.paths ?? {}).length > 0) {
    require("tsconfig-paths").register({
      baseUrl: options.baseUrl ?? ".",
      paths: options.paths,
    })
  }

  return true
}

require("@jercle/yargonaut")
  .style("blue")
  .style("yellow", "required")
  .helpStyle("green")
  .errorsStyle("red")
;(async () => {
  const argv = await CLIConfigurator.configure()
  const args = await argv.parse(process.argv.slice(2))
  if (args._.length === 0) {
    CLIHelper.showHelp()
  }
})()
