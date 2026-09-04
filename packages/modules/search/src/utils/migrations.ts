import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  SearchIndexRecord,
  SearchIndexRegistry,
  SearchIndexVersionRecord,
} from "@types"
import {
  listVersionsByIndexId,
  retrieveIndexDefinition,
  SearchIndexState,
} from "./index"

/**
 * The physical index a version is built under. Every version — including the
 * first — gets one, so `definition.physical_name` is never itself a physical
 * index: it is only the root every version's name is derived from.
 */
export function versionPhysicalName(
  definition: SearchTypes.ResolvedSearchIndexDefinition,
  version: number
): string {
  return `${definition.physical_name}_v${version}`
}

export async function createIndexMigrationPlan(
  context: SearchIndexRegistry
): Promise<SearchTypes.SearchIndexMigrationAction[]> {
  const definitions = [...context.indexes.values()]

  if (!definitions.length) {
    return []
  }

  const records = (await context.indexService.list(
    { name: definitions.map((definition) => definition.name) },
    { take: null }
  )) as SearchIndexRecord[]

  const byName = new Map(records.map((record) => [record.name, record]))
  const versionsByIndexId = await listVersionsByIndexId(
    context,
    records.map((record) => record.id)
  )

  return definitions.map((definition) => {
    const record = byName.get(definition.name)
    const shared = {
      index: definition.name,
      definition_hash: definition.definition_hash,
    }

    if (!record) {
      return {
        ...shared,
        action: "create" as const,
        physical_name: versionPhysicalName(definition, 1),
        version: 1,
      }
    }

    const versions = versionsByIndexId.get(record.id) ?? []
    const activeVersion =
      record.active_version != null
        ? versions.find((v) => v.version === record.active_version)
        : undefined

    if (
      activeVersion &&
      activeVersion.definition_hash === definition.definition_hash &&
      activeVersion.provider === definition.provider
    ) {
      return {
        ...shared,
        action: "noop" as const,
        physical_name: activeVersion.physical_name,
      }
    }

    // Already building or built, waiting to be seeded — nothing new to plan.
    const pending = versions.find(
      (v) =>
        (record.active_version == null || v.version > record.active_version) &&
        v.definition_hash === definition.definition_hash &&
        v.provider === definition.provider
    )

    if (pending) {
      return {
        ...shared,
        action: "noop" as const,
        physical_name: pending.physical_name,
      }
    }

    const highest = versions[0]?.version ?? 0
    const version = highest + 1
    const physicalName = versionPhysicalName(definition, version)

    if (!activeVersion) {
      // A `SearchIndex` row exists — an earlier `create` ran — but nothing
      // ever went live, so this is still a `create`, not a `migrate`.
      return {
        ...shared,
        action: "create" as const,
        physical_name: physicalName,
        version,
      }
    }

    return {
      ...shared,
      action: "migrate" as const,
      physical_name: physicalName,
      version,
      active_physical_name: activeVersion.physical_name,
      active_definition_hash: activeVersion.definition_hash,
      provider: definition.provider,
      ...(activeVersion.provider !== definition.provider
        ? { previous_provider: activeVersion.provider }
        : {}),
    }
  })
}

// Note: Seeding data is done by the application start hook, migrations are reserved for schema changes.
export async function executeIndexMigrationPlan(
  context: SearchIndexRegistry,
  actions: SearchTypes.SearchIndexMigrationAction[]
): Promise<void> {
  for (const action of actions) {
    if (action.action === "noop") {
      // Nothing changed for this index, but a version below the active one —
      // left behind by an earlier migration's swap — still needs cleaning up.
      // That cannot wait for the index to drift again.
      const record = await getOrCreateIndexRecord(context, action.index)
      await cleanupStaleVersions(context, record)
      continue
    }

    const definition = retrieveIndexDefinition(context.indexes, action.index)
    const provider = context.providers.retrieve(definition.provider)

    await provider.upsertIndex({
      index: { ...definition, physical_name: action.physical_name },
    })

    const record = await getOrCreateIndexRecord(context, definition.name)

    await context.versionService.create([
      {
        search_index_id: record.id,
        version: action.version,
        provider: definition.provider,
        physical_name: action.physical_name,
        definition_hash: action.definition_hash,
        // Built but not filled; the seed at startup makes it ready.
        status: SearchIndexState.PENDING,
      },
    ])

    await cleanupStaleVersions(context, record)
  }
}

async function getOrCreateIndexRecord(
  context: SearchIndexRegistry,
  name: string
): Promise<SearchIndexRecord> {
  const [existing] = (await context.indexService.list({
    name,
  })) as SearchIndexRecord[]

  if (existing) {
    return existing
  }

  const [created] = (await context.indexService.create([
    { name, active_version: null },
  ])) as SearchIndexRecord[]

  return created
}

/**
 * Deletes every version older than the one currently serving reads. Runs on
 * every migration, not only when the provider changes — versions that lost
 * the swap on a previous migration accumulate otherwise.
 */
async function cleanupStaleVersions(
  context: SearchIndexRegistry,
  record: SearchIndexRecord
): Promise<void> {
  if (record.active_version == null) {
    return
  }

  const versions = ((await context.versionService.list({
    search_index_id: record.id,
  })) as SearchIndexVersionRecord[]).filter(
    (version) => version.version < record.active_version!
  )

  for (const version of versions) {
    let provider: SearchTypes.ISearchProvider

    try {
      provider = context.providers.retrieve(version.provider)
    } catch (error) {
      if (
        error instanceof MedusaError &&
        error.type === MedusaError.Types.NOT_FOUND
      ) {
        context.logger.warn(
          `[Search] Cannot clean up search index version "${version.physical_name}": provider "${version.provider}" is no longer registered`
        )
        continue
      }

      throw error
    }

    await provider.deleteIndex({ index: version.physical_name })
    // Soft delete: a hard delete would violate the foreign key from any
    // `SearchIndexSync` row still pointing at this version's append-only
    // history.
    await context.versionService.softDelete([version.id])
  }
}
