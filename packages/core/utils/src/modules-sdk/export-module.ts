import { Constructor, ModuleExports } from "@medusajs/types"
import { MedusaServiceDmlObjectSymbolFunction } from "./medusa-service"
import {
  buildLinkConfigFromDmlObjects,
  defineJoinerConfig,
} from "./joiner-config-builder"
import { InfersLinksConfig } from "./types/links-config"
import { DmlEntity } from "../dml"

/**
 * Build the module export and auto generate the joiner config if needed as well as
 * return a links object based on the DML objects
 * @param moduleName
 * @param service
 * @param loaders
 * @constructor
 */
export function ExportModule<
  const Service extends Constructor<any>,
  const DMLObjects extends DmlEntity<any>[] = Service extends {
    $dmlObjects: infer $DmlObjects
  }
    ? $DmlObjects
    : [],
  Links = keyof DMLObjects extends never
    ? Record<string, any>
    : InfersLinksConfig<DMLObjects>
>(
  moduleName: string,
  { service, loaders }: ModuleExports<Service>
): ModuleExports<Service> & {
  links: Links
} {
  service.prototype.__joinerConfig ??= defineJoinerConfig(moduleName)

  const dmlObjects = service[MedusaServiceDmlObjectSymbolFunction]
  return {
    service,
    loaders,
    links: (dmlObjects?.length
      ? buildLinkConfigFromDmlObjects(dmlObjects)
      : {}) as Links,
  }
}
