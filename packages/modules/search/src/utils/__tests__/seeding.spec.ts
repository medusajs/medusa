import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  SearchIndexSeedAction,
  SearchIndexSyncRecord,
  SearchIndexVersionRecord,
} from "@types"
import { SearchIndexState, SearchSyncStatus } from "../index"
import { executeSeedPlan, reindexIndexes } from "../seeding"

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
}: {
  indexes: SearchTypes.ResolvedSearchIndexDefinition[]
  locking?: {
    execute: jest.Mock
  }
  upsertDocuments?: jest.Mock
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
    deleteDocuments: jest
      .fn()
      .mockResolvedValue({ index: "x", status: "succeeded" }),
    clearIndex: jest
      .fn()
      .mockResolvedValue({ index: "x", status: "succeeded" }),
    upsertIndex: jest.fn().mockResolvedValue(undefined),
    listIndexes: jest.fn().mockResolvedValue([]),
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
})
