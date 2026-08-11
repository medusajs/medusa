import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes, SearchTypes } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { searchWithGraphFallback } from "./fallback-search"
import { AdminGetSearchParamsType } from "./validators"

/**
 * Search across entities. When the Search Module is enabled, results come from
 * its indexes. Otherwise each entity is queried via `query.graph` (the same
 * free-text `q` the admin list endpoints used to fire from the client).
 *
 * Results are grouped and paginated per entity: relevance scores are only
 * comparable within one index, so there is no honest way to merge them.
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

  const indexes = searchModule?.listIndexes() ?? []
  // Everything indexed unless the caller narrowed it down.
  const entities = entity?.length ? entity : indexes

  // Half the groups ranked by an engine and the other half ordered by the
  // database is not a result set anyone can reason about, so the engine only
  // serves a request it covers entirely.
  const isCoveredByIndexes =
    entities.length > 0 && entities.every((name) => indexes.includes(name))

  if (!searchModule || !isCoveredByIndexes) {
    const results = await searchWithGraphFallback(req.scope, {
      q,
      entity,
      skip,
      take,
    })

    res.json({ results })
    return
  }

  const queries: SearchTypes.SearchQuery[] = entities.map((name) => ({
    entity: name,
    // We don't want to expand the fields in order to not do a separate DB request.
    fields: searchModule.listRetrievableFields(name),
    filters: q ? { q } : undefined,
    pagination: { skip, take },
  }))

  const results = await searchModule.searchMany(queries)

  res.json({
    results: results.map((result, i) => ({
      entity: entities[i],
      data: result.hits.map((hit) => hit.document),
      // Never requested with `count: "none"`, so `null` is out of the ordinary
      // — but the response promises a number.
      count: result.metadata.count ?? 0,
      offset: result.metadata.skip,
      limit: result.metadata.take,
    })),
  })
}
