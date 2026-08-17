import type { HttpTypes, MedusaContainer, SearchTypes } from "../../types"
import {
  ContainerRegistrationKeys,
  isPresent,
  MedusaError,
  Modules,
} from "../../utils"
import type { MedusaRequest } from "../types"
import { refetchEntities } from "./refetch-entities"

type SearchEntityInput = {
  /** `query.graph` entry point, and the index name unless `index` says otherwise. */
  entity: string
  scope: MedusaContainer
  fields?: string[]
  /** As `query.graph` takes them: nested, named after model paths, `q` included. */
  filters?: Record<string, unknown>
  pagination?: MedusaRequest["queryConfig"]["pagination"]
  withDeleted?: boolean
  /** When the index is not named after the entity. */
  index?: string
}

/**
 * Lists an entity through the Search Module when it can serve the request, and
 * through `query.graph` otherwise.
 *
 * Takes what `query.graph` takes. Whether the engine can answer depends on the
 * fields the index was declared with and the operators its provider
 * accepts, so rather than predict it, the search is attempted and a failure
 * falls back.
 *
 * The engine is skipped outright in three cases, none of which an attempt would
 * discover:
 * - no free-text `q`, where there is no relevance to gain and the database
 *   answers a plain filtered list better — every field, exact count, any order
 * - `withDeleted`, since an index holds live documents only
 * - no Search Module registered, leaving nothing to translate the filters with
 *
 * Anything unexpected — an engine that is down, a bug — falls back too, since a
 * correct answer from the database beats a failed request. It is logged at
 * `warn` rather than `debug` so it does not pass for a capability mismatch.
 */
export async function searchEntityWithGraphFallback<
  TData = Record<string, unknown>
>({
  entity,
  scope,
  fields,
  filters,
  pagination,
  withDeleted,
  index = entity,
}: SearchEntityInput): Promise<HttpTypes.AdminSearchResultGroup<TData>> {
  const fromGraph = async (): Promise<
    HttpTypes.AdminSearchResultGroup<TData>
  > => {
    const { data, metadata } = await refetchEntities({
      entity,
      idOrFilter: filters,
      scope,
      fields,
      pagination,
      withDeleted,
    })

    return {
      entity: index,
      data,
      count: metadata.count ?? 0,
      offset: metadata.skip ?? 0,
      limit: metadata.take ?? 0,
    }
  }

  if (!isPresent(filters?.q) || withDeleted) {
    return await fromGraph()
  }

  const searchModule = scope.resolve(Modules.SEARCH, {
    allowUnregistered: true,
  })

  // Whether the module holds this index is settled by the attempt below, which
  // throws a typed error naming the registered ones. Only its absence has to be
  // checked up front, since there would be nothing to translate the filters with.
  if (!searchModule) {
    return await fromGraph()
  }

  try {
    const { data, search_result } = await scope
      .resolve(ContainerRegistrationKeys.QUERY)
      .search({
        entity: index,
        fields,
        filters: searchModule.translateGraphFilters(
          index,
          filters as SearchTypes.SearchFilters
        ),
        pagination: {
          skip: pagination?.skip,
          take: pagination?.take,
          order: pagination?.order as
            | Record<string, SearchTypes.SearchOrderBy>
            | undefined,
        },
      })

    return {
      entity: index,
      data,
      // Most engines only approximate a total.
      count: search_result.metadata.count ?? 0,
      offset: search_result.metadata.skip ?? 0,
      limit: search_result.metadata.take ?? 0,
    }
  } catch (error) {
    const logger = scope.resolve(ContainerRegistrationKeys.LOGGER)
    const reason = (error as Error).message

    // A query the index cannot answer, or an entity it does not cover at all —
    // both are how this project happens to be configured, not incidents, and a
    // route that never indexed its entity would otherwise warn on every request.
    const expected =
      MedusaError.isMedusaError(error) &&
      (error.type === MedusaError.Types.INVALID_DATA ||
        error.type === MedusaError.Types.NOT_FOUND)

    logger[expected ? "debug" : "warn"](
      `Listing "${index}" through the database rather than the search engine because: ${reason}`
    )

    return await fromGraph()
  }
}
