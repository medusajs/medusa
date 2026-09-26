import { SearchTypes } from "@medusajs/framework/types"
import {
  SearchIndexRecord,
  SearchIndexRegistry,
  SearchIndexVersionRecord,
} from "@types"
import { SearchIndexState } from "./index"

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
 * or a reindex builds a new version, so versions earlier builds left behind
 * don't pile up: building v6 while v5 serves reads leaves v5 and v6 standing
 * and takes everything under them.
 *
 * The version that was active until the last swap is deliberately kept: another
 * process can still be serving reads off it until its active-version cache
 * catches up, so it only goes once the next build starts.
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

  await deleteVersions(
    context,
    versions.filter((version) => version.version < activeVersion)
  )
}

/**
 * Drops every version above the active one that a run already started filling
 * and never swapped in. Runs once a reindex has created the version it builds,
 * which the startup seed then prefers, so nothing would ever resume these.
 *
 * Callers must hold the index's seed lock: it is what guarantees no other
 * process is still filling one of them. A version nothing started filling yet
 * is left alone, since it may be a migration's, waiting for its first seed.
 */
export async function cleanupAbandonedVersions(
  context: Pick<SearchIndexRegistry, "providers" | "versionService" | "logger">,
  record: SearchIndexRecord
): Promise<void> {
  const activeVersion = record.active_version ?? 0

  const versions = (await context.versionService.list(
    { search_index_id: record.id },
    { take: null }
  )) as SearchIndexVersionRecord[]

  await deleteVersions(
    context,
    versions.filter(
      (version) =>
        version.version > activeVersion &&
        (version.status === SearchIndexState.BUILDING ||
          version.status === SearchIndexState.ERROR)
    )
  )
}

/**
 * Drops what a swap to `activeVersion` left behind: every version below it
 * except `previousVersion`, which other processes may still read from until
 * their active-version cache catches up. Nothing ever makes a version below
 * the active one active again, so without this they wait for the next build.
 *
 * Callers must hold the index's seed lock. Never throws: the swap it follows
 * has already happened, and failing to drop a stale index must not undo it.
 */
export async function cleanupAfterSwap(
  context: Pick<SearchIndexRegistry, "providers" | "versionService" | "logger">,
  {
    record_id,
    active_version: activeVersion,
    previous_version: previousVersion,
  }: {
    record_id: string
    active_version: number
    previous_version: number | null
  }
): Promise<void> {
  try {
    const versions = (await context.versionService.list(
      { search_index_id: record_id },
      { take: null }
    )) as SearchIndexVersionRecord[]

    await deleteVersions(
      context,
      versions.filter(
        (version) =>
          version.version < activeVersion && version.version !== previousVersion
      )
    )
  } catch (error) {
    context.logger.warn(
      `[Search] Cannot clean up after swapping in version ${activeVersion}: ${error.message}`
    )
  }
}

/**
 * Removes a logical index outright: every physical index ever built for it,
 * then the record tracking them.
 */
export async function dropIndex(
  context: Pick<
    SearchIndexRegistry,
    "providers" | "indexService" | "versionService" | "logger"
  >,
  name: string
): Promise<void> {
  const [record] = (await context.indexService.list({
    name,
  })) as SearchIndexRecord[]

  if (!record) {
    return
  }

  const versions = (await context.versionService.list(
    { search_index_id: record.id },
    { take: null }
  )) as SearchIndexVersionRecord[]

  const failed = await deleteVersions(context, versions)

  if (failed.length) {
    context.logger.warn(
      `[Search] Keeping the record for search index "${name}": ${failed.length} of its ${versions.length} version(s) could not be removed, so the next migration plans the drop again`
    )
    return
  }

  await context.indexService.softDelete([record.id])
}

/**
 * Deletes each version's physical index and then its record. Returns the ones
 * it could not delete: failing to drop a stale index is never worth failing the
 * migration or reindex that triggered it, and the record surviving is what
 * makes the next run retry it.
 */
async function deleteVersions(
  context: Pick<SearchIndexRegistry, "providers" | "versionService" | "logger">,
  versions: SearchIndexVersionRecord[]
): Promise<SearchIndexVersionRecord[]> {
  const failed: SearchIndexVersionRecord[] = []

  for (const version of versions) {
    try {
      const provider = context.providers.retrieve(version.provider)

      await provider.deleteIndex({ index: version.physical_name })
      // Soft delete: a hard delete would violate the foreign key from any
      // `SearchIndexSync` row still pointing at this version's append-only
      // history.
      await context.versionService.softDelete([version.id])
    } catch (error) {
      failed.push(version)
      context.logger.warn(
        `[Search] Cannot delete search index "${version.physical_name}": ${error.message}`
      )
    }
  }

  return failed
}
