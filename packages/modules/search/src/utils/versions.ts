import { SearchTypes } from "@medusajs/framework/types"
import {
  SearchIndexRecord,
  SearchIndexRegistry,
  SearchIndexVersionRecord,
} from "@types"

/**
 * The physical index a version is built under. Every version — including the
 * first — gets one, so `definition.physical_name` is never itself a physical
 * index: it is only virtual index name
 */
export function versionPhysicalName(
  definition: SearchTypes.ResolvedSearchIndexDefinition,
  version: number
): string {
  return `${definition.physical_name}_v${version}`
}

/**
 * Drops every version below the one currently serving reads — the physical
 * index in the engine and the record pointing at it. Runs before a migration
 * or a reindex. Eg. building v6 while v5 serves reads keeps only v5 and v6.
 *
 */
export async function cleanupStaleVersions(
  context: Pick<SearchIndexRegistry, "providers" | "versionService" | "logger">,
  record: SearchIndexRecord
): Promise<void> {
  const activeVersion = record.active_version

  if (activeVersion == null) {
    return
  }

  const versions = (await context.versionService.list(
    { search_index_id: record.id },
    { take: null }
  )) as SearchIndexVersionRecord[]

  for (const version of versions.filter((v) => v.version < activeVersion)) {
    try {
      const provider = context.providers.retrieve(version.provider)

      await provider.deleteIndex({ index: version.physical_name })
      await context.versionService.softDelete([version.id])
    } catch (error) {
      context.logger.warn(
        `[Search] Cannot clean up search index version "${version.physical_name}": ${error.message}`
      )
    }
  }
}
