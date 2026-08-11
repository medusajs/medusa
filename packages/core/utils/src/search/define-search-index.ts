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
 */
export function defineSearchIndex(
  definition: SearchTypes.SearchIndexDefinition
): SearchTypes.SearchIndexDefinition {
  const callerFilePath = getCallerFilePath()

  if (isFileDisabled(callerFilePath ?? "")) {
    return { [MEDUSA_SKIP_FILE]: true } as any
  }

  global.MedusaModule.setSearchIndex(definition, callerFilePath ?? undefined)

  return definition
}
