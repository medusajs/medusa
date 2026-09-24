import { z } from "@medusajs/framework/zod"

// InstantSearch sends the hits query plus one per disjunctive facet, so a
// storefront stays well under this while a crafted payload can't fan out into
// an unbounded number of engine round-trips.
const MAX_SEARCH_QUERIES = 20

const MAX_SEARCH_TAKE = 100

const StoreSearchFilterValue = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
])

const StoreSearchOperatorMap = z
  .object({
    $eq: StoreSearchFilterValue.optional(),
    $ne: StoreSearchFilterValue.optional(),
    $in: z.array(StoreSearchFilterValue).optional(),
    $nin: z.array(StoreSearchFilterValue).optional(),
    $lt: StoreSearchFilterValue.optional(),
    $lte: StoreSearchFilterValue.optional(),
    $gt: StoreSearchFilterValue.optional(),
    $gte: StoreSearchFilterValue.optional(),
    $exists: z.boolean().optional(),
    $contains: z
      .union([StoreSearchFilterValue, z.array(StoreSearchFilterValue)])
      .optional(),
    $overlaps: z.array(StoreSearchFilterValue).optional(),
    $prefix: z.string().optional(),
    $like: z.string().optional(),
  })
  .strict()

/**
 * A filter tree keyed by the index' own fields, plus `q` for the free-text query
 * and `$and` / `$or` / `$not` for grouping. Which fields exist is a property of
 * the index definition, so the engine is what rejects an unknown one.
 */
const StoreSearchFilters: z.ZodType<Record<string, any>> = z.lazy(() =>
  z.record(
    z.string(),
    z.union([
      StoreSearchFilterValue,
      z.array(StoreSearchFilterValue),
      StoreSearchOperatorMap,
      StoreSearchFilters,
      z.array(StoreSearchFilters),
    ])
  )
)

const StoreSearchFacet = z.union([
  z.string(),
  z
    .object({
      field: z.string(),
      type: z.literal("value").optional(),
      limit: z.number().int().positive().optional(),
      sort: z.enum(["count", "alpha"]).optional(),
      query: z.string().optional(),
    })
    .strict(),
  z
    .object({
      field: z.string(),
      type: z.literal("range"),
      ranges: z.array(
        z
          .object({
            key: z.string().optional(),
            from: z.union([z.number(), z.string()]).optional(),
            to: z.union([z.number(), z.string()]).optional(),
          })
          .strict()
      ),
    })
    .strict(),
  z.object({ field: z.string(), type: z.literal("stats") }).strict(),
])

const StoreSearchHighlight = z.union([
  z.boolean(),
  z
    .object({
      fields: z.array(z.string()),
      pre_tag: z.string().optional(),
      post_tag: z.string().optional(),
      snippet: z
        .union([z.boolean(), z.object({ length: z.number().int().positive() })])
        .optional(),
    })
    .strict(),
])

// No `provider_options`: it reaches straight into the engine's own API, which
// is not a storefront's to drive.
const StoreSearchOptions = z
  .object({
    attributes_to_search_on: z.array(z.string()).optional(),
    match_strategy: z.enum(["all", "any", "last"]).optional(),
    typo_tolerance: z.boolean().optional(),
    facets: z.array(StoreSearchFacet).optional(),
    disjunctive_facets: z.boolean().optional(),
    highlight: StoreSearchHighlight.optional(),
    distinct: z.string().optional(),
    min_score: z.number().optional(),
    include_score: z.boolean().optional(),
    locales: z.array(z.string()).optional(),
    vector: z
      .object({
        field: z.string().optional(),
        value: z.array(z.number()).optional(),
        query: z.string().optional(),
        semantic_ratio: z.number().min(0).max(1).optional(),
      })
      .strict()
      .optional(),
    count: z.enum(["estimated", "exact", "none"]).optional(),
  })
  .strict()

const StoreSearchPagination = z
  .object({
    skip: z.number().int().nonnegative().optional(),
    // `0` is what InstantSearch sends for a facet-only search.
    take: z.number().int().nonnegative().max(MAX_SEARCH_TAKE).optional(),
    order: z.record(z.string(), z.enum(["ASC", "DESC"])).optional(),
    cursor: z.string().optional(),
  })
  .strict()

/**
 * The Search Module's `SearchQuery`, minus the `context` that shapes hydration,
 * which is the endpoint's to build.
 */
const StoreSearchQuery = z
  .object({
    entity: z.string().min(1),
    fields: z.array(z.string()).optional(),
    filters: StoreSearchFilters.optional(),
    pagination: StoreSearchPagination.optional(),
    search_options: StoreSearchOptions.optional(),
  })
  .strict()

/**
 * A batch of queries, or a single one — which is what the InstantSearch adapter
 * posts when it is configured with `batch: false`.
 */
export const StoreSearch = z.union([
  z
    .object({
      queries: z.array(StoreSearchQuery).min(1).max(MAX_SEARCH_QUERIES),
    })
    .strict(),
  StoreSearchQuery,
])
