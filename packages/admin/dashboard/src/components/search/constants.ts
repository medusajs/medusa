import { getSearchEntityNames } from "../../lib/search/search-entities"

/**
 * Areas shown in the search filter dropdown: the static areas (`all`,
 * `command`, `navigation`, which are not backed by `/admin/search`) plus every
 * registered dynamic search entity.
 */
export function getSearchAreas(): string[] {
  const entities = getSearchEntityNames()
  return ["all", ...entities, "command", "navigation"]
}

export const DEFAULT_SEARCH_LIMIT = 3
export const SEARCH_LIMIT_INCREMENT = 20
