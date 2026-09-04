import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  SearchIndexContext,
  SearchIndexRecord,
  SearchIndexRegistry,
  SearchIndexSeedAction,
  SearchIndexSeedReason,
  SearchIndexSyncRecord,
  SearchIndexVersionRecord,
  SearchSeedRuntime,
} from "@types"
import { randomUUID } from "crypto"
import {
  assertTaskAccepted,
  DEFAULT_REINDEX_BATCH_SIZE,
  listVersionsByIndexId,
  retrieveIndexDefinition,
  SearchIndexState,
  SearchSyncStatus,
} from "./index"
import { versionPhysicalName } from "./migrations"

type LockContext = Pick<SearchIndexContext, "locking" | "logger">
type SyncContext = Pick<SearchIndexContext, "syncService">

/** How often a long seed reports how many documents it has written. */
const PROGRESS_LOG_INTERVAL_MS = 10_000

/* -------------------------------- planning -------------------------------- */

/**
 * Which indexes need data, and which version it goes into. The highest version
 * above the active one is what a migration built for a schema or provider
 * change; it needs filling and then becoming active. Otherwise an index needs
 * seeding in place if its active version was never filled, its last attempt
 * failed, or it holds nothing — the last catching an engine that lost its data
 * while the record still says ready.
 */
export async function createSeedPlan(
  context: SearchIndexRegistry
): Promise<SearchIndexSeedAction[]> {
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
  const actions: SearchIndexSeedAction[] = []

  for (const definition of definitions) {
    const record = byName.get(definition.name)

    // No record means the index was never migrated, so there is nothing to fill.
    // Creating one is a migration's job, not a booting app's.
    if (!record) {
      continue
    }

    const versions = versionsByIndexId.get(record.id) ?? []

    const pending = versions
      .filter(
        (version) =>
          record.active_version == null ||
          version.version > record.active_version
      )
      .sort((a, b) => b.version - a.version)[0]

    if (pending) {
      actions.push({
        index: definition.name,
        target_version: pending,
        swap: true,
        reason: "schema_changed",
      })
      continue
    }

    const activeVersion = versions.find(
      (version) => version.version === record.active_version
    )

    if (!activeVersion) {
      continue
    }

    if (activeVersion.status === SearchIndexState.ERROR) {
      actions.push(inPlace(definition, activeVersion, "last_run_failed"))
      continue
    }

    if (activeVersion.status !== SearchIndexState.READY) {
      actions.push(inPlace(definition, activeVersion, "index_created"))
      continue
    }

    if (
      (await countDocuments(
        context,
        definition,
        activeVersion.physical_name
      )) === 0
    ) {
      actions.push(inPlace(definition, activeVersion, "index_empty"))
    }
  }

  return actions
}

function inPlace(
  definition: SearchTypes.ResolvedSearchIndexDefinition,
  version: SearchIndexVersionRecord,
  reason: SearchIndexSeedReason
): SearchIndexSeedAction {
  return {
    index: definition.name,
    target_version: version,
    swap: false,
    reason,
  }
}

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
  const target = action.target_version
  const sync = await startSync(context, { versionId: target.id })
  const startedAt = Date.now()

  context.logger.info(
    `[Search] Seeding "${definition.name}" (${action.reason}) into "${
      target.physical_name
    }"${formatResume(sync.last_key)}`
  )

  await context.versionService.update({
    selector: { id: target.id },
    data: { status: SearchIndexState.BUILDING },
  })

  try {
    const { documents_synced } = await streamSeed(context, {
      index: definition,
      sync_id: sync.id,
      target_index: target.physical_name,
      last_key: sync.last_key ?? undefined,
    })

    await catchUp(context, {
      definition,
      target,
      since: sync.started_at!,
      jobId: sync.job_id!,
    })

    await context.versionService.update({
      selector: { id: target.id },
      data: { status: SearchIndexState.READY },
    })

    if (action.swap) {
      context.logger.info(
        `[Search] Making "${definition.name}" version ${target.version} active`
      )
      await context.indexService.update({
        selector: { name: definition.name },
        data: { active_version: target.version },
      })
      context.activeVersionCache?.set(definition.name, {
        physical_name: target.physical_name,
        provider: target.provider,
        version: target.version,
      })
    }

    await completeSync(context, { sync_id: sync.id, documents_synced })

    context.logger.info(
      `[Search] Seeded "${definition.name}": ${formatCount(
        documents_synced
      )} in ${formatElapsed(Date.now() - startedAt)}`
    )
  } catch (error) {
    await failSync(context, {
      sync_id: sync.id,
      version_id: target.id,
      error,
    })
    throw error
  }
}

// A second seed pass, filtered to what changed since the first one started —
// catches a live write the bulk pass's own snapshot could otherwise miss or
// revert, including a delete (`streamSeed` applies whatever mutations `seed`
// yields, in order). Runs once, into the same target, right before the
// version is considered ready.
async function catchUp(
  context: SearchSeedRuntime,
  {
    definition,
    target,
    since,
    jobId,
  }: {
    definition: SearchTypes.ResolvedSearchIndexDefinition
    target: SearchIndexVersionRecord
    since: Date
    jobId: string
  }
): Promise<void> {
  // Shares the bulk pass' `job_id` — same logical run, a second sync row.
  const sync = await startSync(context, { versionId: target.id, jobId })

  context.logger.info(
    `[Search] Catching up "${definition.name}" on changes since ${since.toISOString()}`
  )

  try {
    const { documents_synced } = await streamSeed(context, {
      index: definition,
      sync_id: sync.id,
      target_index: target.physical_name,
      catchup: { since },
    })

    await completeSync(context, { sync_id: sync.id, documents_synced })
  } catch (error) {
    await failSync(context, { sync_id: sync.id, version_id: target.id, error })
    throw error
  }
}

export async function reindexIndexes(
  context: SearchSeedRuntime & LockContext,
  input: SearchTypes.SearchReindexInput = {}
): Promise<SearchTypes.SearchReindexResult> {
  const names = input.index
    ? Array.isArray(input.index)
      ? input.index
      : [input.index]
    : [...context.indexes.keys()]

  const definitions = names.map((name) =>
    retrieveIndexDefinition(context.indexes, name)
  )
  const jobId = randomUUID()

  for (const definition of definitions) {
    // Same lock boot seeding takes, so a reindex never races a startup seed
    // (or another reindex) on the same index. Unlike boot, an explicit reindex
    // must not quietly skip — the caller asked for work to happen.
    if (context.locking) {
      await context.locking.execute(`search:seed:${definition.name}`, () =>
        reindexOne(context, { definition, jobId, input })
      )
    } else {
      await reindexOne(context, { definition, jobId, input })
    }
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
  const record = await retrieveIndexRecord(context, definition.name)

  // A partial rebuild must never swap: the replacement would only hold the
  // filtered slice, so making it active would drop everything else.
  const useSwap = (input.strategy ?? "swap") === "swap" && !input.filters

  const target = useSwap
    ? await createPendingVersion(context, { definition, record, provider })
    : await retrieveActiveVersion(context, { definition, record })

  const sync = await startSync(context, {
    versionId: target.id,
    jobId,
    filters: input.filters,
  })
  const startedAt = Date.now()

  context.logger.info(
    `[Search] Reindexing "${definition.name}" into "${
      target.physical_name
    }"${formatResume(sync.last_key)}`
  )

  await context.versionService.update({
    selector: { id: target.id },
    data: { status: SearchIndexState.BUILDING },
  })

  try {
    // A fresh version has nothing to discard. Rebuilding in place does, so a
    // record the new seed stream doesn't re-emit (a deleted row, say) doesn't
    // survive as stale data — but only for a full rebuild: `input.filters`
    // selects source records for the seed, not search-engine filter syntax,
    // so it can't be reused to delete a matching subset here. And skip this
    // entirely when resuming an interrupted run, since the target already
    // holds that run's progress.
    if (!useSwap && !sync.last_key && !input.filters) {
      const clearTask = await provider.clearIndex({ index: target.physical_name })

      assertTaskAccepted(clearTask, definition.name)
      await settle(context, definition, clearTask)
    }

    const { documents_synced } = await streamSeed(context, {
      index: definition,
      sync_id: sync.id,
      target_index: target.physical_name,
      filters: input.filters,
      last_key: sync.last_key ?? undefined,
    })

    // Skipped for a filtered reindex: it's already a narrow, caller-scoped
    // rebuild, and catching up on everything changed since would silently
    // do more than asked.
    if (!input.filters) {
      await catchUp(context, {
        definition,
        target,
        since: sync.started_at!,
        jobId,
      })
    }

    await context.versionService.update({
      selector: { id: target.id },
      data: { status: SearchIndexState.READY },
    })

    if (useSwap) {
      context.logger.info(
        `[Search] Making "${definition.name}" version ${target.version} active`
      )
      await context.indexService.update({
        selector: { id: record.id },
        data: { active_version: target.version },
      })
      context.activeVersionCache?.set(definition.name, {
        physical_name: target.physical_name,
        provider: target.provider,
        version: target.version,
      })
    }

    await completeSync(context, { sync_id: sync.id, documents_synced })

    context.logger.info(
      `[Search] Reindexed "${definition.name}": ${formatCount(
        documents_synced
      )} in ${formatElapsed(Date.now() - startedAt)}`
    )
  } catch (error) {
    // Leave the new version behind on failure; the active one is untouched.
    await failSync(context, { sync_id: sync.id, version_id: target.id, error })
    throw error
  }
}

/** Builds a brand-new version, whether or not the definition actually drifted. */
async function createPendingVersion(
  context: Pick<SearchIndexContext, "versionService">,
  {
    definition,
    record,
    provider,
  }: {
    definition: SearchTypes.ResolvedSearchIndexDefinition
    record: SearchIndexRecord
    provider: SearchTypes.ISearchProvider
  }
): Promise<SearchIndexVersionRecord> {
  const versions = (await context.versionService.list(
    { search_index_id: record.id },
    { order: { version: "DESC" }, take: 1 }
  )) as SearchIndexVersionRecord[]

  const version = (versions[0]?.version ?? record.active_version ?? 0) + 1
  const physicalName = versionPhysicalName(definition, version)

  await provider.upsertIndex({
    index: { ...definition, physical_name: physicalName },
  })

  const [created] = (await context.versionService.create([
    {
      search_index_id: record.id,
      version,
      provider: definition.provider,
      physical_name: physicalName,
      definition_hash: definition.definition_hash,
      status: SearchIndexState.PENDING,
    },
  ])) as SearchIndexVersionRecord[]

  return created
}

async function retrieveActiveVersion(
  context: Pick<SearchIndexContext, "versionService">,
  {
    definition,
    record,
  }: {
    definition: SearchTypes.ResolvedSearchIndexDefinition
    record: SearchIndexRecord
  }
): Promise<SearchIndexVersionRecord> {
  if (record.active_version == null) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `Search index "${definition.name}" has no active version to reindex in place`
    )
  }

  const [active] = (await context.versionService.list({
    search_index_id: record.id,
    version: record.active_version,
  })) as SearchIndexVersionRecord[]

  return active
}

/* -------------------------------- streaming ------------------------------- */

// Streams one index' `seed` in, advancing the sync row's `last_key` per batch so
// an interrupted run resumes rather than restarting. `seed` yields mutations
// (not bare documents), so a delete is applied directly, in order — flushing
// any buffered upserts first so it isn't reordered ahead of them.
async function streamSeed(
  context: SearchSeedRuntime,
  {
    index,
    sync_id,
    target_index,
    filters,
    last_key,
    catchup,
  }: {
    index: SearchTypes.ResolvedSearchIndexDefinition
    sync_id: string
    target_index: string
    filters?: Record<string, unknown>
    last_key?: string
    catchup?: { since: Date }
  }
): Promise<{ documents_synced: number }> {
  const provider = context.providers.retrieve(index.provider)
  const batchSize =
    context.options.reindex?.batch_size ?? DEFAULT_REINDEX_BATCH_SIZE

  let buffer: SearchTypes.SearchDocument[] = []
  let synced = 0
  let lastKey: string | undefined
  const startedAt = Date.now()
  let lastLoggedAt = startedAt
  let lastLoggedCount = 0

  const reportProgress = (force = false) => {
    const now = Date.now()
    if (
      !force &&
      (synced === lastLoggedCount ||
        now - lastLoggedAt < PROGRESS_LOG_INTERVAL_MS)
    ) {
      return
    }

    const elapsedMs = now - startedAt
    const elapsedSec = Math.max(elapsedMs / 1000, 0.001)
    const rate = Math.round(synced / elapsedSec)
    const cursor = lastKey ? `, last key ${lastKey}` : ""

    context.logger.info(
      `[Search] "${index.name}": ${formatCount(synced)} synced in ${formatElapsed(
        elapsedMs
      )} (${rate}/s)${cursor}`
    )
    lastLoggedAt = now
    lastLoggedCount = synced
  }

  const flushUpserts = async () => {
    if (!buffer.length) {
      return
    }

    const batch = buffer
    buffer = []

    const task = await provider.upsertDocuments({
      index: target_index,
      definition: index,
      documents: batch,
    })

    // Per batch rather than once at the end: it bounds how much can be in
    // flight, and a swap that follows depends on all of it having landed.
    assertTaskAccepted(task, index.name)
    await settle(context, index, task)

    synced += batch.length
    lastKey = batch[batch.length - 1][index.primary_key] as string

    await context.syncService.update({
      selector: { id: sync_id },
      data: {
        documents_synced: synced,
        last_key: lastKey,
      },
    })

    // First flush so a long seed is visibly moving; then at most every 10s.
    reportProgress(lastLoggedCount === 0)
  }

  const applyDelete = async (deleteFilters: SearchTypes.SearchFilters) => {
    await flushUpserts()

    const task = await provider.deleteDocuments({
      index: target_index,
      filters: deleteFilters,
    })

    assertTaskAccepted(task, index.name)
    await settle(context, index, task)
  }

  for await (const mutations of index.seed({
    container: context.container,
    index,
    filters,
    last_key,
    catchup,
  })) {
    for (const mutation of mutations) {
      if (mutation.action === "delete") {
        await applyDelete(mutation.filters)
        continue
      }

      for (const document of mutation.documents) {
        buffer.push(document)

        if (buffer.length >= batchSize) {
          await flushUpserts()
        }
      }
    }
  }

  await flushUpserts()

  return { documents_synced: synced }
}

// Blocks until a write lands. Not optional here: a swap puts the new version
// in front of reads, so its documents have to be in it first.
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
    versionId,
    jobId,
    filters,
  }: {
    versionId: string
    jobId?: string
    filters?: Record<string, unknown>
  }
): Promise<SearchIndexSyncRecord> {
  const resumable = await findResumableSync(context, versionId)

  if (resumable) {
    await context.syncService.update({
      selector: { id: resumable.id },
      data: { status: SearchSyncStatus.CANCELED },
    })
  }

  const [sync] = await context.syncService.create([
    {
      search_index_version_id: versionId,
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
  { sync_id, documents_synced }: { sync_id: string; documents_synced: number }
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
  context: Pick<SearchIndexContext, "versionService" | "syncService">,
  {
    sync_id,
    version_id,
    error,
  }: { sync_id: string; version_id: string; error: Error }
): Promise<void> {
  await context.syncService.update({
    selector: { id: sync_id },
    data: {
      status: SearchSyncStatus.FAILED,
      error: error.message,
      completed_at: new Date(),
    },
  })

  await context.versionService.update({
    selector: { id: version_id },
    data: { status: SearchIndexState.ERROR },
  })
}

// The most recent unfinished run for a version, if any.
async function findResumableSync(
  context: SyncContext,
  versionId: string
): Promise<SearchIndexSyncRecord | undefined> {
  const [sync] = await context.syncService.list(
    {
      search_index_version_id: versionId,
      status: [SearchSyncStatus.PENDING, SearchSyncStatus.PROCESSING],
    },
    { order: { created_at: "DESC" }, take: 1 }
  )

  return sync as SearchIndexSyncRecord | undefined
}

/* --------------------------------- helpers -------------------------------- */

function formatCount(count: number): string {
  return `${count.toLocaleString("en-US")} document${count === 1 ? "" : "s"}`
}

function formatElapsed(ms: number): string {
  const seconds = Math.max(0, Math.round(ms / 1000))
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  if (minutes < 60) {
    return rest ? `${minutes}m ${rest}s` : `${minutes}m`
  }

  const hours = Math.floor(minutes / 60)
  const minutesRest = minutes % 60
  return minutesRest ? `${hours}h ${minutesRest}m` : `${hours}h`
}

function formatResume(lastKey: string | null | undefined): string {
  return lastKey ? `, resuming after ${lastKey}` : ""
}

async function countDocuments(
  context: Pick<SearchIndexContext, "providers">,
  definition: SearchTypes.ResolvedSearchIndexDefinition,
  physicalName: string
): Promise<number> {
  const indexes = await context.providers
    .retrieve(definition.provider)
    .listIndexes()

  return (
    indexes.find((info) => info.name === physicalName)?.document_count ?? 0
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

async function retrieveIndexRecord(
  context: Pick<SearchIndexContext, "indexService">,
  name: string
): Promise<SearchIndexRecord> {
  const [record] = (await context.indexService.list({
    name,
  })) as SearchIndexRecord[]

  if (!record) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Search index "${name}" has no record; run migrations to create it`
    )
  }

  return record
}
