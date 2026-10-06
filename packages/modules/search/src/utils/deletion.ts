import { SearchTypes } from "@medusajs/framework/types"
import {
  SearchIndexContext,
  SearchIndexRecord,
  SearchIndexRegistry,
  SearchIndexVersionRecord,
} from "@types"
import { retrieveIndexDefinition } from "./index"

type DeletionContext = SearchIndexRegistry &
  Pick<SearchIndexContext, "syncService" | "locking" | "activeVersionCache">

/**
 * Drops every physical index ever built for a logical index and hard deletes the
 * rows behind them, so the next migration plans a `create` and rebuilds from
 * version 1. Soft deleting would leave the numbering to carry on instead.
 */
export async function deleteIndexEntirely(
  context: DeletionContext,
  name: string
): Promise<SearchTypes.SearchIndexDeleteResult> {
  retrieveIndexDefinition(context.indexes, name)

  // The lock a seed and a reindex take, so this cannot land halfway through one.
  if (context.locking) {
    return await context.locking.execute(`search:seed:${name}`, () =>
      deleteOne(context, name)
    )
  }

  return await deleteOne(context, name)
}

async function deleteOne(
  context: DeletionContext,
  name: string
): Promise<SearchTypes.SearchIndexDeleteResult> {
  const [record] = (await context.indexService.list(
    { name },
    { take: 1, withDeleted: true }
  )) as SearchIndexRecord[]

  if (!record) {
    return { index: name, deleted_versions: 0 }
  }

  // `withDeleted` throughout: a version an earlier cleanup soft deleted still
  // owns a row and a physical index, and leaving either behind is what this is
  // meant to avoid.
  const versions = (await context.versionService.list(
    { search_index_id: record.id },
    { take: null, withDeleted: true }
  )) as SearchIndexVersionRecord[]

  for (const version of versions) {
    try {
      const provider = context.providers.retrieve(version.provider)

      await provider.deleteIndex({ index: version.physical_name })
    } catch (error) {
      // The rows go either way: keeping them for an index the engine may no
      // longer have is what stops it from ever being rebuilt.
      context.logger.warn(
        `[Search] Cannot drop physical search index "${version.physical_name}": ${error.message}`
      )
    }
  }

  const versionIds = versions.map((version) => version.id)

  if (versionIds.length) {
    const syncs = (await context.syncService.list(
      { search_index_version_id: versionIds },
      { take: null, select: ["id"], withDeleted: true }
    )) as { id: string }[]

    if (syncs.length) {
      await context.syncService.delete(syncs.map((sync) => sync.id))
    }

    await context.versionService.delete(versionIds)
  }

  await context.indexService.delete([record.id])

  await context.activeVersionCache?.invalidate()

  return { index: name, deleted_versions: versions.length }
}
