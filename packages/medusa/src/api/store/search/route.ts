import {
  AllowedSearchIndexes,
  MedusaResponse,
  MedusaStoreRequest,
} from "@medusajs/framework/http"
import { HttpTypes, SearchTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"

/**
 * Searches the store's search indexes and answers with the engine's own results
 * — hits, scores, highlights, and facets — which is the contract InstantSearch's
 * search client is built on.
 *
 * Each query names the index it runs against, and a batch is resolved in one
 * round-trip to the engine.
 *
 * Nothing is searchable until a middleware opts an index in with
 * `allowSearchIndexes`. Within an allowed index the queries run as posted, so
 * narrowing further — a sales channel, a published status — is applied by a
 * middleware that edits `req.validatedBody`.
 */
export const POST = async (
  req: MedusaStoreRequest<HttpTypes.StoreSearch> & AllowedSearchIndexes,
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

  const allowed = new Set(req.allowedSearchIndexes ?? [])

  const body = req.validatedBody
  const queries = "queries" in body ? body.queries : [body]

  const plans = queries.map(({ entity, fields }) => {
    // An index the store hasn't opted in is answered exactly like one that
    // doesn't exist, so the endpoint never tells a client what it holds. The
    // reason goes to the log instead, for whoever configured the route.
    if (!allowed.has(entity)) {
      logger.warn(
        `Search index "${entity}" is not exposed on /store/search. Opt it in with the \`allowSearchIndexes\` middleware.`
      )

      throw notFound(entity)
    }

    let index: SearchTypes.ResolvedSearchIndexDefinition
    try {
      index = searchModule.getIndex(entity)
    } catch {
      // Rethrown rather than passed through: the module's message names every
      // registered index, which is not a storefront's to know.
      throw notFound(entity)
    }

    const retrievable = new Set(searchModule.listRetrievableFields(entity))

    return {
      primaryKey: index.primary_key,
      // Whatever the index can't serve is fetched by `query.search` through
      // `query.graph`. Left unset, `fields` defaults to the index' own.
      withHydration: !!fields?.some((field) => !retrievable.has(field)),
    }
  })

  const results = await query.search(
    queries,
    // Only reaches the hydration: what the index itself returns is whatever the
    // seed wrote, so an index serving several locales stores them as its own
    // fields.
    { locale: req.locale }
  )

  res.json({
    results: results.map(({ data, search_result: searchResult }, i) => {
      const { primaryKey, withHydration } = plans[i]

      if (!withHydration) {
        return searchResult
      }

      // The engine only returned the fields the index holds, so the hit carries
      // the hydrated entity instead, matched back by the primary key.
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
