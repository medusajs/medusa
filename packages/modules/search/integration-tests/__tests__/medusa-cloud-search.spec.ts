import { SearchTypes } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { MedusaSearchService } from "../../src/providers/search-medusa/services/medusa-search"
import {
  embeddedProductIndex,
  productIndex,
  products,
  vector,
  vectorProductIndex,
} from "../__fixtures__/medusa-cloud-product-index"

type SearchService = SearchTypes.ISearchModuleService

const apiKey = process.env.MEDUSA_CLOUD_API_KEY
const endpoint = process.env.MEDUSA_CLOUD_SEARCH_ENDPOINT
const environmentHandle = process.env.MEDUSA_CLOUD_ENVIRONMENT_HANDLE
// How the Cloud environment does vector search, which the tests can't ask it:
// unset when it doesn't, "client" when the app supplies the vectors, and
// "managed" when Cloud can also embed text itself.
const vectorMode = process.env.MEDUSA_CLOUD_VECTOR_SEARCH
if (vectorMode && vectorMode !== "client" && vectorMode !== "managed") {
  throw new Error(
    `MEDUSA_CLOUD_VECTOR_SEARCH must be "client" or "managed", got "${vectorMode}"`
  )
}
const vectorSearch = !!vectorMode
const managedEmbeddings = vectorMode === "managed"
const vectorIt = vectorSearch ? it : it.skip
const embedIt = managedEmbeddings ? it : it.skip

if (apiKey && endpoint && environmentHandle) {
  jest.setTimeout(120000)

  const boot = (service: SearchService) =>
    (service as any).onApplicationStart_() as Promise<void>

  moduleIntegrationTestRunner<SearchService>({
    moduleName: Modules.SEARCH,
    resolve: __dirname + "/../../src",
    moduleOptions: {
      cloud: {
        api_key: apiKey,
        endpoint,
        environment_handle: environmentHandle,
      },
      default_provider: "search-medusa",
      indexes: [
        productIndex,
        ...(vectorSearch ? [vectorProductIndex] : []),
        ...(managedEmbeddings ? [embeddedProductIndex] : []),
      ],
    },
    hooks: {
      afterModuleInit: async (_app: any, service: SearchService) => {
        await service.executeIndexMigrationPlan(
          await service.createIndexMigrationPlan()
        )
        await boot(service)
      },
    },
    testSuite: ({ service }) =>
      describe("Medusa Cloud Search Provider", () => {
        afterAll(async () => {
          const provider = new MedusaSearchService(
            {},
            { api_key: apiKey, endpoint, environment_handle: environmentHandle }
          )
          const names = [
            productIndex.name,
            vectorProductIndex.name,
            embeddedProductIndex.name,
          ]
          for (const index of await provider.listIndexes()) {
            if (names.some((name) => index.name.startsWith(name))) {
              await provider.deleteIndex({ index: index.name })
            }
          }
        })

        vectorIt("ranks by a vector alone", async () => {
          const result = await service.search({
            entity: vectorProductIndex.name,
            search_options: { vector: { value: vector(1, 0) } },
          })

          expect(result.hits.map((hit) => hit.id)).toEqual([
            "prod_vector_1",
            "prod_vector_3",
            "prod_vector_2",
          ])
        })

        vectorIt("combines a text query and a vector query", async () => {
          const result = await service.search({
            entity: vectorProductIndex.name,
            filters: { q: "red shoe" },
            search_options: { vector: { value: vector(1, 0) } },
          })

          const ids = result.hits.map((hit) => hit.id)
          // Matches on both sides.
          expect(ids[0]).toBe("prod_vector_1")
          // Only the vector side finds it, a text search alone would not.
          expect(ids).toContain("prod_vector_3")
          expect(ids.indexOf("prod_vector_3")).toBeLessThan(
            ids.indexOf("prod_vector_2")
          )
          expect(result.metadata.count).toBe(3)
        })

        vectorIt("deduplicates combined text and vector results", async () => {
          const result = await service.search({
            entity: vectorProductIndex.name,
            fields: ["id", "title"],
            filters: { q: "red shoe" },
            search_options: {
              vector: { value: vector(1, 0) },
              distinct: "category",
            },
          })

          // prod_vector_3 shares its category with the better ranked prod_vector_1.
          expect(result.hits.map((hit) => hit.id)).toEqual([
            "prod_vector_1",
            "prod_vector_2",
          ])
        })

        vectorIt(
          "leans on the vector query as semantic_ratio grows",
          async () => {
            // Only prod_vector_2 has the word, only prod_vector_1 is close in meaning.
            const search = (semantic_ratio: number) =>
              service.search({
                entity: vectorProductIndex.name,
                filters: { q: "cotton" },
                search_options: {
                  vector: { value: vector(1, 0), semantic_ratio },
                },
              })

            // prod_vector_2 is on both sides, so only a ratio close to 1 lets
            // the vector side's first row pass it.
            const [keyword, semantic] = await Promise.all([
              search(0.1),
              search(0.99),
            ])
            expect(keyword.hits[0].id).toBe("prod_vector_2")
            expect(semantic.hits[0].id).toBe("prod_vector_1")
          }
        )

        embedIt(
          "combines a text query with text that Cloud embeds",
          async () => {
            const result = await service.search({
              entity: embeddedProductIndex.name,
              filters: { q: "red shoe" },
              search_options: { vector: { query: "red shoe" } },
            })

            const ids = result.hits.map((hit) => hit.id)
            expect(ids[0]).toBe("prod_vector_1")
            // No word in common with the query, so only its meaning finds it.
            expect(ids).toContain("prod_vector_3")
          }
        )

        vectorIt("pages through combined text and vector results", async () => {
          const search = (skip: number) =>
            service.search({
              entity: vectorProductIndex.name,
              filters: { q: "red shoe" },
              search_options: { vector: { value: vector(1, 0) } },
              pagination: { skip, take: 1 },
            })

          const pages = await Promise.all([search(0), search(1), search(2)])
          expect(pages.map((page) => page.hits[0]?.id)).toEqual([
            "prod_vector_1",
            "prod_vector_3",
            "prod_vector_2",
          ])
        })

        it("seeds and searches documents", async () => {
          const result = await service.search({
            entity: productIndex.name,
            filters: { q: "running" },
            pagination: { take: 10 },
          })

          expect(result.hits).toHaveLength(products.length)
          expect(result.metadata.count).toBe(products.length)

          const provider = (service as any).context_.providers.retrieve(
            "search-medusa"
          )
          const indexes = await provider.listIndexes()
          expect(indexes).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                name: productIndex.name,
                provider: "search-medusa",
                document_count: products.length,
              }),
            ])
          )
        })

        it("filters and returns facets", async () => {
          const result = await service.search({
            entity: productIndex.name,
            filters: { status: "published" },
            search_options: { facets: ["tags"] },
          })

          expect(result.facets?.tags).toMatchObject({
            type: "value",
            values: expect.arrayContaining([{ value: "sport", count: 2 }]),
          })
        })

        it("counts distinct values when results are deduplicated", async () => {
          const result = await service.search({
            entity: productIndex.name,
            search_options: { distinct: "status" },
          })

          expect(result.hits).toHaveLength(1)
          expect(result.metadata.count).toBe(1)
        })

        it("matches text case-insensitively", async () => {
          const result = await service.search({
            entity: productIndex.name,
            filters: { q: "RED RUNNING" },
          })

          expect(result.hits.map((hit) => hit.id)).toContain("prod_medusa_1")
        })

        it("tolerates typos through the Fuzzy fallback when typo_tolerance is on", async () => {
          const withTypo = await service.search({
            entity: productIndex.name,
            filters: { q: "runing shurt" },
            search_options: { typo_tolerance: true },
          })
          expect(withTypo.hits.map((hit) => hit.id)).toContain("prod_medusa_2")

          const withoutTypo = await service.search({
            entity: productIndex.name,
            filters: { q: "runing shurt" },
          })
          expect(withoutTypo.hits).toHaveLength(0)
        })

        it("returns highlighted fragments around the matched terms", async () => {
          const result = await service.search({
            entity: productIndex.name,
            filters: { q: "running" },
            search_options: { highlight: { fields: ["title"] } },
          })

          const hit = result.hits.find((h) => h.id === "prod_medusa_1")
          expect(hit?.highlights?.title?.[0]).toContain("<mark>")
          expect(hit?.highlights?.title?.[0].toLowerCase()).toContain(
            "<mark>running</mark>"
          )
        })

        it("highlights searchable fields when highlight is true", async () => {
          const result = await service.search({
            entity: productIndex.name,
            filters: { q: "running" },
            search_options: { highlight: true },
          })

          const hit = result.hits.find((h) => h.id === "prod_medusa_1")
          expect(hit?.highlights?.title?.[0].toLowerCase()).toContain(
            "<mark>running</mark>"
          )
        })

        it("ignores highlighting and typo tolerance when there is no text query", async () => {
          const result = await service.search({
            entity: productIndex.name,
            search_options: { highlight: true, typo_tolerance: true },
          })

          expect(result.hits.length).toBeGreaterThan(0)
          expect(result.hits.every((hit) => !hit.highlights)).toBe(true)
        })
      }),
  })
} else {
  describe.skip("Medusa Cloud Search Provider", () => {
    it("requires Medusa Cloud search credentials", () => {})
  })
}
