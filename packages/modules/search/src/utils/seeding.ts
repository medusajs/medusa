import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  SearchIndexContext,
  SearchIndexRegistry,
  SearchIndexSeedAction,
  SearchIndexSeedReason,
  SearchIndexSyncRecord,
  SearchSeedRuntime,
} from "@types"
import { randomUUID } from "crypto"
import {
  assertTaskAccepted,
  DEFAULT_REINDEX_BATCH_SIZE,
  retrieveIndexDefinition,
  SearchIndexState,
  SearchSyncStatus,
} from "./index"
import { shadowIndexName } from "./migrations"

/** Only the pieces `withIndexLock` reads. */
type LockContext = Pick<SearchIndexContext, "locking" | "logger">

/** Only the pieces the sync-history helpers read. */
type SyncContext = Pick<SearchIndexContext, "indexService" | "syncService">

/* -------------------------------- planning -------------------------------- */

/**
 * Which indexes need data, and where it goes. A drifted definition is filled into
 * its replacement and swapped in; otherwise an index needs seeding if it was never
 * filled, its last attempt failed, or it holds nothing — the last catching an
 * engine that lost its data while the record still says ready.
 */
export async function createSeedPlan(
  context: SearchIndexRegistry
): Promise<SearchIndexSeedAction[]> {
  const definitions = Object.values(context.indexes)

  if (!definitions.length) {
    return []
  }

  const records = await context.indexService.list(
    { name: definitions.map((definition) => definition.name) },
    { take: null }
  )

  const byName = new Map(records.map((record) => [record.name, record]))
  const actions: SearchIndexSeedAction[] = []

  for (const definition of definitions) {
    const record = byName.get(definition.name)

    // No record means the index was never migrated, so there is nothing to fill.
    // Creating one is a migration's job, not a booting app's.
    if (!record) {
      continue
    }

    if (record.definition_hash !== definition.definition_hash) {
      const swap = !!context.providers.retrieve(definition.provider).swapIndex

      actions.push({
        index: definition.name,
        target_physical_name: swap
          ? shadowIndexName(definition)
          : definition.physical_name,
        swap,
        reason: "schema_changed",
      })

      continue
    }

    if (record.status === SearchIndexState.ERROR) {
      actions.push(inPlace(definition, "last_run_failed"))
      continue
    }

    if (record.status !== SearchIndexState.READY) {
      actions.push(inPlace(definition, "index_created"))
      continue
    }

    if ((await countDocuments(context, definition)) === 0) {
      actions.push(inPlace(definition, "index_empty"))
    }
  }

  return actions
}

function inPlace(
  definition: SearchTypes.ResolvedSearchIndexDefinition,
  reason: SearchIndexSeedReason
): SearchIndexSeedAction {
  return {
    index: definition.name,
    target_physical_name: definition.physical_name,
    swap: false,
    reason,
  }
}

/* -------------------------------- execution ------------------------------- */

export async function executeSeedPlan(
  context: SearchSeedRuntime & LockContext,
  actions: SearchIndexSeedAction[]
): Promise<void> {
  for (const action of actions) {
    const definition = retrieveIndexDefinition(context.indexes, action.index)

    // One instance per index. Without this every replica in a rolling deploy
    // would seed the same index at the same time.
    await withIndexLock(context, definition.name, async () => {
      await runSeed(context, { definition, action })
    })
  }
}

async function runSeed(
  context: SearchSeedRuntime,
  {
    definition,
    action,
  }: {
    definition: SearchTypes.ResolvedSearchIndexDefinition
    action: SearchIndexSeedAction
  }
): Promise<void> {
  const provider = context.providers.retrieve(definition.provider)
  const record = await retrieveRecord(context, definition.name)
  const sync = await startSync(context, { record })

  await context.indexService.update({
    selector: { id: record.id },
    data: { status: SearchIndexState.BUILDING },
  })

  try {
    // A rebuild without a swap has to bring the live index up to the new schema
    // first, which may empty it. Nothing else can be done on a provider with no
    // alias support.
    if (!action.swap) {
      await provider.upsertIndex({ index: definition })
    }

    const { documents_synced } = await streamSeed(context, {
      index: definition,
      sync_id: sync.id,
      target_index: action.target_physical_name,
      last_key: sync.last_key ?? undefined,
    })

    if (action.swap) {
      await provider.swapIndex!({
        alias: definition.physical_name,
        index: action.target_physical_name,
      })
    }

    await completeSync(context, { sync_id: sync.id, documents_synced })

    await context.indexService.update({
      selector: { id: record.id },
      data: {
        status: SearchIndexState.READY,
        definition_hash: definition.definition_hash,
      },
    })
  } catch (error) {
    await failSync(context, {
      sync_id: sync.id,
      record_id: record.id,
      error,
    })
    throw error
  }
}

/* ------------------------------- reindexing ------------------------------- */

/**
 * Rebuilds on demand, recording a `SearchIndexSync` row per index up front so a
 * run is visible in flight and stays in the history after.
 *
 * `swap` seeds a replacement and aliases over on success, so the live index keeps
 * serving and a failure changes nothing. Providers without `swapIndex` fall back
 * to `in_place`, as does any run scoped by `filters` — swapping in an index built
 * from a subset would drop everything outside it.
 */
export async function reindexIndexes(
  context: SearchSeedRuntime,
  input: SearchTypes.SearchReindexInput = {}
): Promise<SearchTypes.SearchReindexResult> {
  const names = input.index
    ? Array.isArray(input.index)
      ? input.index
      : [input.index]
    : Object.keys(context.indexes)

  const definitions = names.map((name) =>
    retrieveIndexDefinition(context.indexes, name)
  )
  const jobId = randomUUID()

  await persistRecords(context, definitions)

  for (const definition of definitions) {
    await reindexOne(context, { definition, jobId, input })
  }

  return { job_id: jobId, indexes: names }
}

async function reindexOne(
  context: SearchSeedRuntime,
  {
    definition,
    jobId,
    input,
  }: {
    definition: SearchTypes.ResolvedSearchIndexDefinition
    jobId: string
    input: SearchTypes.SearchReindexInput
  }
): Promise<void> {
  const provider = context.providers.retrieve(definition.provider)
  const record = await retrieveRecord(context, definition.name)
  const sync = await startSync(context, {
    record,
    jobId,
    filters: input.filters,
  })

  // A partial rebuild must never swap: the replacement would only hold the
  // filtered slice, so aliasing over would delete everything else.
  const useSwap =
    (input.strategy ?? "swap") === "swap" &&
    !!provider.swapIndex &&
    !input.filters

  const target = useSwap
    ? shadowIndexName(definition)
    : definition.physical_name

  await context.indexService.update({
    selector: { id: record.id },
    data: { status: SearchIndexState.BUILDING },
  })

  try {
    if (useSwap) {
      await provider.upsertIndex({
        index: { ...definition, physical_name: target },
      })
    } else if (!input.filters) {
      // A full rebuild with no alias to hide behind: bring the live index up to
      // the current definition before refilling it. A no-op when the schema
      // already matches; when it does not, a provider that cannot alter in place
      // will recreate the index, leaving it briefly empty. That is the cost of
      // migrating without alias support.
      await provider.upsertIndex({ index: definition })
    }
    // A partial rebuild deliberately skips the upsert. It only produces some of
    // the documents, so it must never be allowed to recreate the index — and a
    // schema change cannot be migrated by a partial run.

    const { documents_synced } = await streamSeed(context, {
      index: definition,
      sync_id: sync.id,
      target_index: target,
      filters: input.filters,
      last_key: sync.last_key ?? undefined,
    })

    if (useSwap) {
      await provider.swapIndex!({
        alias: definition.physical_name,
        index: target,
      })
    }

    await completeSync(context, { sync_id: sync.id, documents_synced })

    await context.indexService.update({
      selector: { id: record.id },
      data: {
        status: SearchIndexState.READY,
        definition_hash: definition.definition_hash,
      },
    })
  } catch (error) {
    // Leave the replacement behind on failure; the live one is untouched.
    await failSync(context, { sync_id: sync.id, record_id: record.id, error })
    throw error
  }
}

/* -------------------------------- streaming ------------------------------- */

// Streams one index' `seed` in, advancing the sync row's `last_key` per batch so
// an interrupted run resumes rather than restarting.
async function streamSeed(
  context: SearchSeedRuntime,
  {
    index,
    sync_id,
    target_index,
    filters,
    last_key,
  }: {
    index: SearchTypes.ResolvedSearchIndexDefinition
    sync_id: string
    target_index: string
    filters?: Record<string, unknown>
    last_key?: string
  }
): Promise<{ documents_synced: number }> {
  const provider = context.providers.retrieve(index.provider)
  const batchSize =
    context.options.reindex?.batch_size ?? DEFAULT_REINDEX_BATCH_SIZE

  let buffer: SearchTypes.SearchDocument[] = []
  let synced = 0

  const flush = async () => {
    if (!buffer.length) {
      return
    }

    const batch = buffer
    buffer = []

    const task = await provider.upsertDocuments({
      index: target_index,
      documents: batch,
    })

    // Per batch rather than once at the end: it bounds how much can be in
    // flight, and the swap that follows depends on all of it having landed.
    assertTaskAccepted(task, index.name)
    await settle(context, index, task)

    synced += batch.length

    await context.syncService.update({
      selector: { id: sync_id },
      data: {
        documents_synced: synced,
        last_key: batch[batch.length - 1][index.primary_key] as string,
      },
    })
  }

  for await (const documents of index.seed({
    container: context.container,
    index,
    filters,
    last_key,
  })) {
    for (const document of documents) {
      buffer.push(document)

      if (buffer.length >= batchSize) {
        await flush()
      }
    }
  }

  await flush()

  return { documents_synced: synced }
}

// Blocks until a write lands. Not optional here: a `swap` puts the new index in
// front of reads, so its documents have to be in it first.
async function settle(
  context: Pick<SearchIndexContext, "providers">,
  definition: SearchTypes.ResolvedSearchIndexDefinition,
  task: SearchTypes.SearchTask
): Promise<void> {
  const provider = context.providers.retrieve(definition.provider)

  if (!provider.waitForTask || task.status === "succeeded") {
    return
  }

  assertTaskAccepted(await provider.waitForTask(task), definition.name)
}

/* ------------------------------ sync records ------------------------------ */

// Opens a sync row, cancelling any earlier unfinished one and inheriting its
// `last_key` so an interrupted run resumes.
async function startSync(
  context: SyncContext,
  {
    record,
    jobId,
    filters,
  }: {
    record: { id: string; name: string }
    jobId?: string
    filters?: Record<string, unknown>
  }
): Promise<SearchIndexSyncRecord> {
  const resumable = await findResumableSync(context, record.name)

  if (resumable) {
    await context.syncService.update({
      selector: { id: resumable.id },
      data: { status: SearchSyncStatus.CANCELED },
    })
  }

  const [sync] = await context.syncService.create([
    {
      search_index_id: record.id,
      job_id: jobId ?? randomUUID(),
      status: SearchSyncStatus.PROCESSING,
      filters: filters ?? null,
      last_key: resumable?.last_key ?? null,
      started_at: new Date(),
    },
  ])

  return sync as SearchIndexSyncRecord
}

async function completeSync(
  context: Pick<SearchIndexContext, "syncService">,
  {
    sync_id,
    documents_synced,
  }: { sync_id: string; documents_synced: number }
): Promise<void> {
  await context.syncService.update({
    selector: { id: sync_id },
    data: {
      status: SearchSyncStatus.DONE,
      documents_synced,
      completed_at: new Date(),
    },
  })
}

async function failSync(
  context: SyncContext,
  {
    sync_id,
    record_id,
    error,
  }: { sync_id: string; record_id: string; error: Error }
): Promise<void> {
  await context.syncService.update({
    selector: { id: sync_id },
    data: {
      status: SearchSyncStatus.FAILED,
      error: error.message,
      completed_at: new Date(),
    },
  })

  await context.indexService.update({
    selector: { id: record_id },
    data: { status: SearchIndexState.ERROR },
  })
}

// The most recent unfinished run for an index, if any.
async function findResumableSync(
  context: SyncContext,
  indexName: string
): Promise<SearchIndexSyncRecord | undefined> {
  const [record] = await context.indexService.list({ name: indexName })

  if (!record) {
    return undefined
  }

  const [sync] = await context.syncService.list(
    {
      search_index_id: record.id,
      status: [SearchSyncStatus.PENDING, SearchSyncStatus.PROCESSING],
    },
    { order: { created_at: "DESC" }, take: 1 }
  )

  return sync as SearchIndexSyncRecord | undefined
}

/* --------------------------------- helpers -------------------------------- */

async function countDocuments(
  context: Pick<SearchIndexContext, "providers">,
  definition: SearchTypes.ResolvedSearchIndexDefinition
): Promise<number> {
  const indexes = await context.providers
    .retrieve(definition.provider)
    .listIndexes()

  return (
    indexes.find((info) => info.name === definition.physical_name)
      ?.document_count ?? 0
  )
}

async function withIndexLock<T>(
  context: LockContext,
  name: string,
  job: () => Promise<T>
): Promise<T | undefined> {
  if (!context.locking) {
    return await job()
  }

  try {
    return await context.locking.execute(`search:seed:${name}`, job)
  } catch (error) {
    // Another instance holds the lock and is doing the work.
    context.logger.info(`[Search] Skipping seed of "${name}": ${error.message}`)
    return undefined
  }
}

// Creates the `SearchIndex` row for any definition that has none yet.
async function persistRecords(
  context: Pick<SearchIndexContext, "indexService">,
  definitions: SearchTypes.ResolvedSearchIndexDefinition[]
): Promise<void> {
  if (!definitions.length) {
    return
  }

  const records = await context.indexService.list(
    { name: definitions.map((definition) => definition.name) },
    { take: null }
  )

  const known = new Set(records.map((record) => record.name))
  const missing = definitions.filter(
    (definition) => !known.has(definition.name)
  )

  if (missing.length) {
    await context.indexService.create(
      missing.map((definition) => ({
        name: definition.name,
        provider: definition.provider,
        status: SearchIndexState.PENDING,
        definition_hash: definition.definition_hash,
      }))
    )
  }
}

async function retrieveRecord(
  context: Pick<SearchIndexContext, "indexService">,
  name: string
): Promise<any> {
  const [record] = await context.indexService.list({ name })

  if (!record) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `No persisted search index record for "${name}"`
    )
  }

  return record
}
