import { ModuleProviderExports } from "@medusajs/types"

/**
 * Wrapper to build the module provider export
 *
 * @param serviceName
 * @param service
 * @param loaders
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
