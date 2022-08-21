import path from "path"
import glob from "glob"
import fs from "fs"
import Configstore from "configstore"
import { kebabCase, snakeCase } from "lodash"
import { featureFlagTemplate } from "./template"
import pkg from "../../package.json"

export const buildFFCli = (cli) => {
  cli.command({
    command: `ff`,
    desc: "Manage Medusa feature flags",
    builder: (yargs) => {
      yargs
        .command({
          command: "create <name>",
          desc: "Create a new feature flag",
          builder: {
            name: {
              demandOption: true,
              coerce: (name) => kebabCase(name),
              description: "Name of the feature flag",
              type: "string",
            },
            description: {
              alias: "d",
              demandOption: true,
              description: "Description of the feature flag",
              type: "string",
            },
          },
          handler: async (argv) => {
            const medusaLocation = getRepoRoot()
            const featureFlagPath = buildPath(argv.name, medusaLocation)

            if (fs.existsSync(featureFlagPath)) {
              console.error(`Feature flag already exists: ${featureFlagPath}`)
              return
            }

            const flagSettings = collectSettings(argv.name, argv.description)
            writeFeatureFlag(flagSettings, featureFlagPath)
          },
        })
        .command({
          command: "list",
          desc: "List available feature flags",
          handler: async () => {
            const medusaLocation = getRepoRoot()
            const flagGlob = buildFlagsGlob(medusaLocation)

            const featureFlags = glob.sync(flagGlob, {
              ignore: ["**/index.*"],
            })
            const flagData = featureFlags.map((flag) => {
              const flagSettings = readFeatureFlag(flag)
              return {
                ...flagSettings,
                file_name: path.basename(flag, ".js"),
              }
            })

            console.table(flagData)
          },
        })
        .command({
          command: "delete <name>",
          desc: "Delete a feature flag",
          builder: {
            name: {
              demand: true,
              coerce: (name) => kebabCase(name),
              description: "Name of the feature flag",
              type: "string",
            },
          },
          handler: async (argv) => {
            const medusaLocation = getRepoRoot()
            const featureFlagPath = buildPath(argv.name, medusaLocation)

            if (fs.existsSync(featureFlagPath)) {
              fs.unlinkSync(featureFlagPath)
            }

            console.log(`Feature flag deleted: ${featureFlagPath}`)
          },
        })
        .demandCommand(1, "Please specify an action")
    },
  })
}

const getRepoRoot = () => {
  const conf = new Configstore(pkg.name)
  const medusaLocation = conf.get(`medusa-location`)

  if (!medusaLocation) {
    console.error(
      `
You haven't set the path yet to your cloned
version of medusa. Do so now by running:
medusa-dev --set-path-to-repo /path/to/my/cloned/version/medusa
`
    )
    process.exit()
  }

  return medusaLocation
}

const readFeatureFlag = (flagPath) => {
  const flagSettings = require(flagPath).default
  return flagSettings
}

const buildFlagsGlob = (repoRoot) => {
  return path.join(
    repoRoot,
    "packages",
    "medusa",
    "dist",
    "loaders",
    "feature-flags",
    `*.js`
  )
}

const buildPath = (kebabCaseName, repoRoot) => {
  return path.join(
    repoRoot,
    "packages",
    "medusa",
    "src",
    "loaders",
    "feature-flags",
    `${kebabCaseName}.ts`
  )
}

const collectSettings = (name, description) => {
  const snakeCaseName = snakeCase(name)
  return {
    key: snakeCaseName,
    description: description,
    defaultValue: false,
    envKey: `MEDUSA_FF_${snakeCaseName.toUpperCase()}`,
  }
}

const writeFeatureFlag = (settings, featureFlagPath) => {
  const featureFlag = featureFlagTemplate(settings)
  fs.writeFileSync(featureFlagPath, featureFlag)
  logFeatureFlagUsage(featureFlagPath, settings)
}

const logFeatureFlagUsage = (flagPath, flagSettings) => {
  console.log(`Feature flag created: ${flagPath}`)
  console.log(`
To use this feature flag, add the following to your medusa-config.js:
  
  {
    ...,
    featureFlags: {
      ${flagSettings.key}: true
    }
  }

or set the environment variable:

  export ${flagSettings.envKey}=true

To add guarded code use the featureFlagRouter:

  if (featureFlagRouter.isEnabled("${flagSettings.key}")) {
    // do something
  }
  `)
}
