import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { PromotionType } from "@medusajs/utils"
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
    describe("GET /admin/promotions/:id", () => {
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
          .get(`/admin/promotions/does-not-exist`, adminHeaders)
          .catch((e) => e)

        expect(response.status).toEqual(404)
        expect(response.data.message).toEqual(
          "Promotion with id or code: does-not-exist was not found"
        )
      })

      it("should get the requested promotion by id or codde", async () => {
        const createdPromotion = await promotionModuleService.create({
          code: "TEST",
          type: PromotionType.STANDARD,
          application_method: {
            type: "fixed",
            target_type: "order",
            value: "100",
          },
        })

        let response = await api.get(
          `/admin/promotions/${createdPromotion.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.promotion).toEqual(
          expect.objectContaining({
            id: createdPromotion.id,
          })
        )

        response = await api.get(
          `/admin/promotions/${createdPromotion.code}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.promotion).toEqual(
          expect.objectContaining({
            id: createdPromotion.id,
          })
        )
      })

      it("should get the requested promotion with filtered fields and relations", async () => {
        const createdPromotion = await promotionModuleService.create({
          code: "TEST",
          type: PromotionType.STANDARD,
          application_method: {
            type: "fixed",
            target_type: "order",
            value: "100",
          },
        })

        const response = await api.get(
          `/admin/promotions/${createdPromotion.id}?fields=id,code&expand=`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.promotion).toEqual({
          id: expect.any(String),
          code: "TEST",
        })
      })
    })
  },
})
