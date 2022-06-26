import path from "path"
import glob from "glob"

export type FlagSettings = {
  key: string
  description: string
  env_key: string
  default_val: boolean
}

const isTruthy = (val: string | boolean | undefined): boolean => {
  if (typeof val === "string") {
    return val.toLowerCase() === "true"
  }
  return !!val
}

export type FlagRouter = {
  flags: Record<string, boolean>
  featureIsEnabled: (key: string) => boolean
}

export default (
  configModule: { featureFlags: Record<string, string | boolean> },
  flagDirectory?: string
): FlagRouter => {
  let { featureFlags: projectConfigFlags } = configModule
  projectConfigFlags = projectConfigFlags || {}

  const flagDir = path.join(flagDirectory || __dirname, "*.ts")
  const supportedFlags = glob.sync(flagDir, {
    ignore: ["**/index.ts"],
  })

  const flagConfig: Record<string, boolean> = {}
  for (const flag of supportedFlags) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const flagSettings = require(flag).default as FlagSettings

    switch (true) {
      case typeof process.env[flagSettings.env_key] !== "undefined":
        flagConfig[flagSettings.key] = isTruthy(
          process.env[flagSettings.env_key]
        )
        break
      case typeof projectConfigFlags[flagSettings.key] !== "undefined":
        flagConfig[flagSettings.key] = isTruthy(
          projectConfigFlags[flagSettings.key]
        )
        break
      default:
        flagConfig[flagSettings.key] = flagSettings.default_val
    }
  }

  return {
    flags: flagConfig,
    featureIsEnabled: function (key: string): boolean {
      return this.flags[key]
    },
  }
}
