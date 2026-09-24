import { SearchTypes } from "@medusajs/types"
import {
  getCallerFilePath,
  isFileDisabled,
  MEDUSA_SKIP_FILE,
} from "../common"

/**
 * Declares a search index. Like `defineLink`, the file registers itself on
 * import: the application loads every file under `search/` and hands what was
 * registered to the Search Module as its `indexes` option, so the module has one
 * input rather than a registry and an option that can disagree.
 *
 * `fields` must be a schema from `search.define({ ... })`. The documents
 * `seed` yields are type-checked against the declared fields.
 */
export function defineSearchIndex<
  Fields extends SearchTypes.SearchIndexFieldsInput
>(
  definition: SearchTypes.SearchIndexDefinitionInput<Fields>
): SearchTypes.SearchIndexDefinition {
  const callerFilePath = getCallerFilePath()

  if (isFileDisabled(callerFilePath ?? "")) {
    return { [MEDUSA_SKIP_FILE]: true } as any
  }

  const normalized: SearchTypes.SearchIndexDefinition = {
    ...definition,
    fields: normalizeFields(definition.fields),
  }

  global.MedusaModule.setSearchIndex(normalized, callerFilePath ?? undefined)

  return normalized
}

/**
 * Compiles a `search.define(...)` schema into plain SearchFieldDefinition
 * records. Normalization happens here, at the declaration boundary, so the
 * Search Module only ever sees plain definitions and nothing user-facing
 * calls `toFields()`.
 *
 * The input type advertises `toFields()` structurally, so normalization
 * duck-types on it rather than checking for our own class — a schema built by
 * a duplicated copy of @medusajs/utils, or any object honoring the contract,
 * still normalizes.
 */
function normalizeFields(
  fields: SearchTypes.SearchIndexFieldsInput
): Record<string, SearchTypes.SearchFieldDefinition> {
  if (typeof fields?.toFields !== "function") {
    throw new Error(
      "`defineSearchIndex` fields must come from `search.define({ ... })`"
    )
  }

  return fields.toFields()
}
