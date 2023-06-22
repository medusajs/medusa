import checkbox from "@inquirer/checkbox"
import confirm from "@inquirer/confirm"
import boxen from "boxen"
import chalk from "chalk"
import { EOL } from "os"
import { spinner } from "../index.js"
import { loadPackageJson } from "../utils/load-package.js"
import log from "../utils/logger.js"

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

  const medusaModules: Map<string, any> = new Map(
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

  return medusaModules
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
    log("Checking modules installed...")
  }

  let project
  try {
    project = loadPackageJson()
  } catch (err: any) {
    log(err.message, "error")
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
    spinner.succeed(`None Medusa modules was found.`)
    return
  }

  const selectedModules = await checkbox({
    message: "Select the Modules you want to run the DB migration",
    choices: [...medusaModules.keys()].map((name: any) => {
      return {
        value: name,
        checked: true,
      }
    }),
  })

  if (!selectedModules.length) {
    spinner.info(`There isn't any migration to run.`)
    return
  }

  const confirmMigration = await confirm({
    message: `Confirm the database migration of the module${
      selectedModules.length > 1 ? "s" : ""
    } below:${EOL}- ${selectedModules.join(EOL + "- ")}?`,
  })

  if (!confirmMigration) {
    spinner.warn(`Migrations cancelled!!!`)
    return
  }

  try {
    /*
    TODO: create function to load env variables and run the migrations in a forked process

    await Promise.all(
      selectedModules.map((mod) =>
        revert
          ? medusaModules.get(mod).revertMigration()
          : medusaModules.get(mod).runMigrations()
      )
    )
    */

    spinner.succeed(`Database migrations ran successfully.`)
  } catch (err) {
    spinner.fail(`Failed to migrate modules${EOL}${err}`)
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
