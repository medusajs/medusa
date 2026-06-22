import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ICartModuleService, IPromotionModuleService } from "@medusajs/types"
import {
  Modules,
  PromotionStatus,
  PromotionType,
} from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store Carts API: Concurrent promotion requests", () => {
      let appContainer
      let cartModuleService: ICartModuleService
      let promotionModuleService: IPromotionModuleService
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()
        cartModuleService = appContainer.resolve(Modules.CART)
        promotionModuleService = appContainer.resolve(Modules.PROMOTION)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })
      })

      describe("POST /store/carts/:id/promotions", () => {
        it("should not create duplicate adjustments when the same promo code is sent concurrently", async () => {
          const promotion = await promotionModuleService.createPromotions({
            code: "CONCURRENT_TEST",
            type: PromotionType.STANDARD,
            status: PromotionStatus.ACTIVE,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "each",
              value: 500,
              apply_to_quantity: 1,
              currency_code: "usd",
              max_quantity: 1,
            },
          })

          const cart = await cartModuleService.createCarts({
            currency_code: "usd",
            items: [
              {
                id: "item-concurrent",
                unit_price: 2000,
                quantity: 1,
                title: "Test item",
                product_id: "prod_test",
              } as any,
            ],
          })

          const results = await Promise.all(
            Array.from({ length: 3 }, () =>
              api
                .post(
                  `/store/carts/${cart.id}/promotions`,
                  { promo_codes: [promotion.code] },
                  storeHeaders
                )
                .catch((e) => e)
            )
          )

          const successes = results.filter((r) => r.status === 200)
          expect(successes.length).toBeGreaterThanOrEqual(1)

          const finalCart = (
            await api.get(
              `/store/carts/${cart.id}?fields=*items,*items.adjustments`,
              storeHeaders
            )
          ).data.cart

          const item = finalCart.items.find(
            (i: any) => i.id === "item-concurrent"
          )

          const promoAdjustments = item.adjustments.filter(
            (a: any) => a.code === promotion.code
          )

          expect(promoAdjustments).toHaveLength(1)
          expect(promoAdjustments[0].amount).toBe(500)
        })
      })
    })
  },
})
