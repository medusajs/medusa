import { SearchTypes } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { SearchIndex, SearchIndexSync } from "@models"
import { SearchIndexSeedAction } from "@types"
import { shadowIndexName } from "../../src/utils/migrations"
import {
  baseProducts,
  consumedEvents,
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

const seedPlan = (service: SearchService) =>
  (service as any).createSeedPlan_() as Promise<
    SearchIndexSeedAction[]
  >

// Migrating is public — `db:migrate` plans and executes it — but reading the
// registered definitions is not.
const migrationPlan = (service: SearchService) =>
  service.createIndexMigrationPlan()

const migrate = (
  service: SearchService,
  actions: SearchTypes.SearchIndexMigrationAction[]
) => service.executeIndexMigrationPlan(actions)

const definition = (service: SearchService, name: string) =>
  (service as any).indexes_.get(name) as
    | SearchTypes.ResolvedSearchIndexDefinition
    | undefined

// `SearchIndex` and `SearchIndexSync` are internal to the module — no generated
// CRUD, nothing on `SearchTypes` — so the bookkeeping is read through the
// internal services the module uses itself.
const indexRecords = (service: SearchService, filters: any = {}) =>
  (service as any).context_.indexService.list(filters) as Promise<any[]>

const syncRecords = (service: SearchService, filters: any = {}) =>
  (service as any).context_.syncService.list(filters) as Promise<any[]>

const updateIndexRecords = (service: SearchService, input: any) =>
  (service as any).context_.indexService.update(input) as Promise<any>

const softDeleteIndexRecords = (service: SearchService, ids: string[]) =>
  (service as any).context_.indexService.softDelete(ids) as Promise<any>

const ids = (result: SearchTypes.SearchResult) =>
  result.hits.map((hit) => hit.id)

moduleIntegrationTestRunner<SearchService>({
  moduleName: Modules.SEARCH,
  moduleModels: [SearchIndex, SearchIndexSync],
  resolve: __dirname + "/../..",
  pathToMigrations: [
    __dirname + "/../../src/migrations",
    __dirname + "/../../../providers/search-postgres/src/migrations",
  ],
  moduleOptions: {
    providers: [
      {
        resolve: "@medusajs/search-postgres",
        id: "postgres",
      },
    ],
    indexes: [productIndex],
  },
  hooks: {
    // The dataset has to be in place before the module boots, because startup
    // seeds the index from it.
    beforeModuleInit: async () => {
      resetDataset()
    },
    // Indexes are created by `db:migrate`, never by the application. The startup
    // hook has already run by the time this fires, so migrate and boot again —
    // which is the order a real deploy uses.
    afterModuleInit: async (_app: any, service: SearchService) => {
      await migrate(service, await migrationPlan(service))
      await boot(service)
    },
  },
  testSuite: ({ service }) =>
    describe("Search Module", () => {
      describe("startup", () => {
        it("registers the injected index definition", () => {
          const registered = definition(service, "product")

          expect(registered).toMatchObject({
            name: "product",
            entity: "product",
            provider: "search-postgres",
            primary_key: "id",
            physical_name: "product",
          })
          expect(registered!.definition_hash).toEqual(expect.any(String))
        })

        it("returns undefined for an unknown index", () => {
          expect(definition(service, "nope")).toBeUndefined()
        })

        it("persists an index record and marks it ready", async () => {
          const [record] = await indexRecords(service, { name: "product" })

          expect(record).toMatchObject({
            name: "product",
            provider: "search-postgres",
            status: "ready",
          })
        })

        it("seeds the index on first boot, because nothing was indexed yet", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id", "title"],
          })

          expect(result.metadata.count).toBe(3)
          expect(ids(result).sort()).toEqual(["prod_1", "prod_2", "prod_3"])
        })

        it("records the startup seed in the sync history", async () => {
          const syncs = await syncRecords(service, {})

          expect(syncs).toHaveLength(1)
          expect(syncs[0]).toMatchObject({
            status: "done",
            documents_synced: 3,
            filters: null,
          })
          expect(syncs[0].job_id).toEqual(expect.any(String))
          expect(syncs[0].completed_at).toBeTruthy()
        })

        it("lists index info with status and indexed fields", async () => {
          const infos = await service.listIndexes()

          expect(infos).toHaveLength(1)
          expect(infos[0]).toMatchObject({
            name: "product",
            entity: "product",
            provider: "search-postgres",
            status: "ready",
          })
          expect(infos[0].fields.map((field) => field.name).sort()).toEqual(
            [
              "brand",
              "created_at",
              "description",
              "handle",
              "id",
              "min_price",
              "status",
              "tags",
              "title",
              "variants.color",
              "variants.sku",
            ].sort()
          )
          expect(
            infos[0].fields.find((field) => field.name === "title")
          ).toMatchObject({
            type: "text",
            searchable: true,
            sortable: true,
            filterable: false,
          })
        })

        it("does not hold the application hook until seeding finishes", async () => {
          const index = definition(service, "product")!
          const originalSeed = index.seed

          let release!: () => void
          const hold = new Promise<void>((resolve) => {
            release = resolve
          })
          let entered!: () => void
          const enteredSeed = new Promise<void>((resolve) => {
            entered = resolve
          })
          let finished!: () => void
          const seedFinished = new Promise<void>((resolve) => {
            finished = resolve
          })

          let started = false
          index.seed = async function* (ctx) {
            started = true
            entered()
            await hold
            try {
              yield* originalSeed(ctx)
            } finally {
              finished()
            }
          }

          try {
            await updateIndexRecords(service, {
              selector: { name: "product" },
              data: { status: "pending" },
            })

            const hook = (service as any).__hooks.onApplicationStart.call(
              service
            )

            await enteredSeed
            await hook

            const [record] = await indexRecords(service, { name: "product" })
            expect(record.status).toBe("building")
          } finally {
            release()
            if (started) {
              await seedFinished
            }
            index.seed = originalSeed
          }
        })

        it("logs seeding failures from the application hook instead of rejecting", async () => {
          const errorSpy = jest
            .spyOn((service as any).logger_, "error")
            .mockImplementation(() => {})

          const provider = (service as any).searchProviderService_.retrieve(
            "search-postgres"
          )

          try {
            await provider.deleteIndex({ index: "product" })

            await expect(
              (service as any).__hooks.onApplicationStart.call(service)
            ).resolves.toBeUndefined()

            const deadline = Date.now() + 5000
            while (errorSpy.mock.calls.length === 0 && Date.now() < deadline) {
              await new Promise((resolve) => setTimeout(resolve, 25))
            }

            expect(errorSpy).toHaveBeenCalledWith(
              expect.stringContaining("[Search] Failed to seed search indexes:"),
              expect.any(Error)
            )
          } finally {
            errorSpy.mockRestore()
          }
        })
      })

      describe("migration and seeding lifecycle", () => {
        const stale = async () =>
          await updateIndexRecords(service, {
            selector: { name: "product" },
            data: { definition_hash: "stale" },
          })

        it("does not create an index at startup, which is a migration's job", async () => {
          const [record] = await indexRecords(service, { name: "product" })
          await softDeleteIndexRecords(service, [record.id])

          expect(await indexRecords(service, {})).toHaveLength(0)

          await boot(service)

          // Still nothing. An index that was never migrated is left alone rather
          // than conjured into existence by a booting app.
          expect(await indexRecords(service, {})).toHaveLength(0)
          expect(await seedPlan(service)).toEqual([])
        })

        it("plans nothing once everything is up to date", async () => {
          expect(await migrationPlan(service)).toEqual([
            {
              action: "noop",
              index: "product",
              physical_name: "product",
              definition_hash: definition(service, "product")!
                .definition_hash,
            },
          ])

          expect(await seedPlan(service)).toEqual([])
        })

        it("builds a shadow index when the provider can swap", async () => {
          await stale()

          const registered = definition(service, "product")!
          const [action] = await migrationPlan(service)

          expect(action).toEqual({
            action: "migrate",
            index: "product",
            physical_name: shadowIndexName(registered),
            live_physical_name: "product",
            definition_hash: registered.definition_hash,
            live_definition_hash: "stale",
            provider: "search-postgres",
          })
        })

        it("keeps the live index ready while a shadow is built", async () => {
          await stale()

          await migrate(service, await migrationPlan(service))

          // The replacement stands beside the live index, so the record stays
          // ready until the seed swaps it in.
          const [migrated] = await indexRecords(service, {
            name: "product",
          })
          expect(migrated.status).toBe("ready")
          expect(migrated.definition_hash).toBe("stale")
        })

        it("finishes a schema migration on the next boot", async () => {
          await stale()
          await migrate(service, await migrationPlan(service))

          const registered = definition(service, "product")!
          expect(await seedPlan(service)).toEqual([
            {
              index: "product",
              target_physical_name: shadowIndexName(registered),
              swap: true,
              reason: "schema_changed",
            },
          ])

          await boot(service)

          const [record] = await indexRecords(service, { name: "product" })

          expect(record.definition_hash).toBe(registered.definition_hash)
          expect(record.status).toBe("ready")

          const result = await service.search({
            entity: "product",
            fields: ["id"],
          })
          expect(ids(result).sort()).toEqual(["prod_1", "prod_2", "prod_3"])
        })

        it("reseeds an index that lost its data even though the record says ready", async () => {
          // An engine wiped underneath us: the record is untouched and
          // correct, the index holds nothing.
          await service.deleteDocuments({
            index: "product",
            filters: { id: ["prod_1", "prod_2", "prod_3"] },
          })

          const emptied = await service.search({
            entity: "product",
            fields: ["id"],
          })
          expect(emptied.metadata.count).toBe(0)

          expect(await seedPlan(service)).toEqual([
            {
              index: "product",
              target_physical_name: "product",
              swap: false,
              reason: "index_empty",
            },
          ])

          await boot(service)

          const result = await service.search({
            entity: "product",
            fields: ["id"],
          })
          expect(ids(result).sort()).toEqual(["prod_1", "prod_2", "prod_3"])
        })

        it("drops the previous provider's indexes when the engine changes", async () => {
          const previous = {
            identifier: "search-previous",
            deleteIndex: jest.fn().mockResolvedValue({
              index: "product",
              status: "succeeded",
            }),
            listIndexes: jest.fn().mockResolvedValue([
              { name: "product", document_count: 3 },
              { name: "product_abcd1234", document_count: 0 },
              { name: "product_reviews", document_count: 1 },
            ]),
          }
          ;(service as any).searchProviderService_.providers_.set(
            "search-previous",
            previous
          )

          await updateIndexRecords(service, {
            selector: { name: "product" },
            data: { provider: "search-previous" },
          })

          const plan = await migrationPlan(service)
          expect(plan).toEqual([
            expect.objectContaining({
              action: "migrate",
              previous_provider: "search-previous",
              provider: "search-postgres",
            }),
          ])

          await migrate(service, plan)

          expect(previous.deleteIndex).toHaveBeenCalledWith({
            index: "product",
          })
          expect(previous.deleteIndex).toHaveBeenCalledWith({
            index: "product_abcd1234",
          })
          expect(previous.deleteIndex).not.toHaveBeenCalledWith({
            index: "product_reviews",
          })

          const [migrated] = await indexRecords(service, { name: "product" })
          // The record keeps the old provider until the seed lands on the new one.
          expect(migrated.provider).toBe("search-previous")

          await boot(service)

          const [seeded] = await indexRecords(service, { name: "product" })
          expect(seeded.provider).toBe("search-postgres")
          expect(seeded.status).toBe("ready")
        })

        it("still migrates when the previous provider is no longer registered", async () => {
          const warn = jest.spyOn((service as any).logger_, "warn")

          await updateIndexRecords(service, {
            selector: { name: "product" },
            data: { provider: "search-gone" },
          })

          await migrate(service, await migrationPlan(service))

          expect(warn).toHaveBeenCalledWith(
            expect.stringContaining("search-gone")
          )

          const [migrated] = await indexRecords(service, { name: "product" })
          expect(migrated.provider).toBe("search-gone")

          warn.mockRestore()
        })

        it("leaves index creation to migrations", async () => {
          const provider = (service as any).searchProviderService_.retrieve(
            "search-postgres"
          )

          await provider.deleteIndex({ index: "product" })

          // Nothing creates the index on the way to seeding it, so the seed
          // fails against the engine rather than papering over a migration
          // that never ran.
          await expect(boot(service)).rejects.toThrow(
            /has no index "product"/
          )
          expect(await provider.listIndexes()).toEqual([])
        })

        it("seeds an index that was created but never filled", async () => {
          await updateIndexRecords(service, {
            selector: { name: "product" },
            data: { status: "pending" },
          })

          expect(await seedPlan(service)).toEqual([
            {
              index: "product",
              target_physical_name: "product",
              swap: false,
              reason: "index_created",
            },
          ])
        })

        it("retries an index whose last seed failed", async () => {
          await updateIndexRecords(service, {
            selector: { name: "product" },
            data: { status: "error" },
          })

          expect(await seedPlan(service)).toEqual([
            {
              index: "product",
              target_physical_name: "product",
              swap: false,
              reason: "last_run_failed",
            },
          ])

          await boot(service)

          const [record] = await indexRecords(service, { name: "product" })
          expect(record.status).toBe("ready")
        })

        it("is idempotent across repeated boots", async () => {
          const before = await syncRecords(service, {})

          await boot(service)
          await boot(service)

          // Nothing needed doing, so no new sync runs were recorded.
          expect(await syncRecords(service, {})).toHaveLength(
            before.length
          )
        })
      })

      describe("free-text search", () => {
        it("matches on searchable fields and scores by relevance", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id", "title"],
            filters: { q: "running" },
            search_options: { include_score: true },
          })

          expect(ids(result).sort()).toEqual(["prod_1", "prod_2"])
          expect(result.hits[0].score).toEqual(expect.any(Number))
        })

        it("takes the free-text query from `filters.q`", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "wool" },
          })

          expect(ids(result)).toEqual(["prod_3"])
        })

        it("matches on a field that is never returned", async () => {
          // `description` is `retrievable: false`, so nothing asks for it back —
          // but it is indexed, so it still matches.
          const result = await service.search({
            entity: "product",
            fields: ["id", "title"],
            filters: { q: "breathable" },
          })

          expect(ids(result)).toEqual(["prod_1"])
          expect(result.hits[0].document).toEqual({
            id: "prod_1",
            title: "Red running shoe",
          })
        })

        it("returns exactly the fields it is given", async () => {
          // Narrowing to what the index can serve is `query.search`'s job, so the
          // module projects the list as-is rather than filtering it again.
          const result = await service.search({
            entity: "product",
            fields: ["id", "brand"],
            filters: { q: "breathable" },
          })

          expect(Object.keys(result.hits[0].document).sort()).toEqual([
            "brand",
            "id",
          ])
        })

        it("matches nested searchable fields", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "SHIRT-BLUE-M" },
          })

          expect(ids(result)).toEqual(["prod_2"])
        })

        it("restricts matching to the given attributes", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "breathable" },
            search_options: { attributes_to_search_on: ["title"] },
          })

          expect(result.hits).toHaveLength(0)
        })
      })

      describe("filtering", () => {
        it("filters on an exact keyword value", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { status: "published" },
          })

          expect(ids(result).sort()).toEqual(["prod_1", "prod_2"])
        })

        it("does not leak token matches into keyword filters", async () => {
          // `title` is tokenized for matching; `handle` is an exact keyword.
          // A partial value must not match.
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { handle: "red-running" },
          })

          expect(result.hits).toHaveLength(0)
        })

        it("supports $in, $ne and $nin on keywords", async () => {
          const inResult = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { id: { $in: ["prod_1", "prod_3"] } },
          })
          expect(ids(inResult).sort()).toEqual(["prod_1", "prod_3"])

          const neResult = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { status: { $ne: "draft" } },
          })
          expect(ids(neResult).sort()).toEqual(["prod_1", "prod_2"])

          const ninResult = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { brand: { $nin: ["acme"] } },
          })
          expect(ids(ninResult)).toEqual(["prod_2"])
        })

        it("supports numeric comparisons and ranges", async () => {
          const gte = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { min_price: { $gte: 100 } },
          })
          expect(ids(gte).sort()).toEqual(["prod_1", "prod_3"])

          const range = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { min_price: { $gte: 60, $lte: 150 } },
          })
          expect(ids(range)).toEqual(["prod_1"])
        })

        it("filters on dates", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: {
              created_at: { $gte: new Date("2026-02-15T00:00:00.000Z") },
            },
          })

          expect(ids(result)).toEqual(["prod_3"])
        })

        it("supports $overlaps and $contains on arrays", async () => {
          const overlaps = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { tags: { $overlaps: ["hat", "shirt"] } },
          })
          expect(ids(overlaps).sort()).toEqual(["prod_2", "prod_3"])

          const contains = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { tags: { $contains: ["shoe", "sport"] } },
          })
          expect(ids(contains)).toEqual(["prod_1"])
        })

        it("filters on a nested field", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { "variants.color": "olive" },
          })

          expect(ids(result)).toEqual(["prod_3"])
        })

        it("does not correlate predicates across array elements", async () => {
          // prod_3 has a green S and an olive L. On a `flattened` provider both
          // predicates match the product, not a single variant. Asserting the
          // documented behaviour rather than the desired one.
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: {
              $and: [
                { "variants.color": "green" },
                { "variants.sku": "HAT-GREEN-L" },
              ],
            },
          })

          expect(ids(result)).toEqual(["prod_3"])
        })

        it("combines a term with filters", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "running", min_price: { $lte: 60 } },
          })

          expect(ids(result)).toEqual(["prod_2"])
        })
      })

      describe("sorting and pagination", () => {
        it("sorts by a numeric field", async () => {
          const asc = await service.search({
            entity: "product",
            fields: ["id"],
            pagination: { order: { min_price: "ASC" } },
          })
          expect(ids(asc)).toEqual(["prod_2", "prod_1", "prod_3"])

          const desc = await service.search({
            entity: "product",
            fields: ["id"],
            pagination: { order: { min_price: "DESC" } },
          })
          expect(ids(desc)).toEqual(["prod_3", "prod_1", "prod_2"])
        })

        it("sorts by a date", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            pagination: { order: { created_at: "DESC" } },
          })

          expect(ids(result)).toEqual(["prod_3", "prod_2", "prod_1"])
        })

        it("paginates while reporting the full count", async () => {
          const page = await service.search({
            entity: "product",
            fields: ["id"],
            pagination: { skip: 1, take: 1, order: { min_price: "ASC" } },
          })

          expect(ids(page)).toEqual(["prod_1"])
          expect(page.metadata).toMatchObject({
            skip: 1,
            take: 1,
            count: 3,
          })
        })
      })

      describe("faceting", () => {
        it("returns value facets over the filtered result set", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { status: "published" },
            search_options: { facets: ["brand", "tags"] },
          })

          expect(result.facets!.brand).toEqual({
            type: "value",
            values: expect.arrayContaining([
              { value: "acme", count: 1 },
              { value: "borg", count: 1 },
            ]),
          })
          expect(
            (result.facets!.tags as any).values.find(
              (v: any) => v.value === "sport"
            )
          ).toEqual({ value: "sport", count: 2 })
        })

        it("returns range facets with the requested keys", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            search_options: {
              facets: [
                {
                  field: "min_price",
                  type: "range",
                  ranges: [
                    { key: "cheap", from: 0, to: 99 },
                    { key: "premium", from: 100, to: 1000 },
                  ],
                },
              ],
            },
          })

          expect(result.facets!.min_price).toEqual({
            type: "range",
            ranges: [
              { key: "cheap", from: 0, to: 99, count: 1 },
              { key: "premium", from: 100, to: 1000, count: 2 },
            ],
          })
        })

        it("computes disjunctive facets ignoring the field's own filter", async () => {
          const conjunctive = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { brand: "acme" },
            search_options: { facets: ["brand"] },
          })

          // With the filter applied, only the selected brand is counted.
          expect((conjunctive.facets!.brand as any).values).toEqual([
            { value: "acme", count: 2 },
          ])

          const disjunctive = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { brand: "acme" },
            search_options: { facets: ["brand"], disjunctive_facets: true },
          })

          // The hits stay filtered...
          expect(ids(disjunctive).sort()).toEqual(["prod_1", "prod_3"])
          // ...but the facet shows the siblings a storefront needs.
          expect(
            (disjunctive.facets!.brand as any).values.sort((a: any, b: any) =>
              a.value < b.value ? -1 : 1
            )
          ).toEqual([
            { value: "acme", count: 2 },
            { value: "borg", count: 1 },
          ])
        })
      })

      describe("document writes", () => {
        it("upserts and finds new documents", async () => {
          await service.upsertDocuments({
            index: "product",
            documents: [
              {
                id: "prod_4",
                title: "Yellow rain jacket",
                handle: "yellow-rain-jacket",
                description: "Keeps the rain out",
                status: "published",
                brand: "acme",
                min_price: 300,
                created_at: new Date("2026-04-01T00:00:00.000Z"),
                tags: ["jacket"],
                variants: [{ sku: "JACKET-YELLOW-M", color: "yellow" }],
              },
            ],
          })

          const result = await service.search({
            entity: "product",
            fields: ["id", "title"],
            filters: { q: "jacket" },
          })

          expect(ids(result)).toEqual(["prod_4"])
          expect(result.hits[0].document).toMatchObject({
            title: "Yellow rain jacket",
          })
        })

        it("returns the write's task rather than waiting on it", async () => {
          const task = await service.upsertDocuments({
            index: "product",
            documents: [{ ...baseProducts[0], id: "prod_task" }],
          })

          // Whether to block on this is the caller's decision, not the module's.
          expect(task).toMatchObject({ index: "product" })
          expect(task.status).toEqual(
            expect.stringMatching(/^(enqueued|processing|succeeded)$/)
          )
        })

        it("overwrites an existing document", async () => {
          await service.upsertDocuments({
            index: "product",
            documents: [
              { ...baseProducts[0], title: "Crimson walking shoe" },
            ],
          })

          const stale = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "running" },
          })
          expect(ids(stale)).toEqual(["prod_2"])

          const fresh = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "crimson" },
          })
          expect(ids(fresh)).toEqual(["prod_1"])
        })

        it("deletes documents by id, which is a filter on the primary key", async () => {
          await service.deleteDocuments({
            index: "product",
            filters: { id: ["prod_1"] },
          })

          const result = await service.search({
            entity: "product",
            fields: ["id"],
          })

          expect(ids(result).sort()).toEqual(["prod_2", "prod_3"])
          expect(result.metadata.count).toBe(2)
        })

        it("round-trips a document without losing its shape", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id", "created_at", "tags", "variants.sku"],
            filters: { id: "prod_1" },
          })

          expect(result.hits[0].document).toEqual({
            id: "prod_1",
            created_at: baseProducts[0].created_at.toISOString(),
            tags: ["shoe", "sport"],
            // Arrays of objects are collapsed for indexing, not for reads.
            variants: [{ sku: "SHOE-RED-41" }, { sku: "SHOE-RED-42" }],
          })
        })

        it("deletes documents by any filter, not just by id", async () => {
          await service.deleteDocuments({
            index: "product",
            filters: { status: "published" },
          })

          const result = await service.search({
            entity: "product",
            fields: ["id"],
          })

          expect(ids(result)).toEqual(["prod_3"])
        })

        it("refuses an unfiltered delete rather than emptying the index", async () => {
          await expect(
            service.deleteDocuments({ index: "product", filters: {} })
          ).rejects.toThrow(/requires filters/)
        })

        it("rejects writes to an unknown index", async () => {
          await expect(
            service.upsertDocuments({ index: "nope", documents: [{ id: "x" }] })
          ).rejects.toThrow(/No search index registered for "nope"/)
        })
      })

      describe("event ingestion", () => {
        const ingest = (name: string, id: string) =>
          service.ingest({ name, data: { id } } as any)

        const found = async (q: string) =>
          ids(
            await service.search({
              entity: "product",
              fields: ["id"],
              filters: { q },
            })
          )

        it("indexes a document the event says was created", async () => {
          dataset.products.push({
            ...baseProducts[0],
            id: "prod_4",
            title: "Yellow rain jacket",
            handle: "yellow-rain-jacket",
          })

          const tasks = await ingest("product.created", "prod_4")

          expect(tasks).toEqual([
            expect.objectContaining({ status: "succeeded" }),
          ])
          expect(await found("jacket")).toEqual(["prod_4"])
        })

        it("routes the event to the index that declared it", async () => {
          await ingest("product.updated", "prod_1")

          expect(consumedEvents).toEqual([
            { event: "product.updated", index: "product" },
          ])
        })

        it("reindexes the document an update points at, in place", async () => {
          const product = dataset.products.find((p) => p.id === "prod_1")!
          product.title = "Crimson trail runner"

          await ingest("product.updated", "prod_1")

          const result = await service.search({
            entity: "product",
            fields: ["id", "title"],
            filters: { q: "crimson" },
          })

          expect(result.hits).toEqual([
            expect.objectContaining({
              id: "prod_1",
              document: expect.objectContaining({
                title: "Crimson trail runner",
              }),
            }),
          ])

          // Replaced rather than added beside the old document.
          const all = await service.search({ entity: "product", fields: ["id"] })
          expect(all.metadata.count).toBe(3)
        })

        it("removes the document an event says was deleted", async () => {
          await ingest("product.deleted", "prod_1")

          const result = await service.search({
            entity: "product",
            fields: ["id"],
          })

          expect(ids(result).sort()).toEqual(["prod_2", "prod_3"])
        })

        // The bus only promises at-least-once, so twice must look like once.
        it("is idempotent under a redelivered event", async () => {
          const product = dataset.products.find((p) => p.id === "prod_2")!
          product.title = "Azure running shirt"

          await ingest("product.updated", "prod_2")
          await ingest("product.updated", "prod_2")

          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "azure" },
          })

          expect(ids(result)).toEqual(["prod_2"])
          expect(result.metadata.count).toBe(1)
        })

        it("does nothing for an event no index declared", async () => {
          const tasks = await ingest("order.placed", "order_1")

          expect(tasks).toEqual([])
          expect(consumedEvents).toEqual([])
        })

        it("writes nothing when the entity is already gone", async () => {
          const tasks = await ingest("product.created", "prod_missing")

          expect(tasks).toEqual([])
          expect(await found("shoe")).toEqual(["prod_1"])
        })

        it("propagates a write failure, so the event is redelivered", async () => {
          const provider = (service as any).searchProviderService_.retrieve(
            "search-postgres"
          )
          const upsert = jest
            .spyOn(provider, "upsertDocuments")
            .mockResolvedValue({
              index: "product",
              status: "failed",
              error: { message: "engine unavailable" },
            })

          await expect(
            ingest("product.updated", "prod_1")
          ).rejects.toThrow(/engine unavailable/)

          upsert.mockRestore()
        })
      })

      describe("reindexing", () => {
        it("rebuilds from the seed by swapping onto a shadow index", async () => {
          dataset.products = [
            { ...baseProducts[0], title: "Scarlet trail shoe" },
            ...baseProducts.slice(1),
          ]

          const { job_id, indexes } = await service.reindex()

          expect(indexes).toEqual(["product"])
          expect(job_id).toEqual(expect.any(String))

          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "scarlet" },
          })
          expect(ids(result)).toEqual(["prod_1"])
        })

        it("keeps the index searchable and the record ready after a rebuild", async () => {
          await service.reindex()

          const [record] = await indexRecords(service, { name: "product" })
          expect(record.status).toBe("ready")

          const result = await service.search({
            entity: "product",
            fields: ["id", "title"],
            filters: { q: "running" },
          })
          expect(ids(result).sort()).toEqual(["prod_1", "prod_2"])
        })

        it("appends a row per run instead of overwriting", async () => {
          await service.reindex()
          await service.reindex()

          const syncs = await syncRecords(service, {})

          // One from startup plus the two above.
          expect(syncs).toHaveLength(3)
          expect(syncs.every((sync) => sync.status === "done")).toBe(true)
          expect(new Set(syncs.map((sync) => sync.job_id)).size).toBe(3)
        })

        it("reindexes a subset in place and records the filters used", async () => {
          dataset.products = [
            { ...baseProducts[0], title: "Scarlet trail shoe" },
            ...baseProducts.slice(1),
          ]

          await service.reindex({ filters: { ids: ["prod_1"] } })

          // The filtered product is updated...
          const updated = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "scarlet" },
          })
          expect(ids(updated)).toEqual(["prod_1"])

          // ...and everything outside the filter survives, which is why a
          // partial run must never swap.
          const all = await service.search({
            entity: "product",
            fields: ["id"],
          })
          expect(ids(all).sort()).toEqual(["prod_1", "prod_2", "prod_3"])

          const syncs = await syncRecords(service, {})
          const partial = syncs.find((sync) => sync.filters !== null)

          expect(partial).toMatchObject({
            status: "done",
            documents_synced: 1,
            filters: { ids: ["prod_1"] },
          })
          expect(partial!.last_key).toBe("prod_1")
        })

        it("closes definition drift, which is the only way a schema changes", async () => {
          const [before] = await indexRecords(service, { name: "product" })

          // Stand in for a deploy that changed the definition. `upsertIndex`
          // deliberately does not reconcile schemas, so a rebuild is what
          // migrates the index and clears the drift.
          await updateIndexRecords(service, {
            selector: { id: before.id },
            data: { definition_hash: "stale", status: "pending" },
          })

          await service.reindex()

          const [after] = await indexRecords(service, { name: "product" })
          expect(after.definition_hash).toBe(before.definition_hash)
          expect(after.status).toBe("ready")

          // The rebuild has to end up populated. An empty one would mean the
          // seed never refilled it.
          const result = await service.search({
            entity: "product",
            fields: ["id"],
          })
          expect(ids(result).sort()).toEqual(["prod_1", "prod_2", "prod_3"])
        })

        it("rebuilds in place, clearing documents the seed no longer produces", async () => {
          await service.upsertDocuments({
            index: "product",
            documents: [{ ...baseProducts[0], id: "prod_stale" }],
          })

          dataset.products = [
            { ...baseProducts[0], title: "Vermilion trail shoe" },
            ...baseProducts.slice(1),
          ]

          await service.reindex({ strategy: "in_place" })

          // `in_place` writes into the live index rather than a shadow, but a
          // full (unfiltered) rebuild still clears it first, so the seed's
          // documents are refreshed...
          const refreshed = await service.search({
            entity: "product",
            fields: ["id"],
            filters: { q: "vermilion" },
          })
          expect(ids(refreshed)).toEqual(["prod_1"])

          // ...and anything the seed no longer produces is gone too.
          const all = await service.search({ entity: "product", fields: ["id"] })
          expect(ids(all).sort()).toEqual(["prod_1", "prod_2", "prod_3"])
        })

        it("rejects reindexing an unknown index", async () => {
          await expect(service.reindex({ index: "nope" })).rejects.toThrow(
            /No search index registered for "nope"/
          )
        })
      })

      describe("capability and definition validation", () => {
        it("forwards $or filters the engine can express", async () => {
          const result = await service.search({
            entity: "product",
            fields: ["id"],
            filters: {
              $or: [{ status: "draft" }, { brand: "borg" }],
            },
          })

          expect(ids(result).sort()).toEqual(["prod_2", "prod_3"])
        })

        it("rejects highlighting, which the provider has no support for", async () => {
          await expect(
            service.search({
              entity: "product",
              fields: ["id"],
              filters: { q: "running" },
              search_options: { highlight: { fields: ["title"] } },
            })
          ).rejects.toThrow(/does not support highlighting/)
        })

        it("rejects filtering on a field that is not filterable", async () => {
          await expect(
            service.search({
              entity: "product",
              fields: ["id"],
              filters: { title: "Red running shoe" },
            })
          ).rejects.toThrow(/Field "title" is not filterable/)
        })

        it("rejects sorting on a field that is not sortable", async () => {
          await expect(
            service.search({
              entity: "product",
              fields: ["id"],
              pagination: { order: { handle: "ASC" } },
            })
          ).rejects.toThrow(/Field "handle" is not sortable/)
        })

        it("rejects an unknown field", async () => {
          await expect(
            service.search({
              entity: "product",
              fields: ["id"],
              filters: { nope: "x" },
            })
          ).rejects.toThrow(/Unknown field "nope" used in filters/)
        })

        it("rejects searching an unknown index", async () => {
          await expect(
            service.search({ entity: "nope", fields: ["id"] })
          ).rejects.toThrow(/No search index registered for "nope"/)
        })
      })

      describe("searchMany", () => {
        it("runs several queries and preserves their order", async () => {
          const results = await service.searchMany([
            { entity: "product", fields: ["id"], filters: { q: "running" } },
            { entity: "product", fields: ["id"], filters: { status: "draft" } },
            {
              entity: "product",
              fields: ["id"],
              pagination: { order: { min_price: "DESC" }, take: 1 },
            },
          ])

          expect(results).toHaveLength(3)
          expect(ids(results[0]).sort()).toEqual(["prod_1", "prod_2"])
          expect(ids(results[1])).toEqual(["prod_3"])
          expect(ids(results[2])).toEqual(["prod_3"])
        })
      })
    }),
})
