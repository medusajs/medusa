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

// Every version gets its own physical table, so a raw provider call has to
// look up whichever version is currently active.
const activeVersion = async (service: SearchService, name: string) => {
  const [record] = await (service as any).context_.indexService.list({ name })
  const [version] = await (service as any).context_.versionService.list({
    search_index_id: record.id,
    version: record.active_version,
  })
  return version
}

const activePhysicalName = async (service: SearchService, name: string) =>
  (await activeVersion(service, name)).physical_name

// Simulates schema drift: the active version's `definition_hash` now lives on
// `SearchIndexVersion`, not `SearchIndex`.
const staleActiveVersion = async (service: SearchService, name: string) => {
  const version = await activeVersion(service, name)
  await (service as any).context_.versionService.update({
    selector: { id: version.id },
    data: { definition_hash: "stale" },
  })
}

// The provider itself, for the write paths the module only reaches through
// events (delete-by-filter) and for catalog assertions.
const provider = (service: SearchService) =>
  (service as any).context_.providers.retrieve("search-postgres")

const ids = (result: SearchTypes.SearchResult) =>
  result.hits.map((hit) => hit.id)

const reseed = async (service: SearchService) => {
  resetDataset()
  const p = provider(service)
  await p.clearIndex({ index: await activePhysicalName(service, "product") })
  await service.upsertDocuments({
    index: "product",
    documents: dataset.products,
  })
}

const documentCountFor = async (service: SearchService, physicalName: string) => {
  const indexes = await provider(service).listIndexes()
  return (
    indexes.find((info: { name: string }) => info.name === physicalName)
      ?.document_count ?? 0
  )
}

// Stands in for a migration + seed creating a building version, without
// running the whole pipeline, so writes can be sequenced deterministically.
const beginTestBuild = async (service: SearchService) => {
  const definition = service.getIndex("product")
  const active = await activeVersion(service, "product")
  const version = active.version + 1
  const physicalName = `${definition.physical_name}_v${version}`

  await provider(service).upsertIndex({
    index: { ...definition, physical_name: physicalName },
  })

  const [created] = await (service as any).context_.versionService.create([
    {
      search_index_id: active.search_index_id,
      version,
      provider: "search-postgres",
      physical_name: physicalName,
      definition_hash: definition.definition_hash,
      status: "building",
    },
  ])

  ;(service as any).activeVersionCache_.setBuilding("product", {
    physical_name: physicalName,
    provider: "search-postgres",
    version,
  })

  return created
}

const endTestBuild = (service: SearchService) => {
  (service as any).activeVersionCache_.setBuilding("product", undefined)
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

        it("rejects vector search when the index has no vector field", async () => {
          await expect(
            service.search({
              entity: "product",
              fields: ["id"],
              search_options: {
                vector: { field: "embedding", value: [0.1] },
              },
            })
          ).rejects.toThrow(/Unknown field "embedding"/)
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
          const physicalName = await activePhysicalName(service, "product")

          await provider(service).deleteDocuments({
            index: physicalName,
            filters: { id: "prod_1" },
          })

          await provider(service).deleteDocuments({
            index: physicalName,
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
            index: await activePhysicalName(service, "product"),
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

      describe("ordered writes", () => {
        beforeEach(async () => reseed(service))

        const write = (documents: any[], seq: string) =>
          activePhysicalName(service, "product").then((index) =>
            provider(service).upsertDocuments({
              index,
              definition: service.getIndex("product"),
              documents,
              ordered: { seq },
            })
          )

        const remove = (idList: string[], seq: string) =>
          activePhysicalName(service, "product").then((index) =>
            provider(service).deleteDocuments({
              index,
              filters: { id: idList },
              ordered: { seq },
            })
          )

        it("applies a newer upsert after an older one for the same id", async () => {
          await write([{ ...baseProducts[0], title: "Older title" }], "10")
          await write([{ ...baseProducts[0], title: "Newer title" }], "20")

          const result = await service.search({
            entity: "product",
            fields: ["id", "title"],
            filters: { id: "prod_1" },
          })
          expect(result.hits[0].document.title).toBe("Newer title")
        })

        it("rejects an older upsert arriving after a newer one for the same id", async () => {
          await write([{ ...baseProducts[0], title: "Newer title" }], "20")
          await write([{ ...baseProducts[0], title: "Older title" }], "10")

          const result = await service.search({
            entity: "product",
            fields: ["id", "title"],
            filters: { id: "prod_1" },
          })
          expect(result.hits[0].document.title).toBe("Newer title")
        })

        it("rejects an older delete arriving after a newer upsert", async () => {
          await write([{ ...baseProducts[0] }], "20")
          await remove(["prod_1"], "10")

          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { id: "prod_1" },
          })
          expect(ids(result)).toEqual(["prod_1"])
        })

        it("applies a newer delete arriving after an older upsert, tombstoning the document", async () => {
          await write([{ ...baseProducts[0] }], "10")
          await remove(["prod_1"], "20")

          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { id: "prod_1" },
          })
          expect(ids(result)).toEqual([])
        })

        it("tombstones an id with no row yet, rejecting a later, older upsert for it", async () => {
          // Stands in for the bulk seed's own stale snapshot of an id a live
          // delete has already removed arriving after that delete.
          await remove(["prod_ghost"], "20")
          await write([{ ...baseProducts[0], id: "prod_ghost" }], "10")

          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { id: "prod_ghost" },
          })
          expect(ids(result)).toEqual([])
        })

        it("accepts a newer upsert for a tombstoned id that never had a row", async () => {
          await remove(["prod_ghost"], "10")
          await write([{ ...baseProducts[0], id: "prod_ghost" }], "20")

          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { id: "prod_ghost" },
          })
          expect(ids(result)).toEqual(["prod_ghost"])
        })

        it("sweepStale removes only documents older than the cutoff", async () => {
          // prod_1/2/3 were seeded unordered, so they carry the default
          // `_seq` of 0. Touch prod_1 as if a rebuild (or a live write
          // racing it) had reached it.
          await write([{ ...baseProducts[0] }], "5")

          const physicalName = await activePhysicalName(service, "product")
          await provider(service).sweepStale({ index: physicalName, seq: "5" })

          const result = await service.search({
            entity: "product",
            fields: ["id"],
          })
          expect(ids(result)).toEqual(["prod_1"])

          const [info] = await provider(service).listIndexes()
          expect(info.document_count).toBe(1)
        })
      })

      describe("double-writes into a version being built", () => {
        beforeEach(async () => reseed(service))

        it("writes a live upsert into both the active and the building version", async () => {
          const building = await beginTestBuild(service)
          try {
            const activePhysical = await activePhysicalName(service, "product")

            await service.upsertDocuments({
              index: "product",
              documents: [{ ...baseProducts[0], id: "prod_new" }],
            })

            expect(await documentCountFor(service, activePhysical)).toBe(4)
            expect(
              await documentCountFor(service, building.physical_name)
            ).toBe(1)
          } finally {
            endTestBuild(service)
          }
        })

        it("tombstones a live delete on the building version while really deleting it on the active one", async () => {
          const building = await beginTestBuild(service)
          try {
            const activePhysical = await activePhysicalName(service, "product")

            await service.upsertDocuments({
              index: "product",
              documents: [{ ...baseProducts[0], id: "prod_new" }],
            })
            await service.deleteDocuments({
              index: "product",
              filters: { id: ["prod_new"] },
            })

            expect(await documentCountFor(service, activePhysical)).toBe(3)
            expect(
              await documentCountFor(service, building.physical_name)
            ).toBe(0)
          } finally {
            endTestBuild(service)
          }
        })
      })

      describe("reindexing", () => {
        const stale = () => staleActiveVersion(service, "product")

        it("survives repeated migrate + seed cycles, each building a fresh version", async () => {
          // Two full stale → migrate → boot cycles each build a brand-new,
          // never-before-used physical table (`product_v2`, `product_v3`, ...)
          // and make it active in turn.
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

          // The latest version's table got its full-text and trigram indexes
          // built correctly, same as the first.
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
