import { CampaignBudgetType, PromotionType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

export const campaignData = {
  name: "campaign 1",
  description: "test description",
  campaign_identifier: "test-1",
  starts_at: new Date("01/01/2023").toISOString(),
  ends_at: new Date("01/01/2024").toISOString(),
  budget: {
    type: CampaignBudgetType.SPEND,
    limit: 1000,
    currency_code: "USD",
  },
}

export const campaignsData = [
  {
    name: "campaign 1",
    description: "test description",
    campaign_identifier: "test-1",
    starts_at: new Date("01/01/2023"),
    ends_at: new Date("01/01/2024"),
    budget: {
      type: CampaignBudgetType.SPEND,
      limit: 1000,
      currency_code: "USD",
    },
  },
  {
    name: "campaign 2",
    description: "test description",
    campaign_identifier: "test-2",
    starts_at: new Date("01/01/2023"),
    ends_at: new Date("01/01/2024"),
    budget: {
      type: CampaignBudgetType.USAGE,
      limit: 1000,
    },
  },
]

const promotionData = {
  code: "TEST",
  type: PromotionType.STANDARD,
  is_automatic: true,
  application_method: {
    target_type: "items",
    type: "fixed",
    allocation: "each",
    currency_code: "USD",
    value: 100,
    max_quantity: 100,
    target_rules: [
      {
        attribute: "test.test",
        operator: "eq",
        values: ["test1", "test2"],
      },
    ],
  },
  rules: [
    {
      attribute: "test.test",
      operator: "eq",
      values: ["test1", "test2"],
    },
  ],
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
      let campaign1
      let campaign2
      let promotion

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        campaign1 = (
          await api.post(`/admin/campaigns`, campaignsData[0], adminHeaders)
        ).data.campaign
        campaign2 = (
          await api.post(`/admin/campaigns`, campaignsData[1], adminHeaders)
        ).data.campaign
        promotion = (
          await api.post(`/admin/promotions`, promotionData, adminHeaders)
        ).data.promotion
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
            currency_code: "USD",
          },
          rules: [],
        }
      }

      describe("GET /admin/campaigns", () => {
        it("should get all campaigns and its count", async () => {
          const response = await api.get(`/admin/campaigns`, adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(response.data.campaigns).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: campaign1.id,
              }),
              expect.objectContaining({
                id: campaign2.id,
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

      describe("GET /admin/campaigns/:id", () => {
        it("should throw an error if id does not exist", async () => {
          const { response } = await api
            .get(`/admin/campaigns/does-not-exist`, adminHeaders)
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data.message).toEqual(
            "Campaign with id: does-not-exist was not found"
          )
        })

        it("should get the requested campaign", async () => {
          const response = await api.get(
            `/admin/campaigns/${campaign1.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.campaign).toEqual(
            expect.objectContaining({
              id: campaign1.id,
            })
          )
        })

        it("should get the requested campaign with filtered fields and relations", async () => {
          const response = await api.get(
            `/admin/campaigns/${campaign1.id}?fields=name`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.campaign).toEqual({
            id: campaign1.id,
            name: campaign1.name,
          })
        })
      })

      describe("POST /admin/campaigns", () => {
        it("should throw an error if required params are not passed", async () => {
          const { response } = await api
            .post(`/admin/campaigns`, {}, adminHeaders)
            .catch((e) => e)

          expect(response.status).toEqual(400)
          // expect(response.data.message).toEqual(
          //   "name must be a string, name should not be empty"
          // )
        })

        it("should create a campaign successfully", async () => {
          const response = await api.post(
            `/admin/campaigns?fields=*promotions`,
            {
              name: "test",
              campaign_identifier: "test",
              starts_at: new Date("01/01/2024").toISOString(),
              ends_at: new Date("01/01/2029").toISOString(),
              budget: {
                limit: 1000,
                type: "usage",
              },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.campaign).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "test",
              campaign_identifier: "test",
              starts_at: expect.any(String),
              ends_at: expect.any(String),
              budget: expect.objectContaining({
                limit: 1000,
                type: "usage",
              }),
            })
          )
        })
      })

      describe("POST /admin/campaigns/:id", () => {
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
          await api.post(
            `admin/campaigns/${campaign1.id}/promotions`,
            { add: [promotion.id] },
            adminHeaders
          )

          const response = await api.post(
            `/admin/campaigns/${campaign1.id}?fields=*promotions`,
            {
              name: "test-update",
              campaign_identifier: "test-update",
              budget: {
                limit: 2000,
              },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.campaign).toEqual(
            expect.objectContaining({
              id: campaign1.id,
              name: "test-update",
              campaign_identifier: "test-update",
              budget: expect.objectContaining({
                limit: 2000,
                type: "spend",
              }),
              promotions: [
                expect.objectContaining({
                  id: promotion.id,
                }),
              ],
            })
          )
        })
      })

      describe("DELETE /admin/campaigns/:id", () => {
        it("should delete campaign successfully", async () => {
          const deleteRes = await api.delete(
            `/admin/campaigns/${campaign1.id}`,
            adminHeaders
          )

          expect(deleteRes.status).toEqual(200)

          const { response } = await api
            .post(`/admin/campaigns/${campaign1.id}`, {}, adminHeaders)
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data.message).toEqual(
            `Campaign with id "${campaign1.id}" not found`
          )
        })
      })

      describe("POST /admin/campaigns/:id/promotions", () => {
        it("should add or remove promotions from campaign", async () => {
          const promotion1 = (
            await api.post(
              `/admin/promotions`,
              generatePromotionData(),
              adminHeaders
            )
          ).data.promotion

          let response = await api.post(
            `/admin/campaigns/${campaign1.id}/promotions`,
            { add: [promotion1.id, promotion.id] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.campaign).toEqual(
            expect.objectContaining({
              id: expect.any(String),
            })
          )

          response = await api.get(
            `/admin/promotions?campaign_id=${campaign1.id}`,
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
                id: promotion.id,
              }),
            ])
          )

          await api.post(
            `/admin/campaigns/${campaign1.id}/promotions`,
            { remove: [promotion1.id] },
            adminHeaders
          )

          response = await api.get(
            `/admin/promotions?campaign_id=${campaign1.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotions).toHaveLength(1)
          expect(response.data.promotions).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: promotion.id,
              }),
            ])
          )
        })
      })
    })
  },
})
