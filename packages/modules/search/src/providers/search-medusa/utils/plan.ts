import { SearchTypes } from "@medusajs/framework/types"
import {
  MedusaError,
  readDocumentPath,
  setDocumentPath,
} from "@medusajs/framework/utils"
import type { AttributeSchema, AttributeSchemaConfig, Row } from "./api-types"
import type {
  MedusaSearchFieldOptions,
  MedusaSearchIndexOptions,
} from "./options"

export type PlannedField = {
  path: string
  type: string
  is_array: boolean
  is_date: boolean
  field: SearchTypes.SearchFieldDefinition
}

export type TypoToleranceSettings = {
  enabled: boolean
  min_word_size_for_one_typo: number
  min_word_size_for_two_typos: number
  disabled_on_attributes: Set<string>
}

export type IndexPlan = {
  fields: Map<string, PlannedField>
  schema: Record<string, AttributeSchema>
  searchable: string[]
  primary_key: string
  options: MedusaSearchIndexOptions
  typo_tolerance: TypoToleranceSettings
}

function fail(message: string): never {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
}

// Inspired by Meilisearch's own typo-tolerance defaults.
const DEFAULT_MIN_WORD_SIZE_FOR_ONE_TYPO = 5
const DEFAULT_MIN_WORD_SIZE_FOR_TWO_TYPOS = 9

function resolveTypoTolerance(
  settings: SearchTypes.SearchIndexSettings
): TypoToleranceSettings {
  const typo = settings.typo_tolerance
  return {
    enabled: typo?.enabled ?? true,
    min_word_size_for_one_typo:
      typo?.min_word_size_for_one_typo ?? DEFAULT_MIN_WORD_SIZE_FOR_ONE_TYPO,
    min_word_size_for_two_typos:
      typo?.min_word_size_for_two_typos ?? DEFAULT_MIN_WORD_SIZE_FOR_TWO_TYPOS,
    disabled_on_attributes: new Set(typo?.disabled_on_attributes ?? []),
  }
}

export function isSearchable(
  field: SearchTypes.SearchFieldDefinition
): boolean {
  return field.searchable === true || typeof field.searchable === "object"
}

export function isFacetable(field: SearchTypes.SearchFieldDefinition): boolean {
  return field.facetable === true || typeof field.facetable === "object"
}

function providerOptions<T>(value: {
  provider_options?: Record<string, Record<string, unknown>>
}): T {
  return (value.provider_options?.["search-medusa"] ?? {}) as T
}

function fieldType(
  field: SearchTypes.SearchFieldDefinition,
  isArray: boolean
): string {
  const array = isArray ? "[]" : ""

  switch (field.type) {
    case "keyword":
    case "text":
      return `${array}string`
    case "integer":
      return `${array}int`
    case "float":
      return `${array}float`
    case "boolean":
      return `${array}bool`
    case "date":
      return `${array}datetime`
    case "vector":
      if (isArray) {
        fail("Medusa search vector fields cannot be arrays")
      }
      if (!field.dimensions || field.dimensions < 1) {
        fail("Medusa search vector fields must declare positive dimensions")
      }
      return `[${field.dimensions}]f32`
    case "geo":
      return fail("The Medusa search provider does not support geo fields")
    default:
      return fail(
        `The Medusa search provider does not support fields of type "${field.type}"`
      )
  }
}

export function assertIndexSupported(
  definition: SearchTypes.ResolvedSearchIndexDefinition
): void {
  const walk = (
    group: Record<string, SearchTypes.SearchFieldDefinition>,
    prefix: string
  ) => {
    for (const [name, field] of Object.entries(group)) {
      const path = prefix ? `${prefix}.${name}` : name

      if (field.correlated) {
        fail(
          `The Medusa search provider cannot correlate predicates per array element ("${path}")`
        )
      }

      if (field.type === "object") {
        if (field.fields) {
          walk(field.fields, path)
        }
        continue
      }

      fieldType(field, !!field.array)
    }
  }

  if (definition.settings.synonyms) {
    fail("The Medusa search provider does not support synonyms")
  }
  if (definition.settings.stop_words?.length) {
    fail("The Medusa search provider does not support custom stop-word lists")
  }

  walk(definition.fields, "")
}

export function buildIndexPlan(
  definition: SearchTypes.ResolvedSearchIndexDefinition
): IndexPlan {
  assertIndexSupported(definition)

  const fields = new Map<string, PlannedField>()
  const schema: Record<string, AttributeSchema> = {}
  const searchable: string[] = []
  const typoTolerance = resolveTypoTolerance(definition.settings)

  const walk = (
    group: Record<string, SearchTypes.SearchFieldDefinition>,
    prefix: string,
    inArray: boolean
  ) => {
    for (const [name, field] of Object.entries(group)) {
      const path = prefix ? `${prefix}.${name}` : name
      const isArray = inArray || field.array === true

      if (field.type === "object") {
        if (field.fields) {
          walk(field.fields, path, isArray)
        }
        continue
      }

      const configured = providerOptions<MedusaSearchFieldOptions>(field)
      const type = configured.type ?? fieldType(field, isArray)
      const searchableField = isSearchable(field)
      const indexed =
        field.filterable ||
        field.sortable ||
        isFacetable(field) ||
        path === definition.primary_key

      const attribute: AttributeSchemaConfig = {
        type,
        filterable: configured.filterable ?? !!indexed,
      }

      if (field.type === "vector") {
        attribute.ann = configured.ann ?? true
      }

      if (searchableField) {
        attribute.full_text_search = configured.full_text_search ?? true
        searchable.push(path)

        // Typo tolerance needs a fuzzy index on the field it matches
        // against — built by default alongside full-text search unless the
        // index or the field opts out.
        if (
          typoTolerance.enabled &&
          !typoTolerance.disabled_on_attributes.has(path)
        ) {
          attribute.fuzzy = true
        }
      }

      // Glob is an exact-string wildcard index. Keywords that are
      // filtered/sorted/faceted get it by default; text fields only if
      // opted in. `id` is the Cloud document key and cannot carry one.
      if (path !== "id") {
        if (configured.glob !== undefined) {
          attribute.glob = configured.glob
        } else if (indexed && field.type === "keyword") {
          attribute.glob = true
        }
      }
      if (configured.regex !== undefined) {
        attribute.regex = configured.regex
      }
      if (configured.fuzzy !== undefined) {
        attribute.fuzzy = configured.fuzzy
      }

      schema[path] = attribute
      fields.set(path, {
        path,
        type,
        is_array: isArray,
        is_date: field.type === "date",
        field,
      })
    }
  }

  walk(definition.fields, "", false)

  return {
    fields,
    schema,
    searchable,
    primary_key: definition.primary_key,
    options: providerOptions<MedusaSearchIndexOptions>(definition.settings),
    typo_tolerance: typoTolerance,
  }
}

function coerce(value: unknown, planned: PlannedField): unknown {
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (planned.is_date && typeof value === "string") {
    return new Date(value).toISOString()
  }
  return value
}

export function toSearchDocument(
  document: SearchTypes.SearchDocument,
  plan: IndexPlan
): Row {
  const target: Record<string, unknown> = {}

  for (const planned of plan.fields.values()) {
    const values = readDocumentPath(document, planned.path.split("."))
      .map((value) => coerce(value, planned))
      .filter((value) => value !== undefined)

    if (values.length) {
      target[planned.path] = planned.is_array ? values : values[0]
    }
  }

  const primaryKey = document[plan.primary_key]
  if (primaryKey === undefined || primaryKey === null || primaryKey === "") {
    fail(
      `A document written to Medusa search is missing primary key "${plan.primary_key}"`
    )
  }

  const id = String(primaryKey)
  if (Buffer.byteLength(id, "utf8") > 64) {
    fail(`Medusa search document IDs cannot exceed 64 bytes ("${id}")`)
  }

  target.id = id
  return target as Row
}

export function fromSearchDocument(
  row: Row,
  attributes: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const path of attributes) {
    const value = row[path]
    if (value !== undefined) {
      setDocumentPath(result, path, value)
    }
  }

  return result
}

export function sameSchemaType(
  current: Record<string, AttributeSchemaConfig>,
  desired: Record<string, AttributeSchema>
): boolean {
  for (const [path, schema] of Object.entries(desired)) {
    const desiredType =
      typeof schema === "string"
        ? schema
        : (schema as AttributeSchemaConfig).type
    if (current[path] && current[path].type !== desiredType) {
      return false
    }
  }

  return Object.keys(current).every((path) => path in desired)
}
