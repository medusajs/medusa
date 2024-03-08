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
    describe("DELETE /admin/campaigns/:id", () => {
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

      it("should delete campaign successfully", async () => {
        const [createdCampaign] = await promotionModuleService.createCampaigns([
          {
            name: "test",
            campaign_identifier: "test",
            starts_at: new Date("01/01/2024"),
            ends_at: new Date("01/01/2025"),
          },
        ])

        const deleteRes = await api.delete(
          `/admin/campaigns/${createdCampaign.id}`,
          adminHeaders
        )

        expect(deleteRes.status).toEqual(200)

        const campaigns = await promotionModuleService.listCampaigns({
          id: [createdCampaign.id],
        })

        expect(campaigns.length).toEqual(0)
      })
    })
  },
})
