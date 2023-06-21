import log from "../utils/logger.js"
import { resolve } from "path"
import { mkdir, writeFile } from "fs/promises"
import { spinner } from "../index.js"
import dedent from "dedent"
import { existsSync } from "fs"
import { lowerCaseFirst } from "@medusajs/utils"

const indexFileName = "index.ts"

export async function generateModels({
  modulePath,
  moduleName,
  upperFirstCamelCasedModuleName,
}: {
  modulePath: string
  moduleName: string
  upperFirstCamelCasedModuleName: string
}): Promise<void> {
  const outputPath = resolve(modulePath, "src/models")
  if (!existsSync(outputPath)) {
    await mkdir(outputPath, { recursive: true })
  }

  await generateIndex({ modulePath: outputPath, moduleName })
  await generateModel({
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
  log(`Generating src/models/${indexFileName}`)

  const template = dedent`
  export * from "./${moduleName}"
  `

  try {
    const path = resolve(modulePath, indexFileName)
    await writeFile(path, template)
    spinner.succeed(`src/models/${indexFileName} generated`)
  } catch (error) {
    log(`Failed to generate src/models/${indexFileName}`, "error")
    throw error
  }
}

async function generateModel({
  modulePath,
  moduleName,
  upperFirstCamelCasedModuleName,
}: {
  modulePath: string
  moduleName: string
  upperFirstCamelCasedModuleName: string
}) {
  const modelFileName = `${moduleName}.ts`
  log(`Generating src/models/${modelFileName}.ts`)

  const template = dedent`
  import {
    Entity,
    PrimaryKey,
  } from "@mikro-orm/core"
  
  import { generateEntityId, kebabCase } from "@medusajs/utils"
  
  @Entity({ tableName: "${lowerCaseFirst(upperFirstCamelCasedModuleName)}" })
  class ${upperFirstCamelCasedModuleName} {
    @PrimaryKey({ columnType: "text" })
    id!: string

    @BeforeCreate()
    beforeCreate() {
      this.id = generateEntityId(this.id, "${lowerCaseFirst(
        upperFirstCamelCasedModuleName
      ).slice(0, 3)}")
    }
  }
  
  export default Product
  `

  try {
    const path = resolve(modulePath, modelFileName)
    await writeFile(path, template)
    spinner.succeed(`src/models/${modelFileName} generated`)
  } catch (error) {
    log(`Failed to generate src/models/${modelFileName}`, "error")
    throw error
  }
}
