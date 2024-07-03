import { IPromotionModuleService } from "@medusajs/types"
import { ModuleRegistrationName, PromotionType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /admin/promotions/:id", () => {
      let appContainer
      let promotionModuleService: IPromotionModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        promotionModuleService = appContainer.resolve(
          ModuleRegistrationName.PROMOTION
        )
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should throw an error if id does not exist", async () => {
        const { response } = await api
          .post(
            `/admin/promotions/does-not-exist`,
            { type: PromotionType.STANDARD },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(404)
        expect(response.data.message).toEqual(
          `Promotion with id "does-not-exist" not found`
        )
      })

      it("should throw an error when both campaign and campaign_id params are passed", async () => {
        const createdPromotion = await promotionModuleService.createPromotions({
          code: "TEST",
          type: PromotionType.STANDARD,
          is_automatic: true,
          application_method: {
            target_type: "items",
            type: "fixed",
            allocation: "each",
            value: 100,
            max_quantity: 100,
            currency_code: "USD",
          },
        })

        const { response } = await api
          .post(
            `/admin/promotions/${createdPromotion.id}`,
            {
              campaign: {
                name: "test campaign",
              },
              campaign_id: "test",
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(400)
        // expect(response.data.message).toContain(
        //   `Failed XOR relation between "campaign_id" and "campaign"`
        // )
      })

      it("should update a promotion successfully", async () => {
        const createdPromotion = await promotionModuleService.createPromotions({
          code: "TEST",
          type: PromotionType.STANDARD,
          is_automatic: true,
          application_method: {
            target_type: "items",
            type: "fixed",
            allocation: "each",
            value: 100,
            max_quantity: 100,
            currency_code: "USD",
          },
        })

        const response = await api.post(
          `/admin/promotions/${createdPromotion.id}`,
          {
            code: "TEST_TWO",
            application_method: {
              value: 200,
            },
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.promotion).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            code: "TEST_TWO",
            application_method: expect.objectContaining({
              value: 200,
            }),
          })
        )
      })

      it("should update a buyget promotion successfully", async () => {
        const createdPromotion = await promotionModuleService.createPromotions({
          code: "PROMOTION_TEST",
          type: PromotionType.BUYGET,
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "across",
            value: 100,
            apply_to_quantity: 1,
            buy_rules_min_quantity: 1,
            currency_code: "USD",
            buy_rules: [
              {
                attribute: "product_collection.id",
                operator: "eq",
                values: ["pcol_towel"],
              },
            ],
            target_rules: [
              {
                attribute: "product.id",
                operator: "eq",
                values: "prod_mat",
              },
            ],
          },
        })

        const response = await api.post(
          `/admin/promotions/${createdPromotion.id}`,
          {
            code: "TEST_TWO",
            application_method: {
              value: 200,
              buy_rules_min_quantity: 6,
            },
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.promotion).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            code: "TEST_TWO",
            application_method: expect.objectContaining({
              value: 200,
              buy_rules_min_quantity: 6,
            }),
          })
        )
      })
    })
  },
})
