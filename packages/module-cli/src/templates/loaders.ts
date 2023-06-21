import log from "../utils/logger.js"
import { resolve } from "path"
import { mkdir, writeFile } from "fs/promises"
import { spinner } from "../index.js"
import dedent from "dedent"
import { existsSync } from "fs"
import { lowerCaseFirst } from "@medusajs/utils"

const indexFileName = "index.ts"
const connectionFileName = "connection.ts"
const containerFileName = "container.ts"

export async function generateLoaders({
  modulePath,
  upperFirstCamelCasedModuleName,
}: {
  modulePath: string
  upperFirstCamelCasedModuleName: string
}): Promise<void> {
  const outputPath = resolve(modulePath, "src/loaders")
  if (!existsSync(outputPath)) {
    await mkdir(outputPath, { recursive: true })
  }

  await generateIndex({ modulePath: outputPath })
  await generateConnectionLoader({
    modulePath: outputPath,
    upperFirstCamelCasedModuleName,
  })
  await generateContainerLoader({
    modulePath: outputPath,
    upperFirstCamelCasedModuleName,
  })
}

async function generateIndex({ modulePath }: { modulePath: string }) {
  log(`Generating src/loaders/${indexFileName}`)

  const template = dedent`
  export * from "./connection"
  export * from "./container"
  `

  try {
    const path = resolve(modulePath, indexFileName)
    await writeFile(path, template)
    spinner.succeed(`src/loaders/${indexFileName} generated`)
  } catch (error) {
    log(`Failed to generate src/loaders/${indexFileName}`, "error")
    throw error
  }
}

async function generateConnectionLoader({
  modulePath,
  upperFirstCamelCasedModuleName,
}: {
  modulePath: string
  upperFirstCamelCasedModuleName: string
}) {
  log(`Generating src/loaders/${connectionFileName}`)

  const template = dedent`
  import { asValue } from "awilix"
  import {
    InternalModuleDeclaration,
    LoaderOptions,
    MODULE_RESOURCE_TYPE,
    MODULE_SCOPE,
  } from "@medusajs/modules-sdk"
  import { MedusaError } from "@medusajs/utils"
  import { EntitySchema } from "@mikro-orm/core"
  import * as ${upperFirstCamelCasedModuleName}Models from "@models"
  
  
  import {
    ${upperFirstCamelCasedModuleName}ServiceInitializeCustomDataLayerOptions,
    ${upperFirstCamelCasedModuleName}ServiceInitializeOptions,
  } from "../types"
  import { createConnection, loadDatabaseConfig } from "../utils"
  
  export default async (
    {
      options,
      container,
    }: LoaderOptions<
      | ${upperFirstCamelCasedModuleName}ServiceInitializeOptions
      | ${upperFirstCamelCasedModuleName}ServiceInitializeCustomDataLayerOptions
    >,
    moduleDeclaration?: InternalModuleDeclaration
  ): Promise<void> => {
    if (
      moduleDeclaration?.scope === MODULE_SCOPE.INTERNAL &&
      moduleDeclaration.resources === MODULE_RESOURCE_TYPE.SHARED
    ) {
      return
    }
  
    const customManager = (
      options as ${upperFirstCamelCasedModuleName}ServiceInitializeCustomDataLayerOptions
    )?.manager
  
    if (!customManager) {
      const dbData = loadDatabaseConfig(options)
      await loadDefault({ database: dbData, container })
    } else {
      container.register({
        manager: asValue(customManager),
      })
    }
  }
  
  async function loadDefault({ database, container }) {
    if (!database) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        \`Database config is not present at module config "options.database"\`
      )
    }
  
    const entities = Object.values(${upperFirstCamelCasedModuleName}Models) as unknown as EntitySchema[]
  
    const orm = await createConnection(database, entities)
  
    container.register({
      manager: asValue(orm.em.fork()),
    })
  }
  `

  try {
    const path = resolve(modulePath, connectionFileName)
    await writeFile(path, template)
    spinner.succeed(`src/loaders/${connectionFileName} generated`)
  } catch (error) {
    log(`Failed to generate src/loaders/${connectionFileName}`, "error")
    throw error
  }
}

async function generateContainerLoader({
  modulePath,
  upperFirstCamelCasedModuleName,
}: {
  modulePath: string
  upperFirstCamelCasedModuleName: string
}) {
  log(`Generating src/loaders/${containerFileName}`)

  const template = dedent`
  import { LoaderOptions } from "@medusajs/modules-sdk"

  import { asClass } from "awilix"
  import {
    ${upperFirstCamelCasedModuleName}ModuleService,
  } from "@services"
  import * as DefaultRepositories from "@repositories"
  import {
    ${upperFirstCamelCasedModuleName}Repository,
  } from "@repositories"
  import {
    ${upperFirstCamelCasedModuleName}ServiceInitializeCustomDataLayerOptions,
    ${upperFirstCamelCasedModuleName}ServiceInitializeOptions,
  } from "../types"
  import { Constructor, DAL } from "@medusajs/types"
  import { lowerCaseFirst } from "@medusajs/utils"
  
  export default async ({
    container,
    options,
  }: LoaderOptions<
    | ${upperFirstCamelCasedModuleName}ServiceInitializeOptions
    | ${upperFirstCamelCasedModuleName}ServiceInitializeCustomDataLayerOptions
  >): Promise<void> => {
    const customRepositories = (
      options as ${upperFirstCamelCasedModuleName}ServiceInitializeCustomDataLayerOptions
    )?.repositories
  
    container.register({
      ${lowerCaseFirst(
        upperFirstCamelCasedModuleName
      )}ModuleService: asClass(${upperFirstCamelCasedModuleName}ModuleService).singleton(),
    })
  
    if (customRepositories) {
      await loadCustomRepositories({ customRepositories, container })
    } else {
      await loadDefaultRepositories({ container })
    }
  }
  
  function loadDefaultRepositories({ container }) {
    container.register({
      ${lowerCaseFirst(
        upperFirstCamelCasedModuleName
      )}Repository: asClass(${upperFirstCamelCasedModuleName}Repository).singleton(),
    })
  }
  
  /**
   * Load the repositories from the custom repositories object. If a repository is not
   * present in the custom repositories object, the default repository will be used.
   *
   * @param customRepositories
   * @param container
   */
  function loadCustomRepositories({ customRepositories, container }) {
    const customRepositoriesMap = new Map(Object.entries(customRepositories))
  
    Object.entries(DefaultRepositories).forEach(([key, DefaultRepository]) => {
      let finalRepository = customRepositoriesMap.get(key)
  
      if (
        !finalRepository ||
        !(finalRepository as Constructor<DAL.RepositoryService>).prototype.find
      ) {
        finalRepository = DefaultRepository
      }
  
      container.register({
        [lowerCaseFirst(key)]: asClass(
          finalRepository as Constructor<DAL.RepositoryService>
        ).singleton(),
      })
    })
  }
  `

  try {
    const path = resolve(modulePath, containerFileName)
    await writeFile(path, template)
    spinner.succeed(`src/loaders/${containerFileName} generated`)
  } catch (error) {
    log(`Failed to generate src/loaders/${containerFileName}`, "error")
    throw error
  }
}
