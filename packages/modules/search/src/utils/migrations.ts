import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { SearchIndexRegistry } from "@types"
import { retrieveIndexDefinition, SearchIndexState } from "./index"

/**
 * The index a schema change is built into. Derived from the definition hash rather
 * than a job id, so a migration and the boot that finishes it agree on the name
 * without persisting it, and an interrupted build is resumed rather than orphaned.
 */
export function shadowIndexName(
  definition: SearchTypes.ResolvedSearchIndexDefinition
): string {
  // `physical_name` already carries the module's index prefix, so appending the
  // schema fingerprint is enough — the prefix never has to be passed in.
  return `${definition.physical_name}_${definition.definition_hash.slice(0, 8)}`
}

const SHADOW_SUFFIX = /^_[a-f0-9]{8}$/

/**
 * True when `name` is a swap shadow of `livePhysicalName` (`{live}_{8 hex}`),
 * and not a different index that merely shares a prefix (`product_reviews`).
 */
export function isShadowIndexName(
  name: string,
  livePhysicalName: string
): boolean {
  if (!name.startsWith(livePhysicalName)) {
    return false
  }

  return SHADOW_SUFFIX.test(name.slice(livePhysicalName.length))
}

export async function createIndexMigrationPlan(
  context: SearchIndexRegistry
): Promise<SearchTypes.SearchIndexMigrationAction[]> {
  const definitions = [...context.indexes.values()]

  if (!definitions.length) {
    return []
  }

  const records = await context.indexService.list(
    { name: definitions.map((definition) => definition.name) },
    { take: null }
  )

  const byName = new Map(records.map((record) => [record.name, record]))

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
        physical_name: definition.physical_name,
      }
    }

    // A provider change with an untouched schema drifts too: the hash still
    // matches, but no physical index exists on the new provider yet.
    if (
      record.definition_hash === definition.definition_hash &&
      record.provider === definition.provider
    ) {
      return {
        ...shared,
        action: "noop" as const,
        physical_name: definition.physical_name,
      }
    }

    const provider = context.providers.retrieve(definition.provider)
    const providerChanged = record.provider !== definition.provider

    return {
      ...shared,
      action: "migrate" as const,
      // With an alias, build the new schema alongside and swap it in once
      // seeded. Without one there is nowhere to build, so the live index is
      // replaced and stays empty until the seed at application start.
      physical_name: provider.swapIndex
        ? shadowIndexName(definition)
        : definition.physical_name,
      live_physical_name: definition.physical_name,
      live_definition_hash: record.definition_hash,
      provider: definition.provider,
      ...(providerChanged ? { previous_provider: record.provider } : {}),
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
      continue
    }

    const definition = retrieveIndexDefinition(context.indexes, action.index)
    const provider = context.providers.retrieve(definition.provider)

    if (action.action === "create") {
      await provider.upsertIndex({ index: definition })

      await context.indexService.create([
        {
          name: definition.name,
          provider: definition.provider,
          // Created but not filled; the seed at startup makes it ready.
          status: SearchIndexState.PENDING,
          definition_hash: definition.definition_hash,
        },
      ])

      continue
    }

    await provider.upsertIndex({
      index: { ...definition, physical_name: action.physical_name },
    })

    // The record deliberately keeps the old hash — that mismatch is what tells
    // application start there is a seed to finish. But when the build replaced
    // the live index rather than standing beside it, the index now holds
    // nothing, so the record should stop claiming it is ready.
    if (action.physical_name === action.live_physical_name) {
      await context.indexService.update({
        selector: { name: definition.name },
        data: { status: SearchIndexState.PENDING },
      })
    }

    await cleanupPreviousProviderIndex(context, action)
  }
}

type MigrateAction = Extract<
  SearchTypes.SearchIndexMigrationAction,
  { action: "migrate" }
>

async function cleanupPreviousProviderIndex(
  context: SearchIndexRegistry,
  action: MigrateAction
): Promise<void> {
  if (!action.previous_provider) {
    return
  }

  let previous: SearchTypes.ISearchProvider
  try {
    previous = context.providers.retrieve(action.previous_provider)
  } catch (error) {
    if (
      error instanceof MedusaError &&
      error.type === MedusaError.Types.NOT_FOUND
    ) {
      context.logger.warn(
        `[Search] Cannot clean up previous search provider "${action.previous_provider}" for index "${action.index}": it is no longer registered`
      )
      return
    }

    throw error
  }

  const names = new Set<string>([action.live_physical_name])

  for (const info of await previous.listIndexes()) {
    if (isShadowIndexName(info.name, action.live_physical_name)) {
      names.add(info.name)
    }
  }

  for (const name of names) {
    await previous.deleteIndex({ index: name })
  }
}
