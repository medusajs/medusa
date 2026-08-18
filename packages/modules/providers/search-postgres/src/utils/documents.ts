import { SearchTypes } from "@medusajs/framework/types"
import {
  extractPrimaryKeyFilter,
  MedusaError,
  projectDocument,
  readDocumentPath,
  searchValueToBoolean,
  searchValueToNumber,
  setDocumentPath,
} from "@medusajs/framework/utils"
import { IndexPlan, PlannedField, weightLabel } from "./plan"

// Path flattening, projection and primary-key extraction live in
// @medusajs/utils so every provider collapses documents identically.
export { extractPrimaryKeyFilter, projectDocument }

function fail(message: string): never {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
}

function coerce(value: unknown, planned: PlannedField): unknown {
  switch (planned.kind) {
    case "number":
      return searchValueToNumber(value, planned.is_date)
    case "boolean":
      return searchValueToBoolean(value)
    case "text":
    case "keyword":
      return typeof value === "string" ? value : String(value)
    case "vector":
      return value
    default:
      return value
  }
}

function coerceVector(
  value: unknown,
  planned: PlannedField
): number[] | undefined {
  if (!Array.isArray(value)) {
    fail(
      `Vector field "${planned.path}" must be a numeric array of length ${planned.dimensions}`
    )
  }

  const nums = value.map((entry) => Number(entry))
  if (nums.some((n) => Number.isNaN(n))) {
    fail(`Vector field "${planned.path}" contains non-numeric components`)
  }

  if (planned.dimensions && nums.length !== planned.dimensions) {
    fail(
      `Vector field "${planned.path}" expected ${planned.dimensions} dimensions, got ${nums.length}`
    )
  }

  return nums
}

/**
 * Projects a source document onto the indexed shape used for filters and FTS,
 * and returns the primary key plus the searchable plain-text blob and vectors.
 */
export function projectIndexedDocument(
  document: SearchTypes.SearchDocument,
  plan: IndexPlan
): {
  id: string
  indexed: Record<string, unknown>
  search_text: string
  weighted_parts: { text: string; weight: "A" | "B" | "C" | "D" }[]
  vectors: Record<string, number[]>
} {
  const indexed: Record<string, any> = {}
  const textParts: string[] = []
  const weighted_parts: { text: string; weight: "A" | "B" | "C" | "D" }[] = []
  const vectors: Record<string, number[]> = {}

  for (const planned of plan.fields.values()) {
    const values = readDocumentPath(document, planned.path.split(".")).filter(
      (value) => value !== undefined && value !== null
    )

    if (!values.length) {
      continue
    }

    if (planned.kind === "vector") {
      const embedding = coerceVector(values[0], planned)
      if (embedding) {
        vectors[planned.path] = embedding
      }
      continue
    }

    const coerced = values
      .map((value) => coerce(value, planned))
      .filter((value) => value !== undefined)

    if (!coerced.length) {
      continue
    }

    const value = planned.is_array ? coerced : coerced[0]
    setDocumentPath(indexed, planned.path, value)

    if (
      planned.kind === "text" ||
      planned.kind === "keyword" ||
      (planned.kind === "number" && !planned.is_date)
    ) {
      const asText = (Array.isArray(value) ? value : [value])
        .map((entry) => String(entry))
        .join(" ")

      if (
        planned.field.searchable === true ||
        typeof planned.field.searchable === "object"
      ) {
        textParts.push(asText)
        weighted_parts.push({
          text: asText,
          weight: weightLabel(planned.field.searchable),
        })
      }
    }
  }

  const primaryKey = document[plan.primary_key]

  if (primaryKey === undefined || primaryKey === null || primaryKey === "") {
    fail(
      `A document written to the postgres search provider is missing its primary key "${plan.primary_key}"`
    )
  }

  return {
    id: String(primaryKey),
    indexed,
    search_text: textParts.join(" "),
    weighted_parts,
    vectors,
  }
}
