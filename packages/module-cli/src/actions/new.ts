import { existsSync } from "fs"
import { resolve } from "path"
import boxen from "boxen"
import chalk from "chalk"
import { EOL } from "os"
import { mkdir } from "fs/promises"
import log from "../utils/logger.js"
import { generatePackageJson } from "../templates/package-json.js"
import { spinner } from "../index.js"
import { generateTsConfigs } from "../templates/ts-config.js"
import { generateJestConfig } from "../templates/jest-config.js"
import { generateMikroOrmConfigDev } from "../templates/mikro-orm-coinfig-dev.js"
import { generateGitIgnore } from "../templates/gitignore.js"
import { generateLoaders } from "../templates/loaders.js"
import { kebabToCamelCase } from "@medusajs/utils"
import { upperCaseFirst } from "@medusajs/utils/dist/common/upper-case-first.js"
import { generateInitialize } from "../templates/initialize.js"
import { generateModels } from "../templates/models.js"
import { generateRepositories } from "../templates/repositories.js"

export async function createNewModule(
  moduleName: string,
  { path }: { path: string }
): Promise<void> {
  log(`Creating new module ${moduleName}`)

  const modulePath = resolve(path, moduleName)
  log(`The module will be created in ${modulePath}`)

  if (existsSync(modulePath)) {
    log(`The directory ${moduleName} already exists`, "error")
    log(`Please try again with another name`, "error")
    return
  }

  const camelCasedModuleName = kebabToCamelCase(moduleName)
  const upperFirstCamelCasedModuleName = upperCaseFirst(camelCasedModuleName)

  spinner.succeed(`Created module directory ${moduleName}`)

  await generateFileStructure(
    moduleName,
    modulePath,
    upperFirstCamelCasedModuleName
  )

  log(
    boxen(
      chalk.green(
        `You can change to the module directory with ${chalk.bold.green(
          `cd ${moduleName}`
        )}.${EOL}${EOL}
        Please, look through the files that have been generated to validate that everything is correct.
        `
      ),
      {
        titleAlignment: "center",
        textAlignment: "center",
        padding: 1,
        margin: 1,
        float: "center",
      }
    )
  )
}

async function generateFileStructure(
  moduleName: string,
  modulePath: string,
  upperFirstCamelCasedModuleName: string
): Promise<void> {
  await mkdir(modulePath, { recursive: true })

  await generatePackageJson({ moduleName, modulePath })
  await generateTsConfigs({ modulePath })
  await generateJestConfig({ modulePath })
  await generateMikroOrmConfigDev({ modulePath })
  await generateGitIgnore({ modulePath })
  await generateLoaders({ modulePath, upperFirstCamelCasedModuleName })
  await generateInitialize({ modulePath, upperFirstCamelCasedModuleName })
  await generateModels({
    modulePath,
    moduleName,
    upperFirstCamelCasedModuleName,
  })
  await generateRepositories({
    modulePath,
    moduleName,
    upperFirstCamelCasedModuleName,
  })
}
