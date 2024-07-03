import { Constructor, ModuleExports } from "@medusajs/types"
import { MedusaServiceModelObjectsSymbol } from "./medusa-service"
import {
  buildLinkConfigFromDmlObjects,
  defineJoinerConfig,
} from "./joiner-config-builder"
import { InfersLinksConfig } from "./types/links-config"
import { DmlEntity } from "../dml"

/**
 * Wrapper to build the module export and auto generate the joiner config if needed as well as
 * return a links object based on the DML objects
 * @param moduleName
 * @param service
 * @param loaders
 * @constructor
 */
export function Module<
  const Service extends Constructor<any>,
  const ModelObjects extends DmlEntity<any, any>[] = Service extends {
    $modelObjects: infer $DmlObjects
  }
    ? $DmlObjects
    : [],
  Links = keyof ModelObjects extends never
    ? Record<string, any>
    : InfersLinksConfig<ModelObjects>
>({
  moduleName = "",
  service,
  loaders,
}: ModuleExports<Service> & { moduleName?: string }): ModuleExports<Service> & {
  links: Links
} {
  service.prototype.__joinerConfig ??= defineJoinerConfig(moduleName)

  const dmlObjects = service[MedusaServiceModelObjectsSymbol]
  return {
    service,
    loaders,
    links: (dmlObjects?.length
      ? buildLinkConfigFromDmlObjects(dmlObjects)
      : {}) as Links,
  }
}
