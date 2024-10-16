import { ModuleProviderExports } from "@medusajs/types"

/**
 * Wrapper to build the module provider export
 *
 * @param serviceName // The name of the module the provider is for
 * @param services // The array of services that the module provides
 * @param loaders // The loaders that the module provider provides
 */
export function ModuleProvider(
  serviceName: string,
  { services, loaders }: ModuleProviderExports
): ModuleProviderExports {
  return {
    module: serviceName,
    services,
    loaders,
  }
}
