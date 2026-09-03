import { SearchTypes } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import {
  productIndex,
  products,
} from "../__fixtures__/medusa-cloud-product-index"

type SearchService = SearchTypes.ISearchModuleService

const apiKey = process.env.MEDUSA_CLOUD_API_KEY
const endpoint = process.env.MEDUSA_CLOUD_SEARCH_ENDPOINT
const environmentHandle = process.env.MEDUSA_CLOUD_ENVIRONMENT_HANDLE

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
      indexes: [productIndex],
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
          const provider = (service as any).context_.providers.retrieve(
            "search-medusa"
          )
          await provider.deleteIndex({ index: productIndex.name })
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
          expect(withTypo.hits.map((hit) => hit.id)).toContain(
            "prod_medusa_2"
          )

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
      }),
  })
} else {
  describe.skip("Medusa Cloud Search Provider", () => {
    it("requires Medusa Cloud search credentials", () => {})
  })
}
