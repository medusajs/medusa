import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import type {
  AttributeSchemaConfig,
  ComputeAttributes,
  Filter,
  HighlightFragment,
  Limit,
  IndexQuery,
  RankBy,
  Row,
  TokenFilterOptions,
} from "./api-types"
import { mergeFilters, textMatchFilter, toSearchFilter } from "./filters"
import type { MedusaSearchQueryOptions } from "./options"
import { IndexPlan, isSearchable } from "./plan"

export type HighlightPlan = {
  pre_tag: string
  post_tag: string
  fields: { path: string; key: string }[]
}

export type QueryPlan = {
  query: IndexQuery
  skip: number
  take: number
  options: MedusaSearchQueryOptions
  highlight?: HighlightPlan
}

function fail(message: string): never {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
}

function providerOptions(
  input: SearchTypes.ProviderSearchQuery
): MedusaSearchQueryOptions {
  return (input.search_options?.provider_options?.["search-medusa"] ??
    {}) as MedusaSearchQueryOptions
}

function searchableFields(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan
): string[] {
  const fields =
    input.search_options?.attributes_to_search_on ?? plan.searchable

  if (!fields.length) {
    fail(
      `Search index "${input.index.name}" has no searchable fields for a text query`
    )
  }

  for (const path of fields) {
    const field = plan.fields.get(path)
    if (!field || !isSearchable(field.field)) {
      fail(`Field "${path}" is not searchable`)
    }
  }

  return fields
}

/**
 * The last word of the query is a prefix, not a whole token, when
 * `match_strategy` is "last" (typeahead) — every BM25 clause built over
 * `input.q` needs this so a prefix-only match (query "egg" against document
 * "Eggs") is scored/highlighted consistently with how `textMatchFilter`
 * decided the document matches in the first place.
 */
function matchStrategySuffix(
  input: SearchTypes.ProviderSearchQuery
): TokenFilterOptions | undefined {
  return input.search_options?.match_strategy === "last"
    ? { last_as_prefix: true }
    : undefined
}

function textRank(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan
): RankBy {
  const fields = searchableFields(input, plan)
  const suffix = matchStrategySuffix(input)

  const clauses = fields.map((path): unknown => {
    const field = plan.fields.get(path)!

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

const TYPO_TOLERANCE_RANK_WEIGHT = 0.01

function minQueryCharsForDistance(distance: number): number {
  // Cloud: min_query_chars must be at least 3 * (distance + 1).
  return 3 * (distance + 1)
}

function fuzzyMaxEditDistance(plan: IndexPlan) {
  const one = Math.max(
    plan.typo_tolerance.min_word_size_for_one_typo,
    minQueryCharsForDistance(1)
  )
  const two = Math.max(
    plan.typo_tolerance.min_word_size_for_two_typos,
    minQueryCharsForDistance(2),
    one
  )

  return [
    { min_query_chars: one, distance: 1 },
    { min_query_chars: two, distance: 2 },
  ]
}

function fuzzyMatchFilter(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan
): Filter | undefined {
  if (!input.q?.trim()) {
    return undefined
  }

  const eligible = searchableFields(input, plan).filter((path) => {
    const schema = plan.schema[path]
    return typeof schema === "object" && (schema as AttributeSchemaConfig).fuzzy
  })

  if (!eligible.length) {
    fail(
      `Search index "${input.index.name}" has no fuzzy-enabled fields for typo tolerance — check settings.typo_tolerance`
    )
  }

  const maxEditDistance = fuzzyMaxEditDistance(plan)
  const words = input.q.trim().split(/\s+/).filter(Boolean)
  const wordClauses = words.map((word): Filter => {
    const fieldClauses = eligible.map(
      (path): Filter => [
        path,
        "Fuzzy",
        word,
        { max_edit_distance: maxEditDistance, case_sensitive: false },
      ]
    )
    return mergeFilters(fieldClauses, "Or")!
  })

  const combinator =
    input.search_options?.match_strategy === "any" ? "Or" : "And"
  return mergeFilters(wordClauses, combinator)
}

function boostWithTypoTolerance(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan,
  rankBy: RankBy
): RankBy {
  return [
    "Sum",
    [
      rankBy,
      ["Product", TYPO_TOLERANCE_RANK_WEIGHT, fuzzyMatchFilter(input, plan)],
    ],
  ] as RankBy
}

export function buildQueryFilters(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan
): Filter | undefined {
  const semanticRatio = vectorSemanticRatio(input)
  const includeTextMatch = !input.search_options?.vector || semanticRatio === 0
  const text = includeTextMatch
    ? textMatchFilter(
        input.q,
        input.q ? searchableFields(input, plan) : [],
        input.search_options?.match_strategy
      )
    : undefined
  const match =
    includeTextMatch && applyTypoTolerance(input)
      ? mergeFilters([text, fuzzyMatchFilter(input, plan)], "Or")
      : text

  return mergeFilters([toSearchFilter(input.filters, plan), match])
}

const DEFAULT_HIGHLIGHT_PRE_TAG = "<mark>"
const DEFAULT_HIGHLIGHT_POST_TAG = "</mark>"
const DEFAULT_HIGHLIGHT_FRAGMENT_LIMIT = 1
const SNIPPET_HIGHLIGHT_FRAGMENT_LIMIT = 3

function hasTextQuery(input: SearchTypes.ProviderSearchQuery): boolean {
  return !!input.q?.trim()
}

function applyTypoTolerance(input: SearchTypes.ProviderSearchQuery): boolean {
  return !!input.search_options?.typo_tolerance && hasTextQuery(input)
}

function resolveHighlightOptions(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan
): SearchTypes.SearchHighlightOptions | undefined {
  const highlight = input.search_options?.highlight
  if (!highlight || !hasTextQuery(input)) {
    return undefined
  }

  if (highlight === true) {
    return { fields: searchableFields(input, plan) }
  }

  return highlight
}

function buildHighlightPlan(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan,
  highlight: SearchTypes.SearchHighlightOptions
): { compute_attributes: ComputeAttributes; highlight: HighlightPlan } {
  if (!highlight.fields.length) {
    fail("Medusa search highlighting requires at least one field")
  }

  const snippet = !!highlight.snippet
  const computeAttributes: ComputeAttributes = {}
  const suffix = matchStrategySuffix(input)
  const rankFragmentsBy = suffix
    ? ["$fragment", "BM25", input.q!, suffix]
    : ["$fragment", "BM25", input.q!]

  const fields = highlight.fields.map((path, index) => {
    const field = plan.fields.get(path)
    if (!field || !isSearchable(field.field)) {
      fail(
        `Search index "${input.index.name}" cannot highlight field "${path}" — it is not searchable`
      )
    }

    const key = `__medusa_highlight_${index}__`
    computeAttributes[key] = [
      "Highlight",
      path,
      {
        fragment_by: snippet ? "sentence" : "none",
        rank_fragments_by: rankFragmentsBy,
        fragment_limit: snippet
          ? SNIPPET_HIGHLIGHT_FRAGMENT_LIMIT
          : DEFAULT_HIGHLIGHT_FRAGMENT_LIMIT,
        include_offsets: "utf-16",
      },
    ]
    return { path, key }
  })

  return {
    compute_attributes: computeAttributes,
    highlight: {
      pre_tag: highlight.pre_tag ?? DEFAULT_HIGHLIGHT_PRE_TAG,
      post_tag: highlight.post_tag ?? DEFAULT_HIGHLIGHT_POST_TAG,
      fields,
    },
  }
}

/**
 * Applies `pre_tag`/`post_tag` markup around a fragment's matched ranges.
 * Offsets come back as `utf-16` (see `buildHighlightPlan`) so they line up
 * with JS string indices without extra decoding.
 */
function tagFragment(
  fragment: HighlightFragment,
  preTag: string,
  postTag: string
): string {
  const ranges = [...(fragment.match_ranges ?? [])].sort((a, b) => b[0] - a[0])
  let text = fragment.text
  for (const [start, end] of ranges) {
    text =
      text.slice(0, start) +
      preTag +
      text.slice(start, end) +
      postTag +
      text.slice(end)
  }
  return text
}

export function parseHighlights(
  row: Row,
  highlight: HighlightPlan | undefined
): Record<string, string[]> | undefined {
  if (!highlight) {
    return undefined
  }

  const result: Record<string, string[]> = {}
  for (const { path, key } of highlight.fields) {
    const fragments = row[key] as HighlightFragment[] | undefined
    if (fragments?.length) {
      result[path] = fragments.map((fragment) =>
        tagFragment(fragment, highlight.pre_tag, highlight.post_tag)
      )
    }
  }

  return Object.keys(result).length ? result : undefined
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

function vectorSemanticRatio(input: SearchTypes.ProviderSearchQuery): number {
  const vector = input.search_options?.vector
  if (!vector) {
    return 0
  }

  if (vector.semantic_ratio !== undefined) {
    return vector.semantic_ratio
  }

  return input.q ? 0.5 : 1
}

function resolveVectorField(
  vector: NonNullable<SearchTypes.SearchOptions["vector"]>,
  plan: IndexPlan,
  indexName: string
): string {
  if (vector.field) {
    const planned = plan.fields.get(vector.field)
    if (!planned || planned.field.type !== "vector") {
      fail(
        `Vector search field "${vector.field}" is not a vector field on search index "${indexName}"`
      )
    }
    return vector.field
  }

  if (plan.vectors.length === 1) {
    return plan.vectors[0]
  }

  fail(
    plan.vectors.length
      ? `search_options.vector.field is required when the index has more than one vector field`
      : `search_options.vector requires a vector field on search index "${indexName}"`
  )
}

function vectorRank(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan
): RankBy {
  const vector = input.search_options!.vector!
  const field = resolveVectorField(vector, plan, input.index.name)
  const planned = plan.fields.get(field)!

  if (vector.value && vector.query) {
    fail(
      "search_options.vector.value and search_options.vector.query are mutually exclusive"
    )
  }

  if (vector.value) {
    if (planned.dimensions && vector.value.length !== planned.dimensions) {
      fail(
        `Vector value for "${field}" expected ${planned.dimensions} dimensions, got ${vector.value.length}`
      )
    }
    return [field, "ANN", vector.value] as RankBy
  }

  const text = vector.query
  if (!text) {
    fail(
      "Vector search requires search_options.vector.value or search_options.vector.query"
    )
  }

  if (!planned.embed) {
    fail(
      `search_options.vector.query requires vector field "${field}" to declare "embed"`
    )
  }

  return [field, "ANN", ["Embed", text]] as RankBy
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
  if (options.locales?.length) {
    fail(
      "Configure Medusa search full-text language on index fields, not per query"
    )
  }
  if (options.min_score !== undefined) {
    fail("Medusa search min_score is not implemented by this provider yet")
  }

  const ordered = attributeRank(input)
  let rankBy: RankBy

  if (options.vector) {
    if (ordered) {
      fail("Vector search cannot also order by an attribute")
    }
    rankBy = vectorRank(input, plan)
    const semanticRatio = vectorSemanticRatio(input)
    if (input.q && semanticRatio < 1) {
      let text = textRank(input, plan)
      if (applyTypoTolerance(input)) {
        text = boostWithTypoTolerance(input, plan, text)
      }
      rankBy =
        semanticRatio === 0
          ? text
          : ([
              "Sum",
              [
                ["Product", 1 - semanticRatio, text],
                ["Product", semanticRatio, rankBy],
              ],
            ] as RankBy)
    }
  } else if (input.q) {
    // Text matching is a filter (ContainsAllTokens). Attribute order is a
    // hard sort over those matches. Soft BM25+attribute boosting exists in
    // the engine but is not what pagination.order means.
    if (ordered) {
      rankBy = ordered
    } else {
      rankBy = textRank(input, plan)
      if (applyTypoTolerance(input)) {
        rankBy = boostWithTypoTolerance(input, plan, rankBy)
      }
    }
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

  const highlight = resolveHighlightOptions(input, plan)
  const highlightPlan = highlight
    ? buildHighlightPlan(input, plan, highlight)
    : undefined

  return {
    query: {
      rank_by: rankBy,
      filters: buildQueryFilters(input, plan),
      include_attributes: input.attributes_to_retrieve,
      limit,
      compute_attributes: highlightPlan?.compute_attributes,
    },
    skip,
    take,
    options: providerOptions(input),
    highlight: highlightPlan?.highlight,
  }
}
