import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { SearchIndexRecord, SearchIndexVersionRecord } from "@types"
import { SearchIndexState } from "../index"
import { cleanupStaleVersions, versionPhysicalName } from "../versions"

const definition = (): SearchTypes.ResolvedSearchIndexDefinition =>
  ({
    name: "product",
    entity: "product",
    provider: "test",
    physical_name: "product",
    definition_hash: "abcdef0123456789abcdef0123456789",
    primary_key: "id",
    fields: { id: { type: "keyword", filterable: true } },
    settings: {},
    async *seed() {},
  }) as unknown as SearchTypes.ResolvedSearchIndexDefinition

const version = (
  overrides: Partial<SearchIndexVersionRecord> & { version: number }
): SearchIndexVersionRecord => ({
  id: `ver_${overrides.version}`,
  search_index_id: "idx_1",
  provider: "test",
  physical_name: `product_v${overrides.version}`,
  definition_hash: "abcdef0123456789abcdef0123456789",
  status: SearchIndexState.READY,
  ...overrides,
})

const provider = (
  identifier: string,
  deleteIndex: jest.Mock = jest
    .fn()
    .mockResolvedValue({ index: "product", status: "succeeded" })
) => ({ identifier, deleteIndex })

const buildContext = ({
  versions,
  providers,
}: {
  versions: SearchIndexVersionRecord[]
  providers: { identifier: string; deleteIndex: jest.Mock }[]
}) => {
  const byId = new Map(providers.map((item) => [item.identifier, item]))
  const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() }

  return {
    logger: logger as any,
    versionService: {
      list: jest.fn().mockResolvedValue(versions),
      softDelete: jest.fn(),
    } as any,
    providers: {
      retrieve: (identifier: string) => {
        const found = byId.get(identifier)

        if (!found) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Search provider "${identifier}" is not registered.`
          )
        }

        return found as unknown as SearchTypes.ISearchProvider
      },
    },
    logger_: logger,
  }
}

const record = (active_version: number | null): SearchIndexRecord => ({
  id: "idx_1",
  name: "product",
  active_version,
})

describe("search index versions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("versionPhysicalName", () => {
    it("appends the version number to the definition's physical name", () => {
      expect(versionPhysicalName(definition(), 1)).toBe("product_v1")
      expect(versionPhysicalName(definition(), 12)).toBe("product_v12")
    })
  })

  describe("cleanupStaleVersions", () => {
    it("deletes every version below the active one", async () => {
      const current = provider("test")
      const context = buildContext({
        versions: [version({ version: 1 }), version({ version: 2 })],
        providers: [current],
      })

      await cleanupStaleVersions(context, record(3))

      expect(
        current.deleteIndex.mock.calls.map(([call]) => call.index)
      ).toEqual(["product_v1", "product_v2"])
      expect(context.versionService.softDelete).toHaveBeenCalledWith(["ver_1"])
      expect(context.versionService.softDelete).toHaveBeenCalledWith(["ver_2"])
    })

    it("keeps the active version and anything being built above it", async () => {
      const current = provider("test")
      const context = buildContext({
        versions: [
          version({ version: 1 }),
          // Still serving reads while version 6 is built beside it.
          version({ version: 5 }),
          version({ version: 6, status: SearchIndexState.BUILDING }),
        ],
        providers: [current],
      })

      await cleanupStaleVersions(context, record(5))

      expect(current.deleteIndex).toHaveBeenCalledTimes(1)
      expect(current.deleteIndex).toHaveBeenCalledWith({
        index: "product_v1",
      })
      expect(context.versionService.softDelete).toHaveBeenCalledWith(["ver_1"])
    })

    it("does nothing while no version has gone live yet", async () => {
      const current = provider("test")
      const context = buildContext({
        versions: [version({ version: 1 })],
        providers: [current],
      })

      await cleanupStaleVersions(context, record(null))

      expect(context.versionService.list).not.toHaveBeenCalled()
      expect(current.deleteIndex).not.toHaveBeenCalled()
    })

    it("keeps the record when its provider is no longer registered, so a later cleanup retries", async () => {
      const context = buildContext({
        versions: [version({ version: 1, provider: "search-gone" })],
        providers: [provider("test")],
      })

      await cleanupStaleVersions(context, record(2))

      expect(context.versionService.softDelete).not.toHaveBeenCalled()
      expect(context.logger_.warn).toHaveBeenCalledWith(
        expect.stringContaining("search-gone")
      )
    })

    it("keeps going when the engine refuses to drop one of the indexes", async () => {
      const current = provider(
        "test",
        jest
          .fn()
          .mockRejectedValueOnce(new Error("connection reset"))
          .mockResolvedValue({ index: "product", status: "succeeded" })
      )
      const context = buildContext({
        versions: [version({ version: 1 }), version({ version: 2 })],
        providers: [current],
      })

      await cleanupStaleVersions(context, record(3))

      expect(context.logger_.warn).toHaveBeenCalledWith(
        expect.stringContaining("connection reset")
      )
      // The one that failed keeps its record, so the next run picks it up
      // again; the one after it is still cleaned up.
      expect(context.versionService.softDelete).toHaveBeenCalledTimes(1)
      expect(context.versionService.softDelete).toHaveBeenCalledWith(["ver_2"])
    })
  })
})
