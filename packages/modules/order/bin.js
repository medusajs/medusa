const path = require("path")
const { ConfigurationLoader } = require("@mikro-orm/core")

ConfigurationLoader.registerTsNode = async function (
  configPath = "tsconfig.json"
) {
  console.log("here too>>>")
  const tsConfigPath = (0, path.isAbsolute)(configPath)
    ? configPath
    : (0, path.join)(process.cwd(), configPath)

  const tsNode = require("ts-node")
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

const cli = require("@mikro-orm/cli")
;(async () => {
  console.log(cli)
  const argv = await cli.CLIConfigurator.configure()
  const args = await argv.parse(process.argv.slice(2))
  if (args._.length === 0) {
    cli.CLIHelper.showHelp()
  }
})()
