import { Constructor, IDmlEntity, ModuleExports } from "@medusajs/types"
import { MedusaServiceModelObjectsSymbol } from "./medusa-service"
import {
  buildLinkConfigFromDmlObjects,
  defineJoinerConfig,
} from "./joiner-config-builder"
import { InfersLinksConfig } from "./types/links-config"

/**
 * Wrapper to build the module export and auto generate the joiner config if needed as well as
 * return a links object based on the DML objects
 *
 * @param serviceName
 * @param service
 * @param loaders
 * @constructor
 */
export function Module<
  const ServiceName extends string,
  const Service extends Constructor<any>,
  ModelObjects extends Record<string, IDmlEntity<any, any>> = Service extends {
    $modelObjects: any
  }
    ? Service["$modelObjects"]
    : {},
  Linkable = keyof ModelObjects extends never
    ? Record<string, any>
    : InfersLinksConfig<ServiceName, ModelObjects>
>(
  serviceName: ServiceName,
  { service, loaders }: ModuleExports<Service>
): ModuleExports<Service> & {
  linkable: Linkable
} {
  service.prototype.__joinerConfig ??= defineJoinerConfig(serviceName)

  const dmlObjects = service[MedusaServiceModelObjectsSymbol] ?? {}

  return {
    service,
    loaders,
    linkable: (Object.keys(dmlObjects)?.length
      ? buildLinkConfigFromDmlObjects<ServiceName, ModelObjects>(
          serviceName,
          dmlObjects
        )
      : {}) as Linkable,
  }
}
