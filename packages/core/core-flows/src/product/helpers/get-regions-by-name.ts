import type {
  IRegionModuleService,
  MedusaContainer,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Builds a map of regions keyed by their lowercased name, used by the product
 * import to resolve region-scoped variant price columns (e.g.
 * "Variant Price Europe [EUR]") to a region id and currency code.
 *
 * Region names are treated as case-insensitive, matching the product export.
 */
export async function getRegionsByNameForImport(
  container: MedusaContainer
): Promise<Map<string, { id: string; currency_code: string }>> {
  const regionService = container.resolve<IRegionModuleService>(Modules.REGION)

  const regions = await regionService.listRegions(
    {},
    { select: ["id", "name", "currency_code"] }
  )

  return new Map(
    regions.map((region) => [
      region.name.toLowerCase(),
      { id: region.id, currency_code: region.currency_code },
    ])
  )
}
