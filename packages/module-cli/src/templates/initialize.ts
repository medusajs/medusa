import log from "../utils/logger.js"
import { resolve } from "path"
import { mkdir, writeFile } from "fs/promises"
import { spinner } from "../index.js"
import dedent from "dedent"
import { existsSync } from "fs"

const initializeFileName = "index.ts"

export async function generateInitialize({
  modulePath,
  upperFirstCamelCasedModuleName,
}: {
  modulePath: string
  upperFirstCamelCasedModuleName: string
}): Promise<void> {
  const outputPath = resolve(modulePath, "src/initialize")
  if (!existsSync(outputPath)) {
    await mkdir(outputPath, { recursive: true })
  }

  await generateIndex({
    modulePath: outputPath,
    upperFirstCamelCasedModuleName,
  })
}

async function generateIndex({
  modulePath,
  upperFirstCamelCasedModuleName,
}: {
  modulePath: string
  upperFirstCamelCasedModuleName: string
}) {
  log(`Generating src/initialize/${initializeFileName}`)

  const template = dedent`
    import {
    ExternalModuleDeclaration,
    InternalModuleDeclaration,
    MedusaModule,
    MODULE_PACKAGE_NAMES,
    Modules,
  } from "@medusajs/modules-sdk"
  import { I${upperFirstCamelCasedModuleName}ModuleService } from "@medusajs/types"
  import { moduleDefinition } from "../module-definition"
  import {
    InitializeModuleInjectableDependencies,
    ${upperFirstCamelCasedModuleName}ServiceInitializeCustomDataLayerOptions,
    ${upperFirstCamelCasedModuleName}ServiceInitializeOptions,
  } from "../types"
  
  export const initialize = async (
    options?:
      | ${upperFirstCamelCasedModuleName}ServiceInitializeOptions
      | ${upperFirstCamelCasedModuleName}ServiceInitializeCustomDataLayerOptions
      | ExternalModuleDeclaration,
    injectedDependencies?: InitializeModuleInjectableDependencies
  ): Promise<I${upperFirstCamelCasedModuleName}ModuleService> => {
    const serviceKey = Modules.${upperFirstCamelCasedModuleName.toUpperCase()}
  
    const loaded = await MedusaModule.bootstrap(
      serviceKey,
      MODULE_PACKAGE_NAMES[Modules.${upperFirstCamelCasedModuleName.toUpperCase()}],
      options as InternalModuleDeclaration | ExternalModuleDeclaration,
      moduleDefinition,
      injectedDependencies
    )
  
    return loaded[serviceKey] as I${upperFirstCamelCasedModuleName}ModuleService
  }
  `

  try {
    const path = resolve(modulePath, initializeFileName)
    await writeFile(path, template)
    spinner.succeed(`src/initialize/${initializeFileName} generated`)
  } catch (error) {
    log(`Failed to generate src/initialize/${initializeFileName}`, "error")
    throw error
  }
}
