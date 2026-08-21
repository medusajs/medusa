import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import type { Limit, IndexQuery, RankBy } from "./api-types"
import { toSearchFilter } from "./filters"
import type { MedusaSearchQueryOptions } from "./options"
import { IndexPlan, isSearchable } from "./plan"

export type QueryPlan = {
  query: IndexQuery
  skip: number
  take: number
  options: MedusaSearchQueryOptions
}

function fail(message: string): never {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
}

function providerOptions(
  input: SearchTypes.ProviderSearchQuery
): MedusaSearchQueryOptions {
  return (input.search_options?.provider_options?.[
    "search-medusa"
  ] ?? {}) as MedusaSearchQueryOptions
}

function textRank(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan
): RankBy {
  const fields =
    input.search_options?.attributes_to_search_on ?? plan.searchable

  if (!fields.length) {
    fail(
      `Search index "${input.index.name}" has no searchable fields for a text query`
    )
  }

  const clauses = fields.map((path): unknown => {
    const field = plan.fields.get(path)
    if (!field || !isSearchable(field.field)) {
      fail(`Field "${path}" is not searchable`)
    }

    const suffix =
      input.search_options?.match_strategy === "last"
        ? { last_as_prefix: true }
        : undefined
    const clause = suffix
      ? [path, "BM25", input.q!, suffix]
      : [path, "BM25", input.q!]
    const weight =
      typeof field.field.searchable === "object"
        ? field.field.searchable.weight
        : undefined

    return weight !== undefined && weight !== 1
      ? ["Product", weight, clause]
      : clause
  })

  return clauses.length === 1 ? clauses[0] : (["Sum", clauses] as RankBy)
}

function attributeRank(
  input: SearchTypes.ProviderSearchQuery
): RankBy | undefined {
  const entries = Object.entries(input.pagination?.order ?? {}).filter(
    ([path]) => path !== "_score"
  )
  if (!entries.length) {
    return undefined
  }

  const ranks = entries.map(
    ([path, direction]) =>
      [path, direction.toLowerCase()] as [string, "asc" | "desc"]
  )
  return ranks.length === 1 ? ranks[0] : ranks
}

export function buildQueryPlan(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan
): QueryPlan {
  const options = input.search_options ?? {}
  const skip = input.pagination?.skip ?? 0
  const take = input.pagination?.take ?? 20

  if (input.pagination?.cursor !== undefined) {
    fail("The Medusa search provider does not support cursor pagination")
  }
  if (skip + take > 10000) {
    fail("Medusa search can return at most 10,000 results per query")
  }
  if (options.highlight) {
    fail("Medusa search highlighting is not implemented by this provider yet")
  }
  if (options.typo_tolerance) {
    fail(
      "Medusa search does not provide equivalent BM25 typo tolerance yet"
    )
  }
  if (options.locales?.length) {
    fail(
      "Configure Medusa search full-text language on index fields, not per query"
    )
  }
  if (options.min_score !== undefined) {
    fail("Medusa search min_score is not implemented by this provider yet")
  }
  if (options.match_strategy === "all") {
    fail(
      'Medusa search cannot enforce match_strategy: "all" across multiple text fields'
    )
  }
  if (options.vector?.query) {
    fail(
      "Text-to-vector embedding is not configured; pass search_options.vector.value"
    )
  }
  if (input.q && options.vector) {
    fail("Medusa search hybrid BM25/vector search is not implemented yet")
  }

  const ordered = attributeRank(input)
  let rankBy: RankBy

  if (options.vector) {
    if (!options.vector.value) {
      fail("Vector search requires search_options.vector.value")
    }
    if (ordered) {
      fail("Vector search cannot also order by an attribute")
    }
    rankBy = [
      options.vector.field,
      "ANN",
      options.vector.value,
    ] as RankBy
  } else if (input.q) {
    if (ordered) {
      fail("Text search cannot also order by an attribute")
    }
    rankBy = textRank(input, plan)
  } else {
    rankBy = ordered ?? (["id", "asc"] as RankBy)
  }

  let limit: number | Limit = skip + take
  const distinct = options.distinct ?? input.index.settings.distinct_attribute
  if (distinct) {
    limit = {
      total: skip + take,
      per: { attributes: [distinct], limit: 1 },
    }
  }

  return {
    query: {
      rank_by: rankBy,
      filters: toSearchFilter(input.filters, plan),
      include_attributes: input.attributes_to_retrieve,
      limit,
    },
    skip,
    take,
    options: providerOptions(input),
  }
}
