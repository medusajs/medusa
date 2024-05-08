import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { CampaignBudgetType, PromotionType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

export const campaignData = {
  name: "campaign 1",
  description: "test description",
  currency: "USD",
  campaign_identifier: "test-1",
  starts_at: new Date("01/01/2023").toISOString(),
  ends_at: new Date("01/01/2024").toISOString(),
  budget: {
    type: CampaignBudgetType.SPEND,
    limit: 1000,
    used: 0,
  },
}

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin Campaigns API", () => {
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

      const generatePromotionData = () => {
        const code = Math.random().toString(36).substring(7)

        return {
          code,
          type: PromotionType.STANDARD,
          is_automatic: true,
          application_method: {
            target_type: "items",
            type: "fixed",
            allocation: "each",
            value: 100,
            max_quantity: 100,
            target_rules: [],
          },
          rules: [],
        }
      }

      describe("POST /admin/campaigns/:id/promotions", () => {
        it("should add or remove promotions from campaign", async () => {
          const campaign = (
            await api.post(`/admin/campaigns`, campaignData, adminHeaders)
          ).data.campaign

          const promotion1 = (
            await api.post(
              `/admin/promotions`,
              generatePromotionData(),
              adminHeaders
            )
          ).data.promotion

          const promotion2 = (
            await api.post(
              `/admin/promotions`,
              generatePromotionData(),
              adminHeaders
            )
          ).data.promotion

          let response = await api.post(
            `/admin/campaigns/${campaign.id}/promotions`,
            { add: [promotion1.id, promotion2.id] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.campaign).toEqual(
            expect.objectContaining({
              id: expect.any(String),
            })
          )

          response = await api.get(
            `/admin/promotions?campaign_id=${campaign.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotions).toHaveLength(2)
          expect(response.data.promotions).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: promotion1.id,
              }),
              expect.objectContaining({
                id: promotion2.id,
              }),
            ])
          )

          await api.post(
            `/admin/campaigns/${campaign.id}/promotions`,
            { remove: [promotion1.id] },
            adminHeaders
          )

          response = await api.get(
            `/admin/promotions?campaign_id=${campaign.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotions).toHaveLength(1)
          expect(response.data.promotions).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: promotion2.id,
              }),
            ])
          )
        })
      })
    })
  },
})
