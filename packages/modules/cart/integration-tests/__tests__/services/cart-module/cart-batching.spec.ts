import { ICartModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(300000)

moduleIntegrationTestRunner<ICartModuleService>({
  moduleName: Modules.CART,
  testSuite: ({ service }) => {
    describe("CartModuleService - batched selector-based updates", () => {
      const BATCH_SIZE = 2000

      describe("updateCarts() - batching with selector", () => {
        it("should update all carts when selector matches more than BATCH_SIZE records", async () => {
          const COUNT = BATCH_SIZE + 50 // 550 — spans two batches

          // Create COUNT carts all sharing the same currency_code
          await Promise.all(
            Array.from({ length: COUNT }, () =>
              service.createCarts({
                currency_code: "usd",
              })
            )
          )

          // Update all USD carts via selector to a metadata flag
          const updated = await service.updateCarts(
            { currency_code: "usd" },
            { metadata: { batch_tested: true } }
          )

          expect(updated).toHaveLength(COUNT)
          expect(
            updated.every((c) => c.metadata?.batch_tested === true)
          ).toBe(true)
        })

        it("should update all carts spanning three or more batches", async () => {
          const COUNT = BATCH_SIZE * 2 + 10 // 1010 — three batches

          await Promise.all(
            Array.from({ length: COUNT }, () =>
              service.createCarts({
                currency_code: "eur",
              })
            )
          )

          const updated = await service.updateCarts(
            { currency_code: "eur" },
            { metadata: { multi_batch: true } }
          )

          expect(updated).toHaveLength(COUNT)
          expect(
            updated.every((c) => c.metadata?.multi_batch === true)
          ).toBe(true)
        })

        it("should only update carts that match the selector", async () => {
          const usdCount = BATCH_SIZE + 20
          const gbpCount = 15

          await Promise.all([
            ...Array.from({ length: usdCount }, () =>
              service.createCarts({ currency_code: "usd" })
            ),
            ...Array.from({ length: gbpCount }, () =>
              service.createCarts({ currency_code: "gbp" })
            ),
          ])

          const updated = await service.updateCarts(
            { currency_code: "usd" },
            { metadata: { touched: true } }
          )

          // Only USD carts should be updated
          expect(updated).toHaveLength(usdCount)
          expect(updated.every((c) => c.currency_code === "usd")).toBe(true)

          // GBP carts must remain untouched
          const gbpCarts = await service.listCarts({ currency_code: "gbp" })
          expect(gbpCarts).toHaveLength(gbpCount)
          expect(gbpCarts.every((c) => !c.metadata?.touched)).toBe(true)
        })

        it("should update exactly BATCH_SIZE carts without missing any", async () => {
          const COUNT = BATCH_SIZE

          await Promise.all(
            Array.from({ length: COUNT }, () =>
              service.createCarts({ currency_code: "jpy" })
            )
          )

          const updated = await service.updateCarts(
            { currency_code: "jpy" },
            { metadata: { exact_batch: true } }
          )

          expect(updated).toHaveLength(COUNT)
          expect(
            updated.every((c) => c.metadata?.exact_batch === true)
          ).toBe(true)
        })
      })
    })
  },
})
