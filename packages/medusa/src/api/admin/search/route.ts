import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes, SearchTypes } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { AdminGetSearchParamsType } from "./validators"

/**
 * Search across everything that is indexed.
 *
 * Results are grouped and paginated per entity: relevance scores are only
 * comparable within one index, so there is no honest way to merge them.
 *
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<void, AdminGetSearchParamsType>,
  res: MedusaResponse<HttpTypes.AdminSearchResponse>
) => {
  const searchModule = req.scope.resolve(Modules.SEARCH)

  const { q, entity } = req.validatedQuery
  const { skip, take } = req.queryConfig.pagination

  // Everything indexed unless the caller narrowed it down.
  const entities = entity?.length ? entity : searchModule.listIndexes()

  if (!entities.length) {
    res.json({ results: [] })
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
