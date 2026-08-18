import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes, SearchTypes } from "@medusajs/framework/types"
import { Modules, promiseAll } from "@medusajs/framework/utils"
import { searchWithGraphFallback } from "./fallback-search"
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

  const { q, entity } = req.validatedQuery
  const skip = req.queryConfig.pagination.skip ?? 0
  const take = req.queryConfig.pagination.take ?? 20

  const indexes = new Set(searchModule?.listIndexes() ?? [])

  // Caller narrows the set; otherwise search every index. If the module is on
  // but nothing is indexed yet, leave `entities` empty so we fall through to
  // the graph defaults
  const entities = entity?.length ? entity : indexes.size ? [...indexes] : []

  if (!searchModule || !entities.length) {
    const results = await searchWithGraphFallback(req.scope, {
      q,
      entity: entity?.length ? entity : undefined,
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
      ? searchIndexedEntities(searchModule, {
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

async function searchIndexedEntities(
  searchModule: SearchTypes.ISearchModuleService,
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
    // We don't want to expand the fields in order to not do a separate DB request.
    fields: searchModule.listRetrievableFields(name),
    filters: q ? { q } : undefined,
    pagination: { skip, take },
  }))

  const results = await searchModule.searchMany(queries)

  return results.map((result, i) => ({
    entity: entities[i],
    data: result.hits.map((hit) => hit.document),
    // Never requested with `count: "none"`, so `null` is out of the ordinary
    // — but the response promises a number.
    count: result.metadata.count ?? 0,
    offset: result.metadata.skip,
    limit: result.metadata.take,
  }))
}
