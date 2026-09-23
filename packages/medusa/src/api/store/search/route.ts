import {
  ConfiguredStoreSearch,
  MedusaResponse,
  MedusaStoreRequest,
} from "@medusajs/framework/http"
import { HttpTypes, Logger, SearchTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  ProductStatus,
  isPresent,
} from "@medusajs/framework/utils"

const PRODUCT_ENTITY = "product"
const STATUS_FIELD = "status"
const SALES_CHANNEL_FIELD = "sales_channel_ids"

// An index definition cannot change under a running process, so the warning is
// logged once rather than on every search.
const unscopedProductIndexes = new Set<string>()

/**
 * Answers with the engine's own results — hits, scores, highlights, facets —
 * which is the contract InstantSearch's search client is built on. Nothing is
 * searchable until `configureStoreSearch` opts an index in.
 *
 * @since 2.21.1
 */
export const POST = async (
  req: MedusaStoreRequest<HttpTypes.StoreSearch> & ConfiguredStoreSearch,
  res: MedusaResponse<HttpTypes.StoreSearchResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
  const searchModule = req.scope.resolve(Modules.SEARCH, {
    allowUnregistered: true,
  })

  if (!searchModule) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "The Search Module is not installed, so nothing can be searched."
    )
  }

  const allowed = req.storeSearchConfig?.allowed_indexes ?? {}

  const body = req.validatedBody
  const queries = "queries" in body ? body.queries : [body]

  const plans = await Promise.all(
    queries.map(async ({ entity, fields }) => {
      const config = allowed[entity]

      // Answered like an index that doesn't exist, so the endpoint never tells
      // a client what the store holds.
      if (!config) {
        logger.warn(
          `Search index "${entity}" is not exposed on /store/search. Opt it in with the \`configureStoreSearch\` middleware.`
        )

        throw notFound(entity)
      }

      let index: SearchTypes.ResolvedSearchIndexDefinition
      try {
        index = searchModule.getIndex(entity)
      } catch {
        // The module's own message names every registered index.
        throw notFound(entity)
      }

      const retrievable = new Set(searchModule.listRetrievableFields(entity))

      return {
        primaryKey: index.primary_key,
        productFilters: buildProductFilters(index, req, logger),
        filters: config === true ? undefined : await config.filters?.(req),
        withHydration: !!fields?.some((field) => !retrievable.has(field)),
      }
    })
  )

  // `locale` only reaches the hydration: what the index returns is whatever the
  // seed wrote.
  const results = await query.search(
    queries.map((searchQuery, i) => ({
      ...searchQuery,
      filters: mergeSearchFilters(
        plans[i].productFilters,
        plans[i].filters,
        searchQuery.filters
      ),
    })),
    { locale: req.locale }
  )

  res.json({
    results: results.map(({ data, search_result: searchResult }, i) => {
      const { primaryKey, withHydration } = plans[i]

      if (!withHydration) {
        return searchResult
      }

      const hydrated = new Map(data.map((entry) => [entry[primaryKey], entry]))

      return {
        ...searchResult,
        hits: searchResult.hits.map((hit) => ({
          ...hit,
          document: hydrated.get(hit.id) ?? hit.document,
        })),
      }
    }),
  })
}

const notFound = (entity: string) =>
  new MedusaError(
    MedusaError.Types.NOT_FOUND,
    `No search index named "${entity}"`
  )

function buildProductFilters(
  index: SearchTypes.ResolvedSearchIndexDefinition,
  req: MedusaStoreRequest,
  logger: Logger
): SearchTypes.SearchFilters | undefined {
  if (index.entity !== PRODUCT_ENTITY) {
    return undefined
  }

  const filters: SearchTypes.SearchFilters = {}
  const missing: string[] = []

  if (index.fields[STATUS_FIELD]?.filterable === true) {
    filters[STATUS_FIELD] = ProductStatus.PUBLISHED
  } else {
    missing.push(STATUS_FIELD)
  }

  if (index.fields[SALES_CHANNEL_FIELD]?.filterable === true) {
    const salesChannelIds = req.publishable_key_context.sales_channel_ids

    if (!salesChannelIds.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Publishable key needs to have a sales channel configured`
      )
    }

    filters[SALES_CHANNEL_FIELD] = salesChannelIds
  } else {
    missing.push(SALES_CHANNEL_FIELD)
  }

  if (missing.length && !unscopedProductIndexes.has(index.name)) {
    unscopedProductIndexes.add(index.name)

    logger.warn(
      `Search index "${
        index.name
      }" holds products but declares no filterable ${missing
        .map((field) => `"${field}"`)
        .join(
          " or "
        )}, so /store/search cannot narrow it there. Add the field to the index, or scope it through the \`filters\` of \`configureStoreSearch\`.`
    )
  }

  return isPresent(filters) ? filters : undefined
}

/**
 * ANDs the filters together, so a query can narrow its own results but never
 * widen past what the endpoint and the store allow. `q` is hoisted to the top
 * level, the only place the Search Module lifts it from.
 */
function mergeSearchFilters(
  ...filters: (SearchTypes.SearchFilters | undefined)[]
): SearchTypes.SearchFilters | undefined {
  const present = filters.filter(isPresent) as SearchTypes.SearchFilters[]

  if (present.length < 2) {
    return present[0]
  }

  let q: string | undefined
  const branches: SearchTypes.SearchFilters[] = []

  for (const filter of present) {
    const { q: filterQuery, ...rest } = filter

    if (filterQuery !== undefined) {
      q = filterQuery
    }
    if (isPresent(rest)) {
      branches.push(rest)
    }
  }

  return {
    ...(isPresent(q) ? { q } : {}),
    ...(branches.length > 1 ? { $and: branches } : branches[0] ?? {}),
  }
}
