import { SearchTypes } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import {
  baseProducts,
  dataset,
  productIndex,
  resetDataset,
} from "../__fixtures__/product-index"

jest.setTimeout(120000)

type SearchService = SearchTypes.ISearchModuleService

// The startup hook seeds indexes, so the lifecycle tests re-run it to simulate
// a boot.
const boot = (service: SearchService) =>
  (service as any).onApplicationStart_() as Promise<void>

const migrate = async (service: SearchService) =>
  service.executeIndexMigrationPlan(await service.createIndexMigrationPlan())

const updateIndexRecords = (service: SearchService, input: any) =>
  (service as any).context_.indexService.update(input) as Promise<any>

// The provider itself, for the write paths the module only reaches through
// events (delete-by-filter) and for catalog assertions.
const provider = (service: SearchService) =>
  (service as any).context_.providers.retrieve("search-postgres")

const ids = (result: SearchTypes.SearchResult) =>
  result.hits.map((hit) => hit.id)

const reseed = async (service: SearchService) => {
  resetDataset()
  const p = provider(service)
  await p.clearIndex({ index: "product" })
  await service.upsertDocuments({
    index: "product",
    documents: dataset.products,
  })
}

moduleIntegrationTestRunner<SearchService>({
  moduleName: Modules.SEARCH,
  resolve: __dirname + "/../../../../search",
  // The schema spans two packages: the module owns `search_index`, the provider
  // owns its catalog and the search extensions.
  pathToMigrations: [
    __dirname + "/../../../../search/src/migrations",
    __dirname + "/../../src/migrations",
  ],
  moduleOptions: {
    providers: [
      {
        resolve: require.resolve("../../src"),
        id: "postgres",
      },
    ],
    indexes: [productIndex],
  },
  hooks: {
    beforeModuleInit: async () => {
      resetDataset()
    },
    // Indexes are created by `db:migrate`, never by the application. The
    // startup hook has already run by the time this fires, so migrate and boot
    // again — which is the order a real deploy uses.
    afterModuleInit: async (_app: any, service: SearchService) => {
      await migrate(service)
      await boot(service)
    },
  },
  testSuite: ({ service }) =>
    describe("Postgres Search Provider", () => {
      describe("seeding and counts", () => {
        it("seeds every document at startup", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id", "title"],
          })

          expect(result.metadata.count).toBe(3)
          expect(ids(result).sort()).toEqual(["prod_1", "prod_2", "prod_3"])
        })

        it("tracks the document count in the catalog", async () => {
          await reseed(service)

          const [info] = await provider(service).listIndexes()
          expect(info.document_count).toBe(3)
        })
      })

      describe("keyword search", () => {
        beforeEach(async () => reseed(service))

        it("ranks and filters by the query", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id", "title"],
            filters: { q: "shoe" },
            search_options: { include_score: true },
          })

          expect(ids(result)).toEqual(["prod_1"])
          expect(result.hits[0].score).toBeGreaterThan(0)
          expect(result.metadata.count).toBe(1)
        })

        it("ANDs terms by default and ORs them with match_strategy any", async () => {
          const all = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "shoe hat" },
          })
          expect(all.metadata.count).toBe(0)

          const any = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "shoe hat" },
            search_options: { match_strategy: "any" },
          })
          expect(ids(any).sort()).toEqual(["prod_1", "prod_3"])
        })

        it("prefixes the last term with match_strategy last", async () => {
          const prefix = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "sho" },
            search_options: { match_strategy: "last" },
          })
          expect(ids(prefix)).toEqual(["prod_1"])

          const twoTerms = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "red sho" },
            search_options: { match_strategy: "last" },
          })
          expect(ids(twoTerms)).toEqual(["prod_1"])

          const exact = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "sho" },
          })
          expect(ids(exact)).toEqual([])
        })

        it("tolerates typos through trigram word similarity", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "runing" },
            search_options: { typo_tolerance: true },
          })

          expect(ids(result).sort()).toEqual(["prod_1", "prod_2"])
        })

        it("rejects vector search on the native engine", async () => {
          await expect(
            service.search({
              entity: "product",
              fields: ["id"],
              search_options: {
                vector: { field: "embedding", value: [0.1] },
              },
            })
          ).rejects.toThrow(/lakebase/)
        })
      })

      describe("filters", () => {
        beforeEach(async () => reseed(service))

        it("treats equality on an array field as membership", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { tags: "sport" },
          })

          expect(ids(result).sort()).toEqual(["prod_1", "prod_2"])
        })

        it("matches numeric array elements", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { sizes: { $in: [41, 38] } },
          })

          expect(ids(result).sort()).toEqual(["prod_1", "prod_2"])
        })

        it("keeps $exists scoped to its own field in a conjunction", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { status: "published", deleted_at: { $exists: false } },
          })

          // prod_2 is published but soft-deleted; prod_3 is not published.
          expect(ids(result)).toEqual(["prod_1"])
        })

        it("supports $contains, nested paths, $or and $not", async () => {
          const contains = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { tags: { $contains: ["shoe", "sport"] } },
          })
          expect(ids(contains)).toEqual(["prod_1"])

          const nested = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { "variants.color": "red" },
          })
          expect(ids(nested)).toEqual(["prod_1"])

          const composed = await service.search({
            entity: "product",
            fields: ["id"],
            filters: {
              $or: [{ brand: "borg" }, { min_price: { $gte: 150 } }],
              $not: { status: "draft" },
            },
          })
          expect(ids(composed)).toEqual(["prod_2"])
        })

        it("deletes by primary key without treating the id list as a Postgres array literal", async () => {
          await provider(service).deleteDocuments({
            index: "product",
            filters: { id: "prod_1" },
          })

          await provider(service).deleteDocuments({
            index: "product",
            filters: { id: ["prod_2", "prod_3"] },
          })

          const remaining = await service.search({
            entity: "product",
            fields: ["id"],
          })
          expect(ids(remaining)).toEqual([])

          const [info] = await provider(service).listIndexes()
          expect(info.document_count).toBe(0)
        })

        it("deletes by filter without $exists leaking across the conjunction", async () => {
          await provider(service).deleteDocuments({
            index: "product",
            filters: { status: "draft", deleted_at: { $exists: false } },
          })

          const remaining = await service.search({
            entity: "product",
            fields: ["id"],
          })

          expect(ids(remaining).sort()).toEqual(["prod_1", "prod_2"])

          const [info] = await provider(service).listIndexes()
          expect(info.document_count).toBe(2)
        })
      })

      describe("facets", () => {
        beforeEach(async () => reseed(service))

        it("scopes facet counts to the query matches", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "running" },
            search_options: { facets: ["brand"] },
          })

          expect(result.metadata.count).toBe(2)
          expect(result.facets?.brand).toEqual({
            type: "value",
            values: expect.arrayContaining([
              { value: "acme", count: 1 },
              { value: "borg", count: 1 },
            ]),
          })
        })

        it("computes range facets alongside filters", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { status: "published" },
            search_options: {
              facets: [
                {
                  field: "min_price",
                  type: "range",
                  ranges: [
                    { key: "low", to: 100 },
                    { key: "high", from: 100 },
                  ],
                },
              ],
            },
          })

          expect(result.facets?.min_price).toEqual({
            type: "range",
            ranges: [
              { key: "low", from: undefined, to: 100, count: 1 },
              { key: "high", from: 100, to: undefined, count: 1 },
            ],
          })
        })

        it("computes stats facets", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            search_options: { facets: [{ field: "min_price", type: "stats" }] },
          })

          expect(result.facets?.min_price).toMatchObject({
            type: "stats",
            min: 50,
            max: 200,
            count: 3,
          })
        })
      })

      describe("ordering, min_score and distinct", () => {
        beforeEach(async () => reseed(service))

        it("orders by a field", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            pagination: { order: { min_price: "ASC" } },
          })

          expect(ids(result)).toEqual(["prod_2", "prod_1", "prod_3"])
        })

        it("keeps the requested order when min_score is set", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "running" },
            search_options: { min_score: 0.000001 },
            pagination: { order: { title: "ASC" } },
          })

          // Blue... sorts before Red...; without the fix this came back by id.
          expect(ids(result)).toEqual(["prod_2", "prod_1"])
          expect(result.metadata.count).toBe(2)
        })

        it("filters out hits below min_score", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "running" },
            search_options: { min_score: 1000 },
          })

          expect(result.hits).toEqual([])
          expect(result.metadata.count).toBe(0)
        })

        it("returns one hit per distinct value", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id", "brand"],
            search_options: { distinct: "brand" },
            pagination: { order: { min_price: "ASC" } },
          })

          // Cheapest per brand: prod_2 (borg, 50) and prod_1 (acme, 100).
          expect(ids(result)).toEqual(["prod_2", "prod_1"])
          expect(result.metadata.count).toBe(2)
        })
      })

      describe("reindexing", () => {
        const stale = () =>
          updateIndexRecords(service, {
            selector: { name: "product" },
            data: { definition_hash: "stale" },
          })

        it("survives repeated swap cycles onto the same shadow name", async () => {
          // Two full stale → migrate → boot cycles reuse the identical
          // hash-derived shadow table name; leftover constraint/index names
          // from the first swap used to collide with the second.
          for (let cycle = 0; cycle < 2; cycle++) {
            await stale()
            await migrate(service)
            await boot(service)

            const result = await service.search({
              entity: "product",
              fields: ["id"],
            })
            expect(result.metadata.count).toBe(3)
          }

          // The live table kept its physical indexes through the swaps.
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "shoe" },
          })
          expect(ids(result)).toEqual(["prod_1"])
        })
      })
    }),
})
