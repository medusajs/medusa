import { ModuleExports } from "@medusajs/types"
import { MedusaServiceDmlObjectSymbolFunction } from "./medusa-service"
import {
  buildLinkConfigFromDmlObjects,
  defineJoinerConfig,
} from "./joiner-config-builder"

/**
 * Build the module export and auto generate the joiner config if needed as well as
 * return a links object based on the DML objects
 * @param moduleName
 * @param service
 * @param loaders
 * @constructor
 */
export function ExportModule(
  moduleName: string,
  { service, loaders }: ModuleExports
) {
  const dmlObjects = service[MedusaServiceDmlObjectSymbolFunction] ?? []

  service.prototype.__joinerConfig ??= defineJoinerConfig(moduleName)

  return {
    service,
    loaders,
    links: buildLinkConfigFromDmlObjects(dmlObjects as any),
  }
}
