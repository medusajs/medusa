import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ICartModuleService, IPromotionModuleService } from "@medusajs/types"
import { Modules, PromotionStatus, PromotionType } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(900 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    describe("Store Carts API: minimum spend promotion rules", () => {
      let appContainer
      let cartModuleService: ICartModuleService
      let promotionModuleService: IPromotionModuleService
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()
        cartModuleService = appContainer.resolve(Modules.CART)
        promotionModuleService = appContainer.resolve(Modules.PROMOTION)
      })

      beforeAll(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        await dbUtils.snapshot()
      })

      describe("POST /store/carts/:id", () => {
        it.each(["item_total", "total", "item_subtotal"])(
          "should keep a promotion with a minimum on %s after a cart update",
          async (attribute) => {
            const code = `SPEND20_${attribute}`
            await promotionModuleService.createPromotions({
              code,
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              application_method: {
                type: "percentage",
                target_type: "items",
                allocation: "across",
                value: 10,
                currency_code: "usd",
              },
              rules: [
                {
                  attribute,
                  operator: "gte",
                  values: ["20"],
                },
              ],
            })

            const salesChannel = await appContainer
              .resolve(Modules.SALES_CHANNEL)
              .createSalesChannels({ name: `Webshop ${attribute}` })

            const cart = await cartModuleService.createCarts({
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              items: [
                {
                  unit_price: 10,
                  quantity: 2,
                  title: "Test item",
                  product_id: "prod_test",
                } as any,
              ],
            })

            const applied = (
              await api.post(
                `/store/carts/${cart.id}/promotions`,
                { promo_codes: [code] },
                storeHeaders
              )
            ).data.cart

            expect(applied.promotions.map((p) => p.code)).toEqual([code])
            expect(applied.item_total).toBe(18)

            const updated = (
              await api.post(
                `/store/carts/${cart.id}`,
                { email: "customer@example.com" },
                storeHeaders
              )
            ).data.cart

            expect(updated.promotions.map((p) => p.code)).toEqual([code])
            expect(updated.item_total).toBe(18)
          }
        )
      })
    })
  },
})
