import log from "../utils/logger.js"
import { resolve } from "path"
import { mkdir, writeFile } from "fs/promises"
import { spinner } from "../index.js"
import dedent from "dedent"
import { existsSync } from "fs"

const indexFileName = "index.ts"

export async function generateRepositories({
  modulePath,
  moduleName,
  upperFirstCamelCasedModuleName,
}: {
  modulePath: string
  moduleName: string
  upperFirstCamelCasedModuleName: string
}): Promise<void> {
  const outputPath = resolve(modulePath, "src/repositories")
  if (!existsSync(outputPath)) {
    await mkdir(outputPath, { recursive: true })
  }

  await generateIndex({ modulePath: outputPath, moduleName })
  await generateRepository({
    modulePath: outputPath,
    moduleName,
    upperFirstCamelCasedModuleName,
  })
}

async function generateIndex({
  modulePath,
  moduleName,
}: {
  modulePath: string
  moduleName: string
}) {
  log(`Generating src/repositories/${indexFileName}`)

  const template = dedent`
  export * from "./${moduleName}"
  `

  try {
    const path = resolve(modulePath, indexFileName)
    await writeFile(path, template)
    spinner.succeed(`src/repositories/${indexFileName} generated`)
  } catch (error) {
    log(`Failed to generate src/repositories/${indexFileName}`, "error")
    throw error
  }
}

async function generateRepository({
  modulePath,
  moduleName,
  upperFirstCamelCasedModuleName,
}: {
  modulePath: string
  moduleName: string
  upperFirstCamelCasedModuleName: string
}) {
  const repositoryFileName = `${moduleName}.ts`
  log(`Generating src/repositories/${repositoryFileName}.ts`)

  const template = dedent`
  import { SqlEntityManager } from "@mikro-orm/postgresql"
  import { ${upperFirstCamelCasedModuleName} } from "@models"
  import {
    FilterQuery as MikroFilterQuery,
    FindOptions as MikroOptions,
    LoadStrategy,
  } from "@mikro-orm/core"
  import { deduplicateIfNecessary } from "../utils"
  import { DAL } from "@medusajs/types"
  
  export class ${upperFirstCamelCasedModuleName}Repository implements DAL.RepositoryService<${upperFirstCamelCasedModuleName}> {
    protected readonly manager_: SqlEntityManager
    constructor({ manager }) {
      this.manager_ = manager.fork()
    }
  
    async find(
      findOptions: DAL.FindOptions<${upperFirstCamelCasedModuleName}> = { where: {} },
      context: { transaction?: any } = {}
    ): Promise<${upperFirstCamelCasedModuleName}[]> {
      // Spread is used to cssopy the options in case of manipulation to prevent side effects
      const findOptions_ = { ...findOptions }
  
      findOptions_.options ??= {}
      findOptions_.options.limit ??= 15
  
      if (findOptions_.options.populate) {
        deduplicateIfNecessary(findOptions_.options.populate)
      }
  
      if (context.transaction) {
        Object.assign(findOptions_.options, { ctx: context.transaction })
      }
  
      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.SELECT_IN,
      })
  
      return await this.manager_.find(
        ${upperFirstCamelCasedModuleName},
        findOptions_.where as MikroFilterQuery<${upperFirstCamelCasedModuleName}>,
        findOptions_.options as MikroOptions<${upperFirstCamelCasedModuleName}>
      )
    }
  
    async findAndCount(
      findOptions: DAL.FindOptions<${upperFirstCamelCasedModuleName}> = { where: {} },
      context: { transaction?: any } = {}
    ): Promise<[${upperFirstCamelCasedModuleName}[], number]> {
      // Spread is used to copy the options in case of manipulation to prevent side effects
      const findOptions_ = { ...findOptions }
  
      findOptions_.options ??= {}
      findOptions_.options.limit ??= 15
  
      if (findOptions_.options.populate) {
        deduplicateIfNecessary(findOptions_.options.populate)
      }
  
      if (context.transaction) {
        Object.assign(findOptions_.options, { ctx: context.transaction })
      }
  
      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.SELECT_IN,
      })
    
      return await this.manager_.findAndCount(
        ${upperFirstCamelCasedModuleName},
        findOptions_.where as MikroFilterQuery<${upperFirstCamelCasedModuleName}>,
        findOptions_.options as MikroOptions<${upperFirstCamelCasedModuleName}>
      )
    }
  }
  `

  try {
    const path = resolve(modulePath, repositoryFileName)
    await writeFile(path, template)
    spinner.succeed(`src/repositories/${repositoryFileName} generated`)
  } catch (error) {
    log(`Failed to generate src/repositories/${repositoryFileName}`, "error")
    throw error
  }
}
