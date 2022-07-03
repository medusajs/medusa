import path from "path"
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

            writeFeatureFlag(argv.name, argv.description, featureFlagPath)
          },
        })
        .command({
          command: "delete <name>",
          desc: "Delete a feature flag",
          builder: {
            name: {
              demand: true,
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

const writeFeatureFlag = (name, description, featureFlagPath) => {
  const snakeCaseName = snakeCase(name)

  const featureFlag = featureFlagTemplate({
    key: snakeCaseName,
    description: description,
    defaultValue: false,
    envKey: `MEDUSA_FF_${snakeCaseName.toUpperCase()}`,
  })

  fs.writeFileSync(featureFlagPath, featureFlag)
}
