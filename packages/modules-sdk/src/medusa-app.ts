import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  LoadedModule,
} from "@medusajs/types"

import { isObject } from "@medusajs/utils"
import { MODULE_PACKAGE_NAMES, Modules } from "./definitions"
import { MedusaModule } from "./medusa-module"
import { RemoteQuery } from "./remote-query"

class RemoteLink {} // TODO: available when PR remote link is mergerd

declare global {
  function query(query: string): Promise<any>
  var link: RemoteLink
}

type ModuleDeclaration = ExternalModuleDeclaration | InternalModuleDeclaration
export type ModuleConfig = ModuleDeclaration & {
  module: Modules | string
  path: string
  options?: Record<string, unknown>

  definition: {
    key: string
    registrationName: string
    label: string
    path: string | false
    canOverride?: boolean
    isRequired?: boolean
    isQueryable?: boolean
    dependencies?: string[]
  }
}

export type MedusaModuleConfig = (Partial<ModuleConfig> | Modules)[]

export async function MedusaApp({
  sharedResourcesConfig,
  loadedModules,
}: {
  sharedResourcesConfig?: any
  loadedModules?: LoadedModule[]
} = {}) {
  const { modules }: { modules: MedusaModuleConfig } = await import(
    process.cwd() + "/modules-config"
  )

  const injectedDependencies: any = {} // Load shared resources here

  const allModules: LoadedModule[] = []

  await Promise.all(
    modules.map(async (mod: Partial<ModuleConfig> | Modules) => {
      let key: Modules | string = mod as Modules
      let path: string
      let declaration: any = undefined

      if (isObject(mod)) {
        if (!mod.module) {
          throw new Error(
            `Module ${JSON.stringify(mod)} is missing module name.`
          )
        }
        key = mod.module!
        path = mod.path ?? MODULE_PACKAGE_NAMES[key]

        declaration = { ...mod }
        delete declaration.definition
      } else {
        path = MODULE_PACKAGE_NAMES[mod as Modules]
      }

      const loaded = await MedusaModule.bootstrap(
        key,
        path,
        declaration,
        undefined,
        injectedDependencies
        //isObject(mod) ? mod.definition : undefined
      )
      allModules[key] = loaded[key]

      return loaded
    })
  )

  const { initialize: initializeLinks } = await import(
    "@medusajs/link-modules" as string
  )
  await initializeLinks()

  global.link = new RemoteLink()
  const remoteQuery = new RemoteQuery()

  global.query = async (query: string) => {
    return await remoteQuery.query(query)
  }

  return {
    modules: allModules,
    link: global.link,
    query: global.query,
  }
}
