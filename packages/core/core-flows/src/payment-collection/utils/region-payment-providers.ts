import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * Retrieves the IDs of the payment providers that are enabled in a region.
 *
 * @param container - The container to resolve the query from.
 * @param regionId - The ID of the region to retrieve the payment providers of.
 */
export async function listRegionPaymentProviderIds(
  container: MedusaContainer,
  regionId: string
): Promise<Set<string>> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [region],
  } = await query.graph({
    entity: "region",
    fields: ["payment_providers.id"],
    filters: { id: regionId },
  })

  return new Set(
    (region?.payment_providers ?? []).map((provider) => provider.id)
  )
}
