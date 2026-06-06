import { Modules } from "@zjedene-medusa/framework/utils"
import { moduleIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { ICachingModuleService } from "@zjedene-medusa/framework/types"
import { MedusaModule } from "@zjedene-medusa/framework/modules-sdk"

jest.setTimeout(10000)

jest.spyOn(MedusaModule, "getAllJoinerConfigs").mockReturnValue([
  {
    schema: `
   type Product {
    id: ID
    title: String
    handle: String
    status: String
    type_id: String
    collection_id: String
    is_giftcard: Boolean
    external_id: String
    created_at: DateTime
    updated_at: DateTime

    variants: [ProductVariant]
    sales_channels: [SalesChannel]
  }

  type ProductVariant {
    id: ID
    product_id: String
    sku: String

    prices: [Price]
  }
  
  type Price {
    id: ID
    amount: Float
    currency_code: String
  }

  type SalesChannel {
    id: ID
    is_disabled: Boolean
  }
`,
  },
])

moduleIntegrationTestRunner<ICachingModuleService>({
  moduleName: Modules.CACHING,
  moduleOptions: {
    in_memory: {
      enable: true,
      maxSize: 1000,
    },
  },
  testSuite: ({ service }) => {
    describe("Memory Cache maxSize Integration", () => {
      beforeEach(async () => {
        await service.clear({ tags: ["*"] }).catch(() => {})
      })

      it("should respect maxSize limit and stop caching when exceeded", async () => {
        // Create test data that will use most of the 1000 byte limit
        const largeData = {
          id: "large-test",
          name: "Large Test Item",
          description: "A".repeat(400), // 400 characters
          metadata: { info: "B".repeat(300) }, // Another 300 characters
        }

        await service.set({
          key: "first-key",
          data: largeData,
          tags: ["large-data"],
        })

        let result = await service.get({ key: "first-key" })
        expect(result).toEqual(largeData)

        const anotherLargeData = {
          id: "another-large",
          content: "C".repeat(500), // This should push us over the 1000 byte limit but accepted because we are still bellow
        }

        await service.set({
          key: "second-key",
          data: anotherLargeData,
          tags: ["overflow-data"],
        })

        result = await service.get({ key: "second-key" })
        expect(result).toEqual(anotherLargeData)

        const anotherLargeData2 = {
          id: "another-large-2",
          content: "D".repeat(500), // This should push us over the 1000 byte limit but rejected because we are over the limit
        }

        await service.set({
          key: "third-key",
          data: anotherLargeData2,
          tags: ["overflow-data-2"],
        })

        result = await service.get({ key: "third-key" })
        expect(result).toBeNull()

        const firstResult = await service.get({ key: "first-key" })
        expect(firstResult).toEqual(largeData)
      })

      it("should allow small entries after reaching the limit", async () => {
        const largeData = {
          id: "large-test",
          description: "A".repeat(800), // Use most of the 1000 byte limit
        }

        await service.set({
          key: "large-key",
          data: largeData,
          tags: ["large"],
        })

        let result = await service.get({ key: "large-key" })
        expect(result).toEqual(largeData)

        await service.set({
          key: "overflow-key",
          data: { content: "B".repeat(500) },
        })

        result = await service.get({ key: "overflow-key" })
        expect(result).toEqual({ content: "B".repeat(500) })

        await service.set({
          key: "overflow-key-2",
          data: { content: "C".repeat(500) },
        })

        result = await service.get({ key: "overflow-key-2" })
        expect(result).toBeNull()

        // Remove the large entry to free up space
        await service.clear({ key: "large-key" })

        // Now small entries should work again
        const smallData = { id: "small", name: "Small Item" }
        await service.set({
          key: "small-key",
          data: smallData,
        })

        result = await service.get({ key: "small-key" })
        expect(result).toEqual(smallData)
      })
    })
  },
})
