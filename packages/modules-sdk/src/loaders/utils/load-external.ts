import {
  ExternalModuleDeclaration,
  Logger,
  MedusaContainer,
  ModuleExports,
  ModuleResolution,
} from "@medusajs/types"
import { MedusaModuleType } from "@medusajs/utils"
import { asValue } from "awilix"
import { Modules } from "../../definitions"
import * as Clients from "./clients"

export async function loadExternalModule(
  container: MedusaContainer,
  resolution: ModuleResolution,
  logger: Logger
): Promise<{ error?: Error } | void> {
  const registrationName = resolution.definition.registrationName

  const { server } = resolution.moduleDeclaration as ExternalModuleDeclaration

  let loadedModule: ModuleExports

  const clientType: string = server?.type!
  if (!clientType) {
    throw new Error(`Client type is not defined.`)
  } else if (!Clients[clientType]) {
    throw new Error(`Client type "${clientType}" is not supported.`)
  }

  try {
    let moduleKey = resolution.definition.key
    for (const key of Object.keys(Modules)) {
      if (Modules[key] === moduleKey) {
        moduleKey = key.toLowerCase()
        break
      }
    }

    const clientConstructor = Clients[clientType].default
    clientConstructor.__type = MedusaModuleType

    loadedModule = await clientConstructor(
      moduleKey,
      server?.url,
      {
        options: { ...(server?.options ?? {}) },
      },
      logger
    )
  } catch (error) {
    return { error }
  }

  container.register({
    [registrationName]: asValue(loadedModule),
  })
}
