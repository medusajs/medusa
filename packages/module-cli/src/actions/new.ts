import boxen from "boxen"
import chalk from "chalk"
import { exec } from "child_process"
import { existsSync } from "fs"
import { mkdir } from "fs/promises"
import _ from "lodash"
import { EOL } from "os"
import { resolve } from "path"
import { createDatabase } from "pg-god"
import pluralize from "pluralize"
import { spinner } from "../index.js"
import { cloneTemplateDirectory } from "../utils/clone-template.js"
import log from "../utils/logger.js"

const pgGodCredentials = {
  user: "postgres",
  password: "",
  host: "localhost",
}

export async function createNewModule(
  moduleName: string,
  { path }: { path: string }
): Promise<void> {
  if (!moduleName.trim()) {
    spinner.fail(`Module name can't be empty.`)
    return
  }

  const moduleTemplateVars: Record<string, string> = {
    moduleName: moduleName,
    moduleNameCamelCase: _.camelCase(moduleName),
    moduleNamePascalCase: _.startCase(_.camelCase(moduleName)).replace(
      / /g,
      ""
    ),
    moduleNameSnakeCase: _.snakeCase(moduleName),
    moduleNameKebabCase: _.kebabCase(moduleName),
    moduleNameUpperCase: moduleName.toUpperCase(),
    moduleNameTitleCase: _.startCase(_.camelCase(moduleName)),
    moduleNameLowerCase: moduleName.toLowerCase().replace(/ /g, ""),
    moduleNameConstantCase: _.upperCase(moduleName).replace(/ /g, "_"),
    timestamp: Date.now() + "",
  }

  for (const key in moduleTemplateVars) {
    moduleTemplateVars[key.replace("moduleName", "moduleNamePlural")] =
      pluralize(moduleTemplateVars[key])
  }

  spinner.start(`Creating new module ${moduleName}`)

  const folderName = moduleTemplateVars.moduleNameKebabCase
  const modulePath = resolve(path, folderName)

  log(`The module will be created in ${modulePath}`)

  if (existsSync(modulePath)) {
    spinner.fail(`The directory ${folderName} already exists`)
    log(`Please try again with another name`, "error")
    return
  }

  try {
    await mkdir(modulePath)

    await cloneTemplateDirectory(
      "./src/templates/module_base",
      modulePath,
      moduleTemplateVars
    )
    spinner.succeed(`Created module directory ${folderName}`)
  } catch (err) {
    spinner.fail(`Failed to create module "${moduleName}"${EOL}${err}`)
  }

  try {
    spinner.start(`Creating database`)

    await createDatabase(
      {
        databaseName: `medusa-${moduleTemplateVars.moduleNamePluralLowerCase}`,
        errorIfExist: true,
      },
      pgGodCredentials
    )

    spinner.succeed(
      `Created database medusa-${moduleTemplateVars.moduleNamePluralLowerCase}`
    )
  } catch (err: any) {
    spinner.fail(`Failed to create database${EOL}${err.message}`)
  }

  try {
    spinner.start(`Installing dependencies`)
    await runYarnInstall(modulePath)
    spinner.succeed(`Installed dependencies`)
  } catch (err: any) {
    spinner.fail(`Failed to install dependencies${EOL}${err.message}`)
  }

  try {
    spinner.start(`Generating initial migration`)
    await generateMigrations(modulePath)
    spinner.succeed(`Generated initial migration`)
  } catch (err: any) {
    spinner.fail(`Failed to install dependencies${EOL}${err.message}`)
  }

  log(
    boxen(
      chalk.green(
        `You can change to the module directory with ${chalk.bold.green(
          `cd ${folderName}`
        )}.${EOL}${EOL}
        Please, look through the files that have been generated to validate that everything is correct.
        `
      ),
      {
        titleAlignment: "center",
        textAlignment: "center",
        padding: 1,
        margin: 1,
        float: "left",
      }
    )
  )
}

async function runYarnInstall(modulePath: string) {
  await new Promise(async (resolve, reject) => {
    const yarnProcess = exec("yarn install --cwd " + modulePath, (err) => {
      if (err) {
        return reject(err)
      }

      resolve(void 0)
    })

    yarnProcess.stdout!.on("data", (data) => spinner.info(data))
  })
}

async function generateMigrations(modulePath: string) {
  await new Promise(async (resolve, reject) => {
    const migrationProcess = exec(
      `yarn --cwd ${modulePath} run migration:initial`,
      (err) => {
        if (err) {
          return reject(err)
        }

        resolve(void 0)
      }
    )

    migrationProcess.stdout!.on("data", (data) => spinner.info(data))
  })
}
