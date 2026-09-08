import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { SearchIndexRegistry } from "@types"
import {
  createIndexMigrationPlan,
  executeIndexMigrationPlan,
  versionPhysicalName,
} from "../migrations"

const definition = (
  overrides: Partial<SearchTypes.ResolvedSearchIndexDefinition> = {}
): SearchTypes.ResolvedSearchIndexDefinition =>
  ({
    name: "product",
    entity: "product",
    provider: "search-new",
    physical_name: "product",
    definition_hash: "abcdef0123456789abcdef0123456789",
    primary_key: "id",
    fields: {
      id: { type: "keyword", filterable: true },
    },
    settings: {},
    async *seed() {},
    ...overrides,
  }) as SearchTypes.ResolvedSearchIndexDefinition

const logger = {
  warn: jest.fn(),
  info: jest.fn(),
}

const provider = (
  identifier: string,
  extras: Partial<SearchTypes.ISearchProvider> = {}
) =>
  ({
    identifier,
    upsertIndex: jest
      .fn()
      .mockResolvedValue({ index: "product", status: "succeeded" }),
    deleteIndex: jest
      .fn()
      .mockResolvedValue({ index: "product", status: "succeeded" }),
    listIndexes: jest.fn().mockResolvedValue([]),
    upsertDocuments: jest.fn(),
    deleteDocuments: jest.fn(),
    clearIndex: jest.fn(),
    search: jest.fn(),
    ...extras,
  }) as unknown as SearchTypes.ISearchProvider & {
    upsertIndex: jest.Mock
    deleteIndex: jest.Mock
    listIndexes: jest.Mock
  }

type IndexRecord = { id: string; name: string; active_version: number | null }
type VersionRecord = {
  id: string
  search_index_id: string
  version: number
  provider: string
  physical_name: string
  definition_hash: string
}

const registry = ({
  indexes,
  records = [],
  versions = [],
  providers,
}: {
  indexes: SearchTypes.ResolvedSearchIndexDefinition[]
  records?: IndexRecord[]
  versions?: VersionRecord[]
  providers: SearchTypes.ISearchProvider[]
}): SearchIndexRegistry & {
  versionService: { softDelete: jest.Mock; create: jest.Mock }
} => {
  const byId = new Map(providers.map((item) => [item.identifier, item]))

  return {
    logger: logger as any,
    indexes: new Map(indexes.map((index) => [index.name, index])),
    indexService: {
      list: jest.fn().mockImplementation((filter?: { name?: string | string[] }) => {
        if (!filter?.name) {
          return Promise.resolve(records)
        }
        const names = Array.isArray(filter.name) ? filter.name : [filter.name]
        return Promise.resolve(records.filter((r) => names.includes(r.name)))
      }),
      create: jest.fn().mockImplementation((data: Omit<IndexRecord, "id">[]) =>
        Promise.resolve([{ id: "srhidx_new", ...data[0] }])
      ),
      update: jest.fn(),
    } as any,
    versionService: {
      list: jest
        .fn()
        .mockImplementation(
          (filter?: { search_index_id?: string | string[] }) => {
            const ids = !filter?.search_index_id
              ? null
              : Array.isArray(filter.search_index_id)
              ? filter.search_index_id
              : [filter.search_index_id]
            const filtered = ids
              ? versions.filter((v) => ids.includes(v.search_index_id))
              : versions
            return Promise.resolve(
              [...filtered].sort((a, b) => b.version - a.version)
            )
          }
        ),
      create: jest
        .fn()
        .mockImplementation((data: Omit<VersionRecord, "id">[]) =>
          Promise.resolve([{ id: "srhver_new", ...data[0] }])
        ),
      softDelete: jest.fn(),
    } as any,
    providers: {
      retrieve: (identifier: string) => {
        const found = byId.get(identifier)
        if (!found) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `not registered: ${identifier}`
          )
        }
        return found
      },
    },
  }
}

describe("search index migrations", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("versionPhysicalName", () => {
    it("appends the version number to the definition's physical name", () => {
      expect(versionPhysicalName(definition(), 1)).toBe("product_v1")
      expect(versionPhysicalName(definition(), 12)).toBe("product_v12")
    })
  })

  describe("createIndexMigrationPlan", () => {
    it("creates version 1 of an index that has no record", async () => {
      const index = definition()
      const plan = await createIndexMigrationPlan(
        registry({ indexes: [index], providers: [provider("search-new")] })
      )

      expect(plan).toEqual([
        {
          action: "create",
          index: "product",
          physical_name: "product_v1",
          definition_hash: index.definition_hash,
          version: 1,
        },
      ])
    })

    it("is a noop when the active version's hash and provider match", async () => {
      const index = definition()
      const plan = await createIndexMigrationPlan(
        registry({
          indexes: [index],
          records: [{ id: "idx_1", name: "product", active_version: 1 }],
          versions: [
            {
              id: "ver_1",
              search_index_id: "idx_1",
              version: 1,
              provider: "search-new",
              physical_name: "product_v1",
              definition_hash: index.definition_hash,
            },
          ],
          providers: [provider("search-new")],
        })
      )

      expect(plan).toEqual([
        {
          action: "noop",
          index: "product",
          physical_name: "product_v1",
          definition_hash: index.definition_hash,
        },
      ])
    })

    it("plans a new version on schema drift", async () => {
      const index = definition()
      const plan = await createIndexMigrationPlan(
        registry({
          indexes: [index],
          records: [{ id: "idx_1", name: "product", active_version: 1 }],
          versions: [
            {
              id: "ver_1",
              search_index_id: "idx_1",
              version: 1,
              provider: "search-new",
              physical_name: "product_v1",
              definition_hash: "stale",
            },
          ],
          providers: [provider("search-new")],
        })
      )

      expect(plan).toEqual([
        {
          action: "migrate",
          index: "product",
          physical_name: "product_v2",
          definition_hash: index.definition_hash,
          version: 2,
          active_physical_name: "product_v1",
          active_definition_hash: "stale",
          provider: "search-new",
        },
      ])
    })

    it("is a noop when a pending version above the active one already matches", async () => {
      const index = definition()
      const plan = await createIndexMigrationPlan(
        registry({
          indexes: [index],
          records: [{ id: "idx_1", name: "product", active_version: 1 }],
          versions: [
            {
              id: "ver_1",
              search_index_id: "idx_1",
              version: 1,
              provider: "search-new",
              physical_name: "product_v1",
              definition_hash: "stale",
            },
            {
              id: "ver_2",
              search_index_id: "idx_1",
              version: 2,
              provider: "search-new",
              physical_name: "product_v2",
              definition_hash: index.definition_hash,
            },
          ],
          providers: [provider("search-new")],
        })
      )

      expect(plan).toEqual([
        {
          action: "noop",
          index: "product",
          physical_name: "product_v2",
          definition_hash: index.definition_hash,
        },
      ])
    })

    it("records the previous provider when the engine changed", async () => {
      const index = definition()
      const plan = await createIndexMigrationPlan(
        registry({
          indexes: [index],
          records: [{ id: "idx_1", name: "product", active_version: 1 }],
          versions: [
            {
              id: "ver_1",
              search_index_id: "idx_1",
              version: 1,
              provider: "search-old",
              physical_name: "product_v1",
              definition_hash: index.definition_hash,
            },
          ],
          providers: [provider("search-new"), provider("search-old")],
        })
      )

      expect(plan).toEqual([
        {
          action: "migrate",
          index: "product",
          physical_name: "product_v2",
          definition_hash: index.definition_hash,
          version: 2,
          active_physical_name: "product_v1",
          active_definition_hash: index.definition_hash,
          provider: "search-new",
          previous_provider: "search-old",
        },
      ])
    })
  })

  describe("executeIndexMigrationPlan", () => {
    it("creates the index record and its first version", async () => {
      const index = definition()
      const current = provider("search-new")
      const context = registry({ indexes: [index], providers: [current] })

      await executeIndexMigrationPlan(context, [
        {
          action: "create",
          index: "product",
          physical_name: "product_v1",
          definition_hash: index.definition_hash,
          version: 1,
        },
      ])

      expect(current.upsertIndex).toHaveBeenCalledWith({
        index: expect.objectContaining({ physical_name: "product_v1" }),
      })
      expect(context.indexService.create).toHaveBeenCalledWith([
        { name: "product", active_version: null },
      ])
      expect(context.versionService.create).toHaveBeenCalledWith([
        expect.objectContaining({
          search_index_id: "srhidx_new",
          version: 1,
          provider: "search-new",
          physical_name: "product_v1",
          definition_hash: index.definition_hash,
        }),
      ])
      expect(current.deleteIndex).not.toHaveBeenCalled()
    })

    it("builds a new version for a migrate action without touching the active one", async () => {
      const index = definition()
      const current = provider("search-new")
      const context = registry({
        indexes: [index],
        records: [{ id: "idx_1", name: "product", active_version: 1 }],
        versions: [
          {
            id: "ver_1",
            search_index_id: "idx_1",
            version: 1,
            provider: "search-new",
            physical_name: "product_v1",
            definition_hash: "stale",
          },
        ],
        providers: [current],
      })

      await executeIndexMigrationPlan(context, [
        {
          action: "migrate",
          index: "product",
          physical_name: "product_v2",
          definition_hash: index.definition_hash,
          version: 2,
          active_physical_name: "product_v1",
          active_definition_hash: "stale",
          provider: "search-new",
        },
      ])

      expect(current.upsertIndex).toHaveBeenCalledWith({
        index: expect.objectContaining({ physical_name: "product_v2" }),
      })
      expect(context.versionService.create).toHaveBeenCalledWith([
        expect.objectContaining({ search_index_id: "idx_1", version: 2 }),
      ])
      // Version 1 is still active, so it survives cleanup.
      expect(current.deleteIndex).not.toHaveBeenCalled()
    })

    it("deletes every version older than the active one", async () => {
      const index = definition()
      const current = provider("search-new")
      const old = provider("search-old")
      const context = registry({
        indexes: [index],
        records: [{ id: "idx_1", name: "product", active_version: 2 }],
        versions: [
          {
            id: "ver_1",
            search_index_id: "idx_1",
            version: 1,
            provider: "search-old",
            physical_name: "product_v1",
            definition_hash: "older",
          },
          {
            id: "ver_2",
            search_index_id: "idx_1",
            version: 2,
            provider: "search-new",
            physical_name: "product_v2",
            definition_hash: "stale",
          },
        ],
        providers: [current, old],
      })

      await executeIndexMigrationPlan(context, [
        {
          action: "migrate",
          index: "product",
          physical_name: "product_v3",
          definition_hash: index.definition_hash,
          version: 3,
          active_physical_name: "product_v2",
          active_definition_hash: "stale",
          provider: "search-new",
        },
      ])

      expect(old.deleteIndex).toHaveBeenCalledWith({ index: "product_v1" })
      expect(current.deleteIndex).not.toHaveBeenCalledWith({
        index: "product_v2",
      })
      expect(context.versionService.softDelete).toHaveBeenCalledWith(["ver_1"])
    })

    it("cleans up a stale version left over from an earlier swap even on a noop", async () => {
      const index = definition()
      const current = provider("search-new")
      const old = provider("search-old")
      const context = registry({
        indexes: [index],
        records: [{ id: "idx_1", name: "product", active_version: 2 }],
        versions: [
          {
            id: "ver_1",
            search_index_id: "idx_1",
            version: 1,
            provider: "search-old",
            physical_name: "product_v1",
            definition_hash: "older",
          },
          {
            id: "ver_2",
            search_index_id: "idx_1",
            version: 2,
            provider: "search-new",
            physical_name: "product_v2",
            definition_hash: index.definition_hash,
          },
        ],
        providers: [current, old],
      })

      // Nothing drifted this time, so the plan for this index is a noop —
      // but version 1 still needs cleaning up; that cannot wait for drift.
      await executeIndexMigrationPlan(context, [
        {
          action: "noop",
          index: "product",
          physical_name: "product_v2",
          definition_hash: index.definition_hash,
        },
      ])

      expect(current.upsertIndex).not.toHaveBeenCalled()
      expect(old.deleteIndex).toHaveBeenCalledWith({ index: "product_v1" })
      expect(context.versionService.softDelete).toHaveBeenCalledWith(["ver_1"])
    })

    it("warns and continues when a stale version's provider is no longer registered", async () => {
      const index = definition()
      const current = provider("search-new")
      const context = registry({
        indexes: [index],
        records: [{ id: "idx_1", name: "product", active_version: 2 }],
        versions: [
          {
            id: "ver_1",
            search_index_id: "idx_1",
            version: 1,
            provider: "search-gone",
            physical_name: "product_v1",
            definition_hash: "older",
          },
          {
            id: "ver_2",
            search_index_id: "idx_1",
            version: 2,
            provider: "search-new",
            physical_name: "product_v2",
            definition_hash: "stale",
          },
        ],
        providers: [current],
      })

      await executeIndexMigrationPlan(context, [
        {
          action: "migrate",
          index: "product",
          physical_name: "product_v3",
          definition_hash: index.definition_hash,
          version: 3,
          active_physical_name: "product_v2",
          active_definition_hash: "stale",
          provider: "search-new",
        },
      ])

      expect(current.upsertIndex).toHaveBeenCalled()
      expect(context.versionService.softDelete).not.toHaveBeenCalled()
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("search-gone")
      )
    })
  })
})
