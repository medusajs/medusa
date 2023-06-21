import log from "../utils/logger.js"
import { existsSync } from "fs"
import { resolve } from "path"
import { generatePackageJson } from "../templates/package-json.js"
import { mkdir } from "fs/promises"
import { spinner } from "../index.js"
import { generateTsConfig } from "../templates/ts-config.js"
import { generateJestConfig } from "../templates/jest-config.js"
import { generateMikroOrmConfigDev } from "../templates/mikro-orm-coinfig-dev.js"

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

  spinner.succeed(`Created module directory ${moduleName}`)

  await generateFileStructure(moduleName, modulePath)
}

async function generateFileStructure(
  moduleName: string,
  modulePath: string
): Promise<void> {
  await mkdir(modulePath, { recursive: true })

  await generatePackageJson({ moduleName, modulePath })
  await generateTsConfig({ modulePath })
  await generateJestConfig({ modulePath })
  await generateMikroOrmConfigDev({ modulePath })
}
