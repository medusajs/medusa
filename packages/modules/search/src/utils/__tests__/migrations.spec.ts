import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { SearchIndexRegistry } from "@types"
import {
  createIndexMigrationPlan,
  executeIndexMigrationPlan,
  isShadowIndexName,
  shadowIndexName,
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
    upsertIndex: jest.fn().mockResolvedValue({ index: "product", status: "succeeded" }),
    deleteIndex: jest.fn().mockResolvedValue({ index: "product", status: "succeeded" }),
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

const registry = ({
  indexes,
  records = [],
  providers,
}: {
  indexes: SearchTypes.ResolvedSearchIndexDefinition[]
  records?: { name: string; provider: string; definition_hash: string }[]
  providers: SearchTypes.ISearchProvider[]
}): SearchIndexRegistry => {
  const byId = new Map(providers.map((item) => [item.identifier, item]))

  return {
    logger: logger as any,
    indexes: new Map(indexes.map((index) => [index.name, index])),
    indexService: {
      list: jest.fn().mockResolvedValue(records),
      create: jest.fn(),
      update: jest.fn(),
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

  describe("isShadowIndexName", () => {
    it("matches a live name plus an 8-char hex suffix", () => {
      expect(isShadowIndexName("product_abcdef01", "product")).toBe(true)
    })

    it("does not match a different index that shares a prefix", () => {
      expect(isShadowIndexName("product_reviews", "product")).toBe(false)
    })

    it("does not match the live name itself", () => {
      expect(isShadowIndexName("product", "product")).toBe(false)
    })
  })

  describe("createIndexMigrationPlan", () => {
    it("creates an index that has no record", async () => {
      const index = definition()
      const plan = await createIndexMigrationPlan(
        registry({ indexes: [index], providers: [provider("search-new")] })
      )

      expect(plan).toEqual([
        {
          action: "create",
          index: "product",
          physical_name: "product",
          definition_hash: index.definition_hash,
        },
      ])
    })

    it("is a noop when the hash and provider match", async () => {
      const index = definition()
      const plan = await createIndexMigrationPlan(
        registry({
          indexes: [index],
          records: [
            {
              name: "product",
              provider: "search-new",
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
          physical_name: "product",
          definition_hash: index.definition_hash,
        },
      ])
    })

    it("migrates in place on schema drift when the provider cannot swap", async () => {
      const index = definition()
      const plan = await createIndexMigrationPlan(
        registry({
          indexes: [index],
          records: [
            {
              name: "product",
              provider: "search-new",
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
          physical_name: "product",
          live_physical_name: "product",
          definition_hash: index.definition_hash,
          live_definition_hash: "stale",
          provider: "search-new",
        },
      ])
    })

    it("builds a shadow index when the provider can swap", async () => {
      const index = definition()
      const plan = await createIndexMigrationPlan(
        registry({
          indexes: [index],
          records: [
            {
              name: "product",
              provider: "search-new",
              definition_hash: "stale",
            },
          ],
          providers: [provider("search-new", { swapIndex: jest.fn() as any })],
        })
      )

      expect(plan[0]).toMatchObject({
        action: "migrate",
        physical_name: shadowIndexName(index),
        live_physical_name: "product",
        provider: "search-new",
      })
      expect(plan[0]).not.toHaveProperty("previous_provider")
    })

    it("records the previous provider when the engine changed", async () => {
      const index = definition()
      const plan = await createIndexMigrationPlan(
        registry({
          indexes: [index],
          records: [
            {
              name: "product",
              provider: "search-old",
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
          physical_name: "product",
          live_physical_name: "product",
          definition_hash: index.definition_hash,
          live_definition_hash: index.definition_hash,
          provider: "search-new",
          previous_provider: "search-old",
        },
      ])
    })
  })

  describe("executeIndexMigrationPlan", () => {
    it("does not delete from the current provider on a schema-only migrate", async () => {
      const index = definition()
      const current = provider("search-new")
      const context = registry({
        indexes: [index],
        providers: [current],
      })

      await executeIndexMigrationPlan(context, [
        {
          action: "migrate",
          index: "product",
          physical_name: "product",
          live_physical_name: "product",
          definition_hash: index.definition_hash,
          live_definition_hash: "stale",
          provider: "search-new",
        },
      ])

      expect(current.upsertIndex).toHaveBeenCalled()
      expect(current.deleteIndex).not.toHaveBeenCalled()
    })

    it("deletes the live index and swap shadows on the previous provider", async () => {
      const index = definition()
      const current = provider("search-new")
      const previous = provider("search-old", {
        listIndexes: jest.fn().mockResolvedValue([
          { name: "product", document_count: 3 },
          { name: "product_abcd1234", document_count: 0 },
          { name: "product_reviews", document_count: 1 },
        ]),
      })
      const context = registry({
        indexes: [index],
        providers: [current, previous],
      })

      await executeIndexMigrationPlan(context, [
        {
          action: "migrate",
          index: "product",
          physical_name: "product",
          live_physical_name: "product",
          definition_hash: index.definition_hash,
          live_definition_hash: index.definition_hash,
          provider: "search-new",
          previous_provider: "search-old",
        },
      ])

      expect(current.upsertIndex).toHaveBeenCalled()
      expect(previous.deleteIndex).toHaveBeenCalledWith({ index: "product" })
      expect(previous.deleteIndex).toHaveBeenCalledWith({
        index: "product_abcd1234",
      })
      expect(previous.deleteIndex).not.toHaveBeenCalledWith({
        index: "product_reviews",
      })
    })

    it("warns and continues when the previous provider is no longer registered", async () => {
      const index = definition()
      const current = provider("search-new")
      const context = registry({
        indexes: [index],
        providers: [current],
      })

      await executeIndexMigrationPlan(context, [
        {
          action: "migrate",
          index: "product",
          physical_name: "product",
          live_physical_name: "product",
          definition_hash: index.definition_hash,
          live_definition_hash: index.definition_hash,
          provider: "search-new",
          previous_provider: "search-gone",
        },
      ])

      expect(current.upsertIndex).toHaveBeenCalled()
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("search-gone")
      )
    })
  })
})
