import { IPromotionModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /admin/campaigns/:id", () => {
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
          .post(`/admin/campaigns/does-not-exist`, {}, adminHeaders)
          .catch((e) => e)

        expect(response.status).toEqual(404)
        expect(response.data.message).toEqual(
          `Campaign with id "does-not-exist" not found`
        )
      })

      it("should update a campaign successfully", async () => {
        const createdPromotion = await promotionModuleService.create({
          code: "TEST",
          type: "standard",
        })

        const createdPromotion2 = await promotionModuleService.create({
          code: "TEST_2",
          type: "standard",
        })

        const createdCampaign = await promotionModuleService.createCampaigns({
          name: "test",
          campaign_identifier: "test",
          starts_at: new Date("01/01/2024").toISOString(),
          ends_at: new Date("01/01/2029").toISOString(),
          promotions: [{ id: createdPromotion.id }],
          budget: {
            limit: 1000,
            type: "usage",
            used: 10,
          },
        })

        const response = await api.post(
          `/admin/campaigns/${createdCampaign.id}?fields=*promotions`,
          {
            name: "test-2",
            campaign_identifier: "test-2",
            budget: {
              limit: 2000,
            },
            promotions: [{ id: createdPromotion2.id }],
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.campaign).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "test-2",
            campaign_identifier: "test-2",
            budget: expect.objectContaining({
              limit: 2000,
              type: "usage",
              used: 10,
            }),
            promotions: [
              expect.objectContaining({
                id: createdPromotion2.id,
              }),
            ],
          })
        )
      })
    })
  },
})
