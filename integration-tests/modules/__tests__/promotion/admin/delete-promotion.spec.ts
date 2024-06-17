import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
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
    describe("DELETE /admin/promotions/:id", () => {
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

      it("should delete promotion successfully", async () => {
        const createdPromotion = await promotionModuleService.createPromotions({
          code: "TEST",
          type: "standard",
          application_method: {
            type: "fixed",
            target_type: "order",
            value: "100",
            currency_code: "USD",
          },
        })

        const deleteRes = await api.delete(
          `/admin/promotions/${createdPromotion.id}`,
          adminHeaders
        )

        expect(deleteRes.status).toEqual(200)

        const promotions = await promotionModuleService.listPromotions({
          id: [createdPromotion.id],
        })

        expect(promotions.length).toEqual(0)
      })
    })
  },
})
