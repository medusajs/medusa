import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { CampaignBudgetType } from "@medusajs/utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

export const campaignsData = [
  {
    id: "campaign-id-1",
    name: "campaign 1",
    description: "test description",
    currency: "USD",
    campaign_identifier: "test-1",
    starts_at: new Date("01/01/2023"),
    ends_at: new Date("01/01/2024"),
    budget: {
      type: CampaignBudgetType.SPEND,
      limit: 1000,
      used: 0,
    },
  },
  {
    id: "campaign-id-2",
    name: "campaign 2",
    description: "test description",
    currency: "USD",
    campaign_identifier: "test-2",
    starts_at: new Date("01/01/2023"),
    ends_at: new Date("01/01/2024"),
    budget: {
      type: CampaignBudgetType.USAGE,
      limit: 1000,
      used: 0,
    },
  },
]

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("GET /admin/campaigns", () => {
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
        await promotionModuleService.createCampaigns(campaignsData)
      })

      it("should get all campaigns and its count", async () => {
        const response = await api.get(`/admin/campaigns`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(2)
        expect(response.data.campaigns).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: "campaign 1",
              description: "test description",
              currency: "USD",
              campaign_identifier: "test-1",
              starts_at: expect.any(String),
              ends_at: expect.any(String),
              budget: {
                id: expect.any(String),
                type: "spend",
                limit: 1000,
                used: 0,
                raw_limit: {
                  precision: 20,
                  value: "1000",
                },
                raw_used: {
                  precision: 20,
                  value: "0",
                },
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
              },
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
            }),
            expect.objectContaining({
              id: expect.any(String),
              name: "campaign 2",
              description: "test description",
              currency: "USD",
              campaign_identifier: "test-2",
              starts_at: expect.any(String),
              ends_at: expect.any(String),
              budget: {
                id: expect.any(String),
                type: "usage",
                limit: 1000,
                used: 0,
                raw_limit: {
                  precision: 20,
                  value: "1000",
                },
                raw_used: {
                  precision: 20,
                  value: "0",
                },
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
              },
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
            }),
          ])
        )
      })

      it("should support search on campaigns", async () => {
        const response = await api.get(
          `/admin/campaigns?q=ign%202`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.campaigns).toEqual([
          expect.objectContaining({
            name: "campaign 2",
          }),
        ])
      })

      it("should get all campaigns and its count filtered", async () => {
        const response = await api.get(
          `/admin/campaigns?fields=name,created_at,budget.id`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(2)
        expect(response.data.campaigns).toEqual(
          expect.arrayContaining([
            {
              id: expect.any(String),
              name: "campaign 1",
              created_at: expect.any(String),
              budget: {
                id: expect.any(String),
              },
            },
            {
              id: expect.any(String),
              name: "campaign 2",
              created_at: expect.any(String),
              budget: {
                id: expect.any(String),
              },
            },
          ])
        )
      })
    })
  },
})
