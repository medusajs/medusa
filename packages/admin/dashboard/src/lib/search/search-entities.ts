import { TFunction } from "i18next"
import { DynamicSearchResultItem } from "../../components/search/types"
import { DEFAULT_SEARCH_ENTITIES } from "./default-search-entities"

export type SearchEntityTransform<TItem = any> = (
  item: TItem
) => DynamicSearchResultItem

/**
 * The `t` signature handed to `groupLabel` functions. Intentionally wider than
 * i18next's `TFunction`: custom entities translate with keys the dashboard's
 * typed resources don't know about.
 */
export type SearchLabelTranslator = (
  key: string,
  options?: Record<string, unknown>
) => string

export type SearchEntityDefinition<TItem = any> = {
  /**
   * Group heading shown in the search palette.
   * - omitted → `t("app.search.groups.<name>")`, falling back to the entity name
   * - string → used as-is (plain label)
   * - function → called with the i18n `t` function
   */
  groupLabel?: string | ((t: SearchLabelTranslator) => string)
  transform: SearchEntityTransform<TItem>
}

/**
 * Seeded with the built-in commerce set when this module is evaluated.
 * Registering an entity requires importing this module, so the defaults are in
 * place before any app or plugin registration runs — regardless of how the app
 * entry was bundled. `defineSearchEntity` replaces in place and
 * `clearSearchEntities` empties the map, with no ordering caveats.
 */
const searchEntities = new Map<string, SearchEntityDefinition>(
  Object.entries(DEFAULT_SEARCH_ENTITIES)
)

let customized = false

/**
 * Registers (or replaces) a searchable entity for the admin global search.
 *
 * Apps and plugins can call this from `src/admin/search-entities.tsx` to add
 * custom entities or override built-in transforms. Use {@link clearSearchEntities}
 * first when replacing the default commerce set entirely.
 *
 * @example
 * ```tsx
 * import { defineSearchEntity } from "@medusajs/dashboard/lib"
 *
 * defineSearchEntity("organization", {
 *   groupLabel: "Organizations",
 *   transform: (org) => ({
 *     id: org.id,
 *     title: org.name,
 *     subtitle: org.billing_email,
 *     to: `/organizations/${org.id}`,
 *     value: `organization:${org.id}`,
 *   }),
 * })
 * ```
 */
export function defineSearchEntity<TItem = any>(
  name: string,
  definition: SearchEntityDefinition<TItem>
) {
  searchEntities.set(name, definition)
  customized = true
}

/**
 * Removes every registered search entity, including the built-in commerce set.
 * Call before re-registering a custom set when the default entities should not
 * appear in admin search.
 */
export function clearSearchEntities() {
  searchEntities.clear()
  customized = true
}

/**
 * Whether an app or plugin has changed the registry. While untouched, the
 * search UI lets `/admin/search` decide what "all areas" covers (engine-only
 * when the Search Module is enabled) instead of enumerating the defaults.
 */
export function isSearchRegistryCustomized(): boolean {
  return customized
}

export function getSearchEntity(
  name: string
): SearchEntityDefinition | undefined {
  return searchEntities.get(name)
}

export function getSearchEntityNames(): string[] {
  return [...searchEntities.keys()]
}

export function hasSearchEntity(name: string): boolean {
  return searchEntities.has(name)
}

export function resolveSearchEntityGroupLabel(
  name: string,
  t: TFunction | SearchLabelTranslator
): string {
  const translate = t as SearchLabelTranslator
  const definition = searchEntities.get(name)
  const label = definition?.groupLabel

  if (typeof label === "function") {
    return label(translate)
  }

  if (typeof label === "string") {
    return label
  }

  // Custom entities usually have no translation for the conventional key, so
  // show the entity name rather than the raw key.
  return translate(`app.search.groups.${name}`, { defaultValue: name })
}
