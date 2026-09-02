import { HttpTypes, MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  promiseAll,
} from "@medusajs/framework/utils"
import {
  ADMIN_SEARCH_ENTITY_MAP,
  AdminSearchEntityConfig,
  DEFAULT_ADMIN_SEARCH_ENTITY_NAMES,
} from "./search-entities"

type FallbackSearchInput = {
  q?: string
  entity?: string[]
  skip: number
  take: number
}

/**
 * Fans out free-text `q` queries across the admin search entity registry via
 * `query.graph`. Used when the Search Module is not registered, or for entities
 * that do not have an index.
 */
export async function searchWithGraphFallback(
  scope: MedusaContainer,
  { q, entity, skip, take }: FallbackSearchInput
): Promise<HttpTypes.AdminSearchResultGroup[]> {
  const names = entity?.length ? entity : DEFAULT_ADMIN_SEARCH_ENTITY_NAMES

  const configs: AdminSearchEntityConfig[] = names.map((name) => {
    const config = ADMIN_SEARCH_ENTITY_MAP.get(name)

    if (!config) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `No search entity registered for "${name}". Registered entities: ${DEFAULT_ADMIN_SEARCH_ENTITY_NAMES.join(
          ", "
        )}`
      )
    }

    return config
  })

  const query = scope.resolve(ContainerRegistrationKeys.QUERY)

  return await promiseAll(
    configs.map(async (config) => {
      const filters: Record<string, unknown> = {
        ...(config.filters ?? {}),
      }

      if (q) {
        filters.q = config.transformQuery ? config.transformQuery(q) : q
      }

      const { data, metadata } = await query.graph({
        entity: config.graphEntity,
        fields: config.fields,
        filters,
        pagination: { skip, take },
      })

      return {
        entity: config.name,
        data: data as Record<string, unknown>[],
        count: metadata?.count ?? 0,
        offset: metadata?.skip ?? skip,
        limit: metadata?.take ?? take,
      }
    })
  )
}
