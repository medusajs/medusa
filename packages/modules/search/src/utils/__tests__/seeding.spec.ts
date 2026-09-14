import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  SearchIndexSeedAction,
  SearchIndexSyncRecord,
  SearchIndexVersionRecord,
} from "@types"
import { SearchIndexState, SearchSyncStatus } from "../index"
import { createSeedPlan, executeSeedPlan, reindexIndexes } from "../seeding"

type Mutation =
  | { action: "upsert"; documents: Record<string, unknown>[] }
  | { action: "delete"; filters: Record<string, unknown> }

type SeedFn = (
  context: SearchTypes.SearchSeedContext
) => AsyncGenerator<Mutation[]>

const definition = (
  name: string,
  seed: SeedFn
): SearchTypes.ResolvedSearchIndexDefinition =>
  ({
    name,
    entity: name,
    provider: "test",
    physical_name: name,
    definition_hash: "abcdef0123456789abcdef0123456789",
    primary_key: "id",
    fields: { id: { type: "keyword", filterable: true } },
    settings: {},
    seed,
  } as unknown as SearchTypes.ResolvedSearchIndexDefinition)

/**
 * A context over in-memory records, close enough to the real services for the
 * bookkeeping these tests are about: sync rows are ordered by creation and
 * queried the way `startSync` queries them.
 */
const buildContext = ({
  indexes,
  locking,
  upsertDocuments,
  deleteDocuments,
  documentCounts,
}: {
  indexes: SearchTypes.ResolvedSearchIndexDefinition[]
  locking?: {
    execute: jest.Mock
  }
  upsertDocuments?: jest.Mock
  deleteDocuments?: jest.Mock
  rateLimit?: {
    max_retries?: number
    initial_delay?: number
    max_delay?: number
  }
  // What the engine reports it holds, keyed by physical index name. Only the
  // planner asks, and only to tell an index that lost its data apart from one
  // that merely failed part-way through.
  documentCounts?: Record<string, number>
}) => {
  const records = indexes.map((index, position) => ({
    id: `idx_${position + 1}`,
    name: index.name,
    active_version: 1,
  }))

  const versions: SearchIndexVersionRecord[] = indexes.map(
    (index, position) => ({
      id: `ver_${position + 1}`,
      search_index_id: `idx_${position + 1}`,
      version: 1,
      provider: "test",
      physical_name: `${index.name}_v1`,
      definition_hash: index.definition_hash,
      status: SearchIndexState.PENDING,
    })
  )

  const syncs: (SearchIndexSyncRecord & { sequence: number })[] = []
  let sequence = 0

  const matches = (
    row: SearchIndexSyncRecord,
    filter: Record<string, any> = {}
  ) =>
    Object.entries(filter).every(([field, expected]) =>
      Array.isArray(expected)
        ? expected.includes(row[field])
        : row[field] === expected
    )

  const syncService = {
    list: jest.fn(async (filter: any = {}, config: any = {}) => {
      const found = syncs
        .filter((row) => matches(row, filter))
        .sort((a, b) => b.sequence - a.sequence)

      return config.take ? found.slice(0, config.take) : found
    }),
    create: jest.fn(async (data: Partial<SearchIndexSyncRecord>[]) => {
      const created = data.map((values) => ({
        id: `sync_${syncs.length + 1}`,
        documents_synced: 0,
        last_key: null,
        completed_at: null,
        error: null,
        sequence: ++sequence,
        ...values,
      })) as (SearchIndexSyncRecord & { sequence: number })[]

      syncs.push(...created)
      return created
    }),
    update: jest.fn(async ({ selector, data }: any) => {
      syncs
        .filter((row) => matches(row, selector))
        .forEach((row) => Object.assign(row, data))
    }),
  }

  const versionService = {
    list: jest.fn(async (filter: any = {}) =>
      versions.filter((version) => matches(version as any, filter))
    ),
    create: jest.fn(),
    update: jest.fn(async ({ selector, data }: any) => {
      versions
        .filter((version) => matches(version as any, selector))
        .forEach((version) => Object.assign(version, data))
    }),
  }

  const indexService = {
    list: jest.fn(async (filter: any = {}) =>
      records.filter((record) => matches(record as any, filter))
    ),
    update: jest.fn(),
  }

  const provider = {
    identifier: "test",
    upsertDocuments:
      upsertDocuments ??
      jest.fn().mockResolvedValue({ index: "x", status: "succeeded" }),
    deleteDocuments:
      deleteDocuments ??
      jest.fn().mockResolvedValue({ index: "x", status: "succeeded" }),
    clearIndex: jest
      .fn()
      .mockResolvedValue({ index: "x", status: "succeeded" }),
    upsertIndex: jest.fn().mockResolvedValue(undefined),
    listIndexes: jest.fn().mockResolvedValue(
      Object.entries(documentCounts ?? {}).map(([name, document_count]) => ({
        name,
        document_count,
      }))
    ),
  }

  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  return {
    container: {} as any,
    logger: logger as any,
    options: { reindex: { batch_size: 1 } },
    indexes: new Map(indexes.map((index) => [index.name, index])),
    providers: {
      retrieve: (identifier: string) => {
        if (identifier !== "test") {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `not registered: ${identifier}`
          )
        }
        return provider as unknown as SearchTypes.ISearchProvider
      },
    },
    indexService: indexService as any,
    versionService: versionService as any,
    syncService: syncService as any,
    locking: locking as any,
    // Exposed for assertions rather than being part of the context.
    records,
    versions,
    syncs,
    provider,
    logger_: logger,
  }
}

const seedAction = (
  index: string,
  version: SearchIndexVersionRecord
): SearchIndexSeedAction => ({
  index,
  target_version: version,
  swap: false,
  reason: "index_created",
})

// Passes the job a signal it can abort, the way the Locking Module does.
const lockingThatAborts = (
  abortAfter: (abort: () => void) => void
): { execute: jest.Mock } => ({
  execute: jest.fn(async (_keys, job) => {
    const controller = new AbortController()
    abortAfter(() => controller.abort(new Error("Lost the lock")))
    return await job(controller.signal)
  }),
})

const passthroughLocking = (): { execute: jest.Mock } => ({
  execute: jest.fn(async (_keys, job) => await job(undefined)),
})

const streamOfFour = (cursors: (string | undefined)[]) =>
  definition("product", async function* ({ catchup, last_key }: any) {
    if (catchup) {
      return
    }

    cursors.push(last_key)

    for (const id of ["1", "2", "3", "4"]) {
      if (last_key && id <= last_key) {
        continue
      }
      yield [{ action: "upsert", documents: [{ id }] }]
    }
  })

describe("search index seeding", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when the seed loses its lock", () => {
    const runUntilLockLost = async () => {
      let abort: () => void

      const index = definition("product", async function* ({ catchup }) {
        if (catchup) {
          return
        }

        yield [{ action: "upsert", documents: [{ id: "1" }] }]
        abort!()
        yield [{ action: "upsert", documents: [{ id: "2" }] }]
      })

      const context = buildContext({
        indexes: [index],
        locking: lockingThatAborts((abortFn) => {
          abort = abortFn
        }),
      })

      await executeSeedPlan(context as any, [
        { ...seedAction("product", context.versions[0]), swap: true },
      ])

      return context
    }

    it("should stop writing documents", async () => {
      const context = await runUntilLockLost()

      expect(context.provider.upsertDocuments).toHaveBeenCalledTimes(1)
      expect(context.provider.upsertDocuments).toHaveBeenCalledWith(
        expect.objectContaining({ documents: [{ id: "1" }] })
      )
    })

    it("should stop advancing the sync it no longer owns", async () => {
      const context = await runUntilLockLost()
      const [ours] = context.syncs

      expect(ours.documents_synced).toBe(1)
    })

    it("should not make the version it was filling active", async () => {
      const context = await runUntilLockLost()

      expect(context.indexService.update).not.toHaveBeenCalled()
    })

    it("should leave the version to whoever holds the lock now", async () => {
      const context = await runUntilLockLost()

      // Neither ready (this run didn't finish it) nor error (it isn't broken,
      // and the instance that picked it up may already have finished).
      expect(context.versions[0].status).toEqual(SearchIndexState.BUILDING)
    })

    it("should report it as a lost lock rather than a failure", async () => {
      const context = await runUntilLockLost()

      expect(context.logger_.warn).toHaveBeenCalledWith(
        expect.stringContaining('Seed of "product" lost its lock')
      )
      expect(context.logger_.error).not.toHaveBeenCalled()
    })
  })

  describe("an explicit reindex", () => {
    it("should take the same lock a startup seed takes", async () => {
      const index = definition("product", async function* () {})
      const locking = passthroughLocking()
      const context = buildContext({ indexes: [index], locking })

      await reindexIndexes(context as any, { strategy: "in_place" })

      expect(locking.execute).toHaveBeenCalledWith(
        "search:seed:product",
        expect.any(Function)
      )
    })
  })

  describe("when the lock cannot be acquired", () => {
    it("should skip the index without touching its records", async () => {
      const index = definition("product", async function* () {})
      const context = buildContext({
        indexes: [index],
        locking: {
          execute: jest
            .fn()
            .mockRejectedValue(
              new MedusaError(
                MedusaError.Types.CONFLICT,
                "Timed-out acquiring lock."
              )
            ),
        },
      })

      await executeSeedPlan(context as any, [
        seedAction("product", context.versions[0]),
      ])

      expect(context.logger_.info).toHaveBeenCalledWith(
        expect.stringContaining('Skipping seed of "product"')
      )
      expect(context.logger_.error).not.toHaveBeenCalled()
      expect(context.syncs).toHaveLength(0)
      expect(context.versions[0].status).toEqual(SearchIndexState.PENDING)
    })
  })

  describe("when a seed fails", () => {
    const runFailingSeed = async () => {
      const failing = definition("product", async function* () {
        yield [{ action: "upsert", documents: [{ id: "1" }] }]
      })
      const healthy = definition("variant", async function* ({ catchup }) {
        if (catchup) {
          return
        }

        yield [{ action: "upsert", documents: [{ id: "2" }] }]
      })

      const upsertDocuments = jest.fn(async ({ index }) => {
        if (index === "product_v1") {
          throw new Error("engine rejected the batch")
        }

        return { index, status: "succeeded" }
      })

      const context = buildContext({
        indexes: [failing, healthy],
        locking: passthroughLocking(),
        upsertDocuments,
      })

      await executeSeedPlan(context as any, [
        seedAction("product", context.versions[0]),
        seedAction("variant", context.versions[1]),
      ])

      return context
    }

    it("should report it as an error, not as a skipped index", async () => {
      const context = await runFailingSeed()

      expect(context.logger_.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to seed "product"'),
        expect.any(Error)
      )
      expect(context.logger_.info).not.toHaveBeenCalledWith(
        expect.stringContaining('Skipping seed of "product"')
      )
    })

    it("should record the failure on the version and its sync", async () => {
      const context = await runFailingSeed()

      expect(context.versions[0].status).toEqual(SearchIndexState.ERROR)
      expect(context.syncs[0]).toMatchObject({
        status: SearchSyncStatus.FAILED,
        error: "engine rejected the batch",
      })
    })

    it("should still seed the indexes after it", async () => {
      const context = await runFailingSeed()

      expect(context.versions[1].status).toEqual(SearchIndexState.READY)
    })
  })

  describe("a seed that keeps its lock throughout", () => {
    it("should fill the version, mark it ready and swap it in", async () => {
      const index = definition("product", async function* ({ catchup }) {
        if (catchup) {
          return
        }

        yield [{ action: "upsert", documents: [{ id: "1" }] }]
        yield [{ action: "upsert", documents: [{ id: "2" }] }]
      })

      const context = buildContext({
        indexes: [index],
        locking: passthroughLocking(),
      })

      await executeSeedPlan(context as any, [
        { ...seedAction("product", context.versions[0]), swap: true },
      ])

      expect(context.provider.upsertDocuments).toHaveBeenCalledTimes(2)
      expect(context.versions[0].status).toEqual(SearchIndexState.READY)
      expect(context.indexService.update).toHaveBeenCalledWith({
        selector: { name: "product" },
        data: { active_version: 1 },
      })
      expect(context.syncs[0]).toMatchObject({
        status: SearchSyncStatus.DONE,
        documents_synced: 2,
      })
      expect(context.logger_.error).not.toHaveBeenCalled()
      expect(context.logger_.warn).not.toHaveBeenCalled()
    })
  })

  describe("picking up where a failed run stopped", () => {
    const ok = { index: "x", status: "succeeded" }

    const writtenIds = (upsertDocuments: jest.Mock) =>
      upsertDocuments.mock.calls.map(([call]) => call.documents[0].id)

    it("should resume from the cursor after a document the engine rejected", async () => {
      const cursors: (string | undefined)[] = []
      const upsertDocuments = jest
        .fn()
        .mockResolvedValueOnce(ok)
        .mockResolvedValueOnce(ok)
        .mockRejectedValueOnce(
          new Error('document IDs cannot exceed 64 bytes ("3")')
        )
        .mockResolvedValue(ok)

      const context = buildContext({
        indexes: [streamOfFour(cursors)],
        upsertDocuments,
        locking: passthroughLocking(),
      })
      const action = seedAction("product", context.versions[0])

      await executeSeedPlan(context as any, [action])

      expect(context.syncs[0]).toMatchObject({
        status: SearchSyncStatus.FAILED,
        last_key: "2",
        resumable: true,
      })
      expect(writtenIds(upsertDocuments)).toEqual(["1", "2", "3"])

      await executeSeedPlan(context as any, [action])

      // The second run is handed the cursor and writes only what is left.
      expect(cursors).toEqual([undefined, "2"])
      expect(writtenIds(upsertDocuments)).toEqual(["1", "2", "3", "3", "4"])
      expect(context.versions[0].status).toBe(SearchIndexState.READY)
    })

    it("should count what the version took in across both runs", async () => {
      const cursors: (string | undefined)[] = []
      const upsertDocuments = jest
        .fn()
        .mockResolvedValueOnce(ok)
        .mockResolvedValueOnce(ok)
        .mockRejectedValueOnce(new Error("engine rejected the batch"))
        .mockResolvedValue(ok)

      const context = buildContext({
        indexes: [streamOfFour(cursors)],
        upsertDocuments,
        locking: passthroughLocking(),
      })
      const action = seedAction("product", context.versions[0])

      await executeSeedPlan(context as any, [action])

      expect(context.syncs[0].documents_synced).toBe(2)

      await executeSeedPlan(context as any, [action])

      // Two documents from the first run, two from the second — not the two
      // this run happened to write.
      expect(context.syncs[1]).toMatchObject({
        status: SearchSyncStatus.DONE,
        documents_synced: 4,
      })
      expect(context.logger_.info).toHaveBeenCalledWith(
        expect.stringContaining("4 documents in total")
      )
    })

    it("should report only its own count when it started from nothing", async () => {
      const context = buildContext({
        indexes: [streamOfFour([])],
        locking: passthroughLocking(),
      })

      await executeSeedPlan(context as any, [
        seedAction("product", context.versions[0]),
      ])

      expect(context.syncs[0].documents_synced).toBe(4)
      expect(context.logger_.info).not.toHaveBeenCalledWith(
        expect.stringContaining("in total")
      )
    })

    it("should carry the cursor onto the run that picks it up", async () => {
      const cursors: (string | undefined)[] = []
      const upsertDocuments = jest
        .fn()
        .mockResolvedValueOnce(ok)
        .mockRejectedValueOnce(new Error("engine rejected the batch"))
        .mockResolvedValue(ok)

      const context = buildContext({
        indexes: [streamOfFour(cursors)],
        upsertDocuments,
        locking: passthroughLocking(),
      })
      const action = seedAction("product", context.versions[0])

      await executeSeedPlan(context as any, [action])
      await executeSeedPlan(context as any, [action])

      // The row the second run opened starts at the cursor the first one
      // reached, rather than at nothing.
      const [opened] = context.syncService.create.mock.calls[1][0]
      expect(opened).toMatchObject({ last_key: "1", resumable: true })
    })

    it("should resume a run that was interrupted rather than failed", async () => {
      const cursors: (string | undefined)[] = []
      const upsertDocuments = jest.fn().mockResolvedValue(ok)
      const context = buildContext({
        indexes: [streamOfFour(cursors)],
        upsertDocuments,
        locking: passthroughLocking(),
      })

      // A killed process leaves its row open, the way a lost lock does.
      context.syncs.push({
        id: "sync_interrupted",
        search_index_version_id: context.versions[0].id,
        status: SearchSyncStatus.PROCESSING,
        last_key: "3",
        resumable: true,
        documents_synced: 3,
        sequence: 99,
      } as any)

      await executeSeedPlan(context as any, [
        seedAction("product", context.versions[0]),
      ])

      expect(cursors).toEqual(["3"])
      expect(writtenIds(upsertDocuments)).toEqual(["4"])
      expect(
        context.syncs.find((sync) => sync.id === "sync_interrupted")!.status
      ).toBe(SearchSyncStatus.CANCELED)
    })

    it("should start over when the failure was a delete the cursor cannot describe", async () => {
      const cursors: (string | undefined)[] = []
      const index = definition(
        "product",
        async function* ({ catchup, last_key }: any) {
          if (catchup) {
            return
          }

          cursors.push(last_key)
          yield [{ action: "upsert", documents: [{ id: "1" }] }]
          yield [{ action: "delete", filters: { id: ["9"] } }]
          yield [{ action: "upsert", documents: [{ id: "2" }] }]
        }
      )

      const deleteDocuments = jest
        .fn()
        .mockRejectedValueOnce(new Error("engine refused the delete"))
        .mockResolvedValue(ok)

      const context = buildContext({
        indexes: [index],
        deleteDocuments,
        locking: passthroughLocking(),
      })
      const action = seedAction("product", context.versions[0])

      await executeSeedPlan(context as any, [action])

      expect(context.syncs[0]).toMatchObject({
        status: SearchSyncStatus.FAILED,
        last_key: "1",
        resumable: false,
      })
      expect(context.syncs[0].error).toContain("cannot be resumed")

      await executeSeedPlan(context as any, [action])

      // A resumed stream would carry on past the delete and never apply it.
      expect(cursors).toEqual([undefined, undefined])
    })

    it("should start over when the stream finished and the run failed after it", async () => {
      const cursors: (string | undefined)[] = []
      const index = definition(
        "product",
        async function* ({ catchup, last_key }: any) {
          if (catchup) {
            throw new Error("the catch-up query failed")
          }

          cursors.push(last_key)
          yield [{ action: "upsert", documents: [{ id: "1" }] }]
          yield [{ action: "upsert", documents: [{ id: "2" }] }]
        }
      )

      const context = buildContext({
        indexes: [index],
        locking: passthroughLocking(),
      })
      const action = seedAction("product", context.versions[0])

      await executeSeedPlan(context as any, [action])

      // The bulk stream ran out, so its cursor has nothing left to hand over —
      // and a fresh catch-up would only cover what changed since the new run
      // started, missing everything the failed one was meant to catch.
      expect(context.syncs[0]).toMatchObject({
        status: SearchSyncStatus.FAILED,
        resumable: false,
      })

      await executeSeedPlan(context as any, [action])

      expect(cursors).toEqual([undefined, undefined])
    })

    it("should not hand the bulk pass's cursor to the catch-up pass", async () => {
      const catchupCursors: (string | undefined)[] = []
      const index = definition(
        "product",
        async function* ({ catchup, last_key }: any) {
          if (catchup) {
            catchupCursors.push(last_key)
            return
          }

          yield [{ action: "upsert", documents: [{ id: "1" }] }]
          yield [{ action: "upsert", documents: [{ id: "2" }] }]
        }
      )

      const context = buildContext({
        indexes: [index],
        locking: passthroughLocking(),
      })

      await executeSeedPlan(context as any, [
        seedAction("product", context.versions[0]),
      ])

      const [bulk, catchUp] = context.syncs

      expect(catchupCursors).toEqual([undefined])
      // The catch-up walks its own stream, so it neither takes the bulk
      // pass's cursor nor supersedes its row.
      expect(catchUp).toMatchObject({ last_key: null, resumable: false })
      expect(bulk.status).toBe(SearchSyncStatus.DONE)
      expect(context.syncService.update).not.toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: SearchSyncStatus.CANCELED,
          }),
        })
      )
    })

    it("should hand nothing over once a run has completed", async () => {
      const cursors: (string | undefined)[] = []
      const context = buildContext({
        indexes: [streamOfFour(cursors)],
        locking: passthroughLocking(),
      })
      const action = seedAction("product", context.versions[0])

      await executeSeedPlan(context as any, [action])
      await executeSeedPlan(context as any, [action])

      expect(cursors).toEqual([undefined, undefined])
    })

    it("should leave no cursor behind after a scoped reindex", async () => {
      const cursors: (string | undefined)[] = []
      const context = buildContext({
        indexes: [streamOfFour(cursors)],
        locking: passthroughLocking(),
      })

      await reindexIndexes(context as any, {
        index: "product",
        filters: { status: "published" },
        strategy: "in_place",
      })

      expect(context.syncs[0]).toMatchObject({
        filters: { status: "published" },
        resumable: false,
      })

      // A slice of the index is not a position in the full stream, so a seed
      // after it rebuilds rather than continuing from where it stopped.
      await executeSeedPlan(context as any, [
        seedAction("product", context.versions[0]),
      ])

      expect(cursors).toEqual([undefined, undefined])
    })
  })

  describe("planning a rebuild after a failure", () => {
    const index = () =>
      definition("product", async function* () {
        yield [{ action: "upsert", documents: [{ id: "1" }] }]
      })

    const planFor = async (documentCounts: Record<string, number>) => {
      const context = buildContext({ indexes: [index()], documentCounts })
      context.versions[0].status = SearchIndexState.ERROR

      return { context, plan: await createSeedPlan(context as any) }
    }

    it("should continue an index that still holds what the failed run wrote", async () => {
      const { plan } = await planFor({ product_v1: 1000 })

      expect(plan).toEqual([
        expect.objectContaining({
          index: "product",
          reason: "last_run_failed",
        }),
      ])
    })

    it("should rebuild an index that lost its data", async () => {
      const { plan } = await planFor({ product_v1: 0 })

      expect(plan).toEqual([
        expect.objectContaining({ index: "product", reason: "index_empty" }),
      ])
    })

    it("should not resume into an index that lost its data", async () => {
      const cursors: (string | undefined)[] = []
      const context = buildContext({
        indexes: [streamOfFour(cursors)],
        locking: passthroughLocking(),
        documentCounts: { product_v1: 0 },
      })

      context.syncs.push({
        id: "sync_failed",
        search_index_version_id: context.versions[0].id,
        status: SearchSyncStatus.FAILED,
        last_key: "3",
        resumable: true,
        documents_synced: 3,
        sequence: 99,
      } as any)

      await executeSeedPlan(context as any, [
        {
          ...seedAction("product", context.versions[0]),
          reason: "index_empty",
        },
      ])

      expect(cursors).toEqual([undefined])
    })
  })

  describe("when the engine rate limits the writes", () => {
    // Cloud sends a `Retry-After` with its 429s, and the seed honours it — a
    // zero wait is what keeps these tests from sitting through the backoff.
    const rateLimited = () =>
      Object.assign(new Error("Too many requests"), {
        status: 429,
        type: "embedding_rate_limit",
        retry_after: 0,
      })

    const twoDocuments = () =>
      definition("product", async function* ({ catchup }) {
        if (catchup) {
          return
        }

        yield [{ action: "upsert", documents: [{ id: "1" }] }]
        yield [{ action: "upsert", documents: [{ id: "2" }] }]
      })

    it("should wait out the rate limit and finish the seed", async () => {
      const upsertDocuments = jest
        .fn()
        .mockRejectedValueOnce(rateLimited())
        .mockRejectedValueOnce(rateLimited())
        .mockResolvedValue({ index: "x", status: "succeeded" })

      const context = buildContext({
        indexes: [twoDocuments()],
        upsertDocuments,
        locking: passthroughLocking(),
      })

      await executeSeedPlan(context as any, [
        seedAction("product", context.versions[0]),
      ])

      expect(upsertDocuments).toHaveBeenCalledTimes(4)
      expect(context.versions[0].status).toBe(SearchIndexState.READY)

      const [bulk] = context.syncs
      expect(bulk.status).toBe(SearchSyncStatus.DONE)
      expect(bulk.documents_synced).toBe(2)
      expect(context.logger_.warn).toHaveBeenCalledWith(
        expect.stringContaining("Rate limited")
      )
    })

    it("should wait out a rate-limited delete before calling the run unresumable", async () => {
      const index = definition("product", async function* ({ catchup }: any) {
        if (catchup) {
          return
        }

        yield [{ action: "upsert", documents: [{ id: "1" }] }]
        yield [{ action: "delete", filters: { id: ["9"] } }]
      })

      const deleteDocuments = jest
        .fn()
        .mockRejectedValueOnce(rateLimited())
        .mockRejectedValueOnce(rateLimited())
        .mockResolvedValue({ index: "x", status: "succeeded" })

      const context = buildContext({
        indexes: [index],
        deleteDocuments,
        locking: passthroughLocking(),
      })

      await executeSeedPlan(context as any, [
        seedAction("product", context.versions[0]),
      ])

      // A delete that cannot be resumed past is exactly the one worth waiting
      // for, so the rate limit is ridden out before the run gives up on it.
      expect(deleteDocuments).toHaveBeenCalledTimes(3)
      expect(context.syncs[0]).toMatchObject({
        status: SearchSyncStatus.DONE,
        resumable: false,
      })
      expect(context.versions[0].status).toBe(SearchIndexState.READY)
    })

    it("should leave a run that gave up waiting resumable", async () => {
      const cursors: (string | undefined)[] = []
      const upsertDocuments = jest
        .fn()
        .mockResolvedValueOnce({ index: "x", status: "succeeded" })
        .mockRejectedValueOnce(rateLimited())
        .mockRejectedValueOnce(rateLimited())
        .mockRejectedValueOnce(rateLimited())
        .mockRejectedValueOnce(rateLimited())
        .mockRejectedValueOnce(rateLimited())
        .mockRejectedValueOnce(rateLimited())
        .mockResolvedValue({ index: "x", status: "succeeded" })

      const context = buildContext({
        indexes: [streamOfFour(cursors)],
        upsertDocuments,
        locking: passthroughLocking(),
      })
      const action = seedAction("product", context.versions[0])

      await executeSeedPlan(context as any, [action])

      // Spending the retries is not the kind of failure that invalidates what
      // was already written, so the cursor still stands.
      expect(context.syncs[0]).toMatchObject({
        status: SearchSyncStatus.FAILED,
        last_key: "1",
        resumable: true,
      })

      await executeSeedPlan(context as any, [action])

      expect(cursors).toEqual([undefined, "1"])
      expect(context.versions[0].status).toBe(SearchIndexState.READY)
    })

    it("should stop retrying when it no longer holds the lock", async () => {
      let abort: () => void
      const upsertDocuments = jest.fn(async () => {
        // The lock goes to another instance while this batch is being
        // rate limited.
        abort!()
        throw rateLimited()
      })

      const context = buildContext({
        indexes: [twoDocuments()],
        upsertDocuments,
        locking: lockingThatAborts((abortFn) => {
          abort = abortFn
        }),
      })

      await executeSeedPlan(context as any, [
        seedAction("product", context.versions[0]),
      ])

      // Retried once, where the lock check that guards every attempt stopped
      // it before it could write again.
      expect(upsertDocuments).toHaveBeenCalledTimes(1)
      // A run that lost its lock owns neither the version nor its syncs.
      expect(context.versions[0].status).toBe(SearchIndexState.BUILDING)
      expect(context.syncs[0].status).toBe(SearchSyncStatus.PROCESSING)
    })
  })
})
