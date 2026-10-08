import { Constructor, IDmlEntity, ModuleExports } from "@medusajs/types"
import { DmlEntity } from "../dml"
import {
  buildIdPrefixToEntityNameFromDmlObjects,
  buildLinkConfigFromLinkableKeys,
  buildLinkConfigFromModelObjects,
  defineJoinerConfig,
} from "./joiner-config-builder"
import { MedusaServiceModelObjectsSymbol } from "./medusa-service"
import { InfersLinksConfig } from "./types/links-config"

/**
 * Wrapper to build the module export and auto generate the joiner config if not already provided in the module service, as well as
 * return a linkable object based on the models
 *
 * @param serviceName
 * @param service
 * @param loaders
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
  const modelObjects = service[MedusaServiceModelObjectsSymbol] ?? {}

  service.prototype.__joinerConfig ??= () =>
    defineJoinerConfig(serviceName, {
      models: Object.keys(modelObjects).length
        ? Object.values(modelObjects)
        : undefined,
    })

  let linkable = {} as Linkable

  const dmlObjects = Object.entries(modelObjects).filter(([, model]) =>
    DmlEntity.isDmlEntity(model)
  )

  // TODO: Custom joiner config should take precedence over the DML auto generated linkable
  // Thats in the case of manually providing models in custom joiner config.
  // TODO: Add support for non linkable modifier DML object to be skipped from the linkable generation

  const linkableKeys = service.prototype.__joinerConfig().linkableKeys
  service.prototype.__joinerConfig().idPrefixToEntityName =
    buildIdPrefixToEntityNameFromDmlObjects(
      dmlObjects.map(([, model]) => model) as DmlEntity<any, any>[]
    )

  if (dmlObjects.length) {
    linkable = buildLinkConfigFromModelObjects<ServiceName, ModelObjects>(
      serviceName,
      modelObjects,
      linkableKeys
    ) as Linkable
  } else {
    linkable = buildLinkConfigFromLinkableKeys(
      serviceName,
      linkableKeys
    ) as Linkable
  }

  return {
    service,
    loaders,
    linkable,
  }
}
