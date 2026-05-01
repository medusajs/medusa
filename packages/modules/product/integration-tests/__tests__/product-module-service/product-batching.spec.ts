import { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(300000)

moduleIntegrationTestRunner<IProductModuleService>({
  moduleName: Modules.PRODUCT,
  testSuite: ({ service }) => {
    describe("ProductModuleService - batched selector-based updates", () => {
      const BATCH_SIZE = 2000

      afterEach(async () => {
        // Cleanup handled by test runner between suites
      })

      describe("updateProducts() - batching with selector", () => {
        it("should update all products when selector matches more than BATCH_SIZE records", async () => {
          const COUNT = BATCH_SIZE + 50 // 550 — spans two batches

          // Create COUNT draft products
          const created = await service.createProducts(
            Array.from({ length: COUNT }, (_, i) => ({
              title: `Batch Test Product ${i}`,
              status: "draft",
            }))
          )
          expect(created).toHaveLength(COUNT)

          // Update all draft products to published via selector
          const updated = await service.updateProducts(
            { status: "draft" },
            { status: "published" }
          )

          expect(updated).toHaveLength(COUNT)
          expect(updated.every((p) => p.status === "published")).toBe(true)
        })

        it("should update all products when selector matches exactly BATCH_SIZE records", async () => {
          const COUNT = BATCH_SIZE

          const created = await service.createProducts(
            Array.from({ length: COUNT }, (_, i) => ({
              title: `Exact Batch Product ${i}`,
              status: "draft",
            }))
          )
          expect(created).toHaveLength(COUNT)

          const updated = await service.updateProducts(
            { status: "draft" },
            { status: "published" }
          )

          expect(updated).toHaveLength(COUNT)
          expect(updated.every((p) => p.status === "published")).toBe(true)
        })

        it("should update all products spanning three or more batches", async () => {
          const COUNT = BATCH_SIZE * 2 + 10 // 1010 — three batches

          const created = await service.createProducts(
            Array.from({ length: COUNT }, (_, i) => ({
              title: `Multi Batch Product ${i}`,
              status: "draft",
            }))
          )
          expect(created).toHaveLength(COUNT)

          const updated = await service.updateProducts(
            { status: "draft" },
            { status: "published" }
          )

          expect(updated).toHaveLength(COUNT)
          expect(updated.every((p) => p.status === "published")).toBe(true)
        })

        it("should not update products that do not match the selector", async () => {
          const draftCount = BATCH_SIZE + 50
          const publishedCount = 10

          await service.createProducts(
            Array.from({ length: draftCount }, (_, i) => ({
              title: `Draft Product ${i}`,
              status: "draft",
            }))
          )

          await service.createProducts(
            Array.from({ length: publishedCount }, (_, i) => ({
              title: `Published Product ${i}`,
              status: "published",
            }))
          )

          const updated = await service.updateProducts(
            { status: "draft" },
            { status: "proposed" }
          )

          // Only draft products should be updated
          expect(updated).toHaveLength(draftCount)
          expect(updated.every((p) => p.status === "proposed")).toBe(true)

          // Published products should remain unchanged
          const remaining = await service.listProducts({ status: "published" })
          expect(remaining).toHaveLength(publishedCount)
        })
      })

      describe("updateProductVariants() - batching with selector", () => {
        it("should update all variants when selector matches more than BATCH_SIZE records", async () => {
          const VARIANT_COUNT = BATCH_SIZE + 50

          // Create one product with many variants
          const [product] = await service.createProducts([
            {
              title: "Product with many variants",
              options: [{ title: "Size", values: ["one-size"] }],
              variants: Array.from({ length: VARIANT_COUNT }, (_, i) => ({
                title: `Variant ${i}`,
                sku: `sku-variant-batch-${i}`,
                options: { Size: "one-size" },
              })),
            },
          ])

          expect(product.variants).toHaveLength(VARIANT_COUNT)

          // Update all variants by product_id selector
          const updated = await service.updateProductVariants(
            { product_id: product.id },
            { title: "Updated Variant Title" }
          )

          expect(updated).toHaveLength(VARIANT_COUNT)
          expect(
            updated.every((v) => v.title === "Updated Variant Title")
          ).toBe(true)
        })
      })

      describe("updateProductCollections() - batching with selector", () => {
        it("should update all collections when selector matches more than BATCH_SIZE records", async () => {
          const COUNT = BATCH_SIZE + 20

          await service.createProductCollections(
            Array.from({ length: COUNT }, (_, i) => ({
              title: `Collection ${i}`,
              handle: `collection-batch-${i}`,
            }))
          )

          const updated = await service.updateProductCollections(
            {},
            { metadata: { batched: true } }
          )

          expect(updated.length).toBeGreaterThanOrEqual(COUNT)
          expect(
            updated.every((c) => c.metadata?.batched === true)
          ).toBe(true)
        })
      })

      describe("updateProductTags() - batching with selector", () => {
        it("should update all tags when selector matches more than BATCH_SIZE records", async () => {
          const COUNT = BATCH_SIZE + 30

          await service.createProductTags(
            Array.from({ length: COUNT }, (_, i) => ({
              value: `tag-batch-${i}`,
            }))
          )

          // Tags all share the same empty selector — all should be updated
          const updated = await service.updateProductTags(
            {},
            { value: "updated-tag" }
          )

          expect(updated.length).toBeGreaterThanOrEqual(COUNT)
        })
      })

      describe("updateProductTypes() - batching with selector", () => {
        it("should update all types when selector matches more than BATCH_SIZE records", async () => {
          const COUNT = BATCH_SIZE + 10

          await service.createProductTypes(
            Array.from({ length: COUNT }, (_, i) => ({
              value: `type-batch-${i}`,
            }))
          )

          const updated = await service.updateProductTypes(
            {},
            { value: "updated-type" }
          )

          expect(updated.length).toBeGreaterThanOrEqual(COUNT)
        })
      })
    })
  },
})
