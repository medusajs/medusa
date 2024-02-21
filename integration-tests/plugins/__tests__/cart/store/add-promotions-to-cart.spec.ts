import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService, IPromotionModuleService } from "@medusajs/types"
import { PromotionType } from "@medusajs/utils"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import adminSeeder from "../../../../helpers/admin-seeder"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("Store Carts API: Add promotions to cart", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let cartModuleService: ICartModuleService
  let promotionModuleService: IPromotionModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
    promotionModuleService = appContainer.resolve(
      ModuleRegistrationName.PROMOTION
    )
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  describe("POST /store/carts/:id/promotions", () => {
    it("should add promotions to a cart", async () => {
      const appliedPromotion = await promotionModuleService.create({
        code: "PROMOTION_APPLIED",
        type: PromotionType.STANDARD,
        application_method: {
          type: "fixed",
          target_type: "items",
          allocation: "each",
          value: "300",
          apply_to_quantity: 1,
          max_quantity: 1,
          target_rules: [
            {
              attribute: "product_id",
              operator: "eq",
              values: "prod_tshirt",
            },
          ],
        },
      })

      const createdPromotion = await promotionModuleService.create({
        code: "PROMOTION_TEST",
        type: PromotionType.STANDARD,
        application_method: {
          type: "fixed",
          target_type: "items",
          allocation: "across",
          value: "1000",
          apply_to_quantity: 1,
          target_rules: [
            {
              attribute: "product_id",
              operator: "eq",
              values: "prod_mat",
            },
          ],
        },
      })

      const cart = await cartModuleService.create({
        currency_code: "usd",
        items: [
          // Adjustment to add
          {
            id: "item-1",
            unit_price: 2000,
            raw_unit_price: {},
            quantity: 1,
            title: "Test item",
            product_id: "prod_mat",
          } as any,
          {
            id: "item-2",
            unit_price: 1000,
            raw_unit_price: {},
            quantity: 1,
            title: "Test item",
            product_id: "prod_tshirt",
          } as any,
        ],
      })

      // Adjustment to keep
      await cartModuleService.addLineItemAdjustments([
        {
          code: appliedPromotion.code,
          amount: 300,
          item_id: "item-2",
          promotion_id: appliedPromotion.id,
        },
      ])

      const api = useApi() as any

      const created = await api.post(`/store/carts/${cart.id}/promotions`, {
        promo_codes: [createdPromotion.code],
      })

      expect(created.status).toEqual(200)
      expect(created.data.cart).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          items: expect.arrayContaining([
            expect.objectContaining({
              id: "item-1",
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  promotion_id: createdPromotion.id,
                  code: createdPromotion.code,
                  amount: 1000,
                }),
              ]),
            }),
            expect.objectContaining({
              id: expect.any(String),
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  promotion_id: appliedPromotion.id,
                  code: appliedPromotion.code,
                  amount: 300,
                }),
              ]),
            }),
          ]),
        })
      )
    })
  })
})
