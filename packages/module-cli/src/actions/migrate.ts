import checkbox from "@inquirer/checkbox"
import confirm from "@inquirer/confirm"
import boxen from "boxen"
import chalk from "chalk"
import { fork } from "child_process"
import { unlinkSync, writeFileSync } from "fs"
import { EOL } from "os"
import { resolve } from "path"
import pluralize from "pluralize"
import { spinner } from "../index.js"
import { loadPackageJson } from "../utils/load-package.js"
import log from "../utils/logger.js"

const executeMigration = async (moduleName: string, revert: boolean) => {
  const migrationFunction = revert ? "revertMigration" : "runMigrations"
  const script = `
    (async function() {
        const {${migrationFunction}} = await import("${moduleName}")
        const { config } = await import("dotenv")

        config()
        await ${migrationFunction}()
    })()`

  const fileName = moduleName.replace(/\W/g, "-").toLowerCase()
  const newScriptPath = resolve(`./${fileName}.js`)
  writeFileSync(newScriptPath, script)

  return await new Promise((resolve, reject) => {
    try {
      const child = fork(newScriptPath)
      child.on("exit", (err, ok) => {
        unlinkSync(newScriptPath)
        if (err) {
          return reject(err)
        }
        resolve(undefined)
      })
    } catch (err) {
      unlinkSync(newScriptPath)
      reject(err)
    }
  })
}

async function getMedusaModules(
  dependencies: string[],
  revertMigration: boolean = false
): Promise<Map<string, any>> {
  const modules = await Promise.all(
    Object.keys(dependencies).map(
      (modName) =>
        import(modName)
          .then((loaded) => [modName, loaded])
          .catch((e) => [modName, e]) as Promise<[string, any | null]>
    )
  )

  return new Map(
    modules.filter((loaded: [string, any | null]) => {
      const [, mod] = loaded
      if (mod === null) {
        return false
      }

      const loadedModule = mod.default || mod
      return (
        !!loadedModule.initialize &&
        !!loadedModule.default?.service &&
        (revertMigration
          ? !!loadedModule.default?.revertMigration
          : !!loadedModule.default?.runMigrations)
      )
    })
  )
}

export async function migrateModules(
  modulePaths?: string[],
  {
    revert,
  }: {
    revert?: boolean
  } = {}
): Promise<void> {
  if (!modulePaths?.length) {
    log("Checking if the modules are installed...")
  }

  let project: Record<string, any> = {}

  try {
    project = loadPackageJson()
  } catch (err: any) {
    log(
      `Unable to load the package.json file from the project${EOL}${err.message}`,
      "error"
    )
    return
  }

  let specificModules = modulePaths?.length
    ? modulePaths.reduce((obj: any, mod) => {
        obj[mod] = ""
        return obj
      }, {})
    : undefined
  const medusaModules = await getMedusaModules(
    specificModules ? specificModules : project.dependencies,
    revert
  )

  if (!medusaModules.size) {
    spinner.succeed(`No module found to run the migration.`)
    return
  }

  const selectedModules = await checkbox({
    message: "Select the modules for which you want to run the migration",
    choices: [...medusaModules.keys()].map((name: any) => {
      return {
        value: name,
        checked: true,
      }
    }),
  })

  if (!selectedModules.length) {
    spinner.info(`No module selected. Skipping migration.`)
    return
  }

  const confirmMigration = await confirm({
    message: `Confirm the database migration of the ${pluralize(
      "module",
      selectedModules.length
    )} below:${EOL}- ${selectedModules.join(EOL + "- ")}?`,
  })

  if (!confirmMigration) {
    spinner.warn(`The migration has been cancelled!`)
    return
  }

  try {
    spinner.start(`Running database migrations...`)

    await Promise.all(
      selectedModules.map((mod) => executeMigration(mod, revert === true))
    )

    spinner.succeed(`Database migrations ran successfully.`)
  } catch (err) {
    spinner.fail(`Failed to migrate modules.`)
    return
  }

  log(
    boxen(chalk.green(`Database migrations are completed.`), {
      titleAlignment: "center",
      textAlignment: "center",
      padding: 1,
      margin: 1,
      float: "left",
    })
  )
}
