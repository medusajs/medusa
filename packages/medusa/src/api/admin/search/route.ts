import { resolvePermissions } from "@medusajs/framework"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  HttpTypes,
  RemoteQueryFunction,
  SearchTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  PolicyOperation,
  promiseAll,
} from "@medusajs/framework/utils"
import { searchWithGraphFallback } from "./fallback-search"
import {
  ADMIN_SEARCH_ENTITY_MAP,
  DEFAULT_ADMIN_SEARCH_ENTITY_NAMES,
} from "./search-entities"
import { AdminGetSearchParamsType } from "./validators"

/**
 * Search across entities. Per entity, prefer the Search Module when that
 * entity has an index; otherwise fall back to `query.graph` (the same free-text
 * `q` the admin list endpoints used to fire from the client).
 *
 * Results are grouped and paginated per entity: relevance scores are only
 * comparable within one index, so groups are never merged across entities.
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<void, AdminGetSearchParamsType>,
  res: MedusaResponse<HttpTypes.AdminSearchResponse>
) => {
  const searchModule = req.scope.resolve(Modules.SEARCH, {
    allowUnregistered: true,
  })
  const query = req.scope.resolve<RemoteQueryFunction>(
    ContainerRegistrationKeys.QUERY
  )

  const { q, entity } = req.validatedQuery
  const skip = req.queryConfig.pagination.skip ?? 0
  const take = req.queryConfig.pagination.take ?? 20

  const indexes = new Map(
    ((await searchModule?.listIndexes()) ?? []).map((index) => [
      index.name,
      index.entity,
    ])
  )

  // Caller narrows the set; otherwise search every index. If the module is on
  // but nothing is indexed yet, leave `requested` unset so we fall through to
  // the graph defaults
  const requested = entity?.length
    ? entity
    : indexes.size
    ? [...indexes.keys()]
    : undefined

  const entities = await filterReadableEntities(
    req,
    requested ?? DEFAULT_ADMIN_SEARCH_ENTITY_NAMES,
    (name) =>
      indexes.get(name) ??
      ADMIN_SEARCH_ENTITY_MAP.get(name)?.graphEntity ??
      name
  )

  if (!entities.length) {
    res.json({ results: [] })
    return
  }

  if (!searchModule || !requested) {
    const results = await searchWithGraphFallback(req.scope, {
      q,
      entity: entities,
      skip,
      take,
    })

    res.json({ results })
    return
  }

  const indexedEntities = entities.filter((name) => indexes.has(name))
  const graphEntities = entities.filter((name) => !indexes.has(name))

  const [indexResults, graphResults] = await promiseAll([
    indexedEntities.length
      ? searchIndexedEntities(query, {
          entities: indexedEntities,
          q,
          skip,
          take,
        })
      : Promise.resolve([] as HttpTypes.AdminSearchResultGroup[]),
    graphEntities.length
      ? searchWithGraphFallback(req.scope, {
          q,
          entity: graphEntities,
          skip,
          take,
        })
      : Promise.resolve([] as HttpTypes.AdminSearchResultGroup[]),
  ])

  const resultsByEntity = new Map<string, HttpTypes.AdminSearchResultGroup>()
  for (const group of [...indexResults, ...graphResults]) {
    resultsByEntity.set(group.entity, group)
  }

  // Preserve the caller's entity order (or index registration order).
  res.json({
    results: entities.map((name) => resultsByEntity.get(name)!),
  })
}

/**
 * Returns the subset of `names` the caller holds a read policy for, checking
 * each against the same resource its admin list route requires.
 */
async function filterReadableEntities(
  req: AuthenticatedMedusaRequest<void, AdminGetSearchParamsType>,
  names: string[],
  resourceFor: (name: string) => string
): Promise<string[]> {
  const granted = await resolvePermissions({
    roles: (req.auth_context?.app_metadata?.roles as string[]) ?? [],
    universe: names.map((name) => ({
      resource: resourceFor(name),
      operation: PolicyOperation.read,
    })),
    container: req.scope,
  })

  return names.filter((name) =>
    granted.has(`${resourceFor(name)}:${PolicyOperation.read}`)
  )
}

async function searchIndexedEntities(
  query: RemoteQueryFunction,
  {
    entities,
    q,
    skip,
    take,
  }: {
    entities: string[]
    q?: string
    skip: number
    take: number
  }
): Promise<HttpTypes.AdminSearchResultGroup[]> {
  const queries: SearchTypes.SearchQuery[] = entities.map((name) => ({
    entity: name,
    filters: q ? { q } : undefined,
    pagination: { skip, take },
    search_options: q ? { match_strategy: "last" } : undefined,
  }))

  const results = await query.search(queries)

  return results.map((result, i) => ({
    entity: entities[i],
    data: result.data,
    // Never requested with `count: "none"`, so `null` is out of the ordinary
    // — but the response promises a number.
    count: result.search_result.metadata.count ?? 0,
    offset: result.search_result.metadata.skip,
    limit: result.search_result.metadata.take,
  }))
}
