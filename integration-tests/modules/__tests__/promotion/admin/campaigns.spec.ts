import { IPromotionModuleService } from "@medusajs/types"
import {
  CampaignBudgetType,
  ModuleRegistrationName,
  PromotionType,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
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
    id: "campaign-id-1",
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
    id: "campaign-id-2",
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
    describe.only("Admin Campaigns API", () => {
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
            currency_code: "USD",
          },
          rules: [],
        }
      }

      describe("GET /admin/campaigns", () => {
        beforeEach(async () => {
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
                campaign_identifier: "test-1",
                starts_at: expect.any(String),
                ends_at: expect.any(String),
                budget: {
                  id: expect.any(String),
                  type: "spend",
                  currency_code: "USD",
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
                campaign_identifier: "test-2",
                starts_at: expect.any(String),
                ends_at: expect.any(String),
                budget: {
                  id: expect.any(String),
                  type: "usage",
                  limit: 1000,
                  used: 0,
                  currency_code: null,
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
          const createdCampaign = await promotionModuleService.createCampaigns(
            campaignData
          )

          const response = await api.get(
            `/admin/campaigns/${createdCampaign.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.campaign).toEqual({
            id: expect.any(String),
            name: "campaign 1",
            description: "test description",
            campaign_identifier: "test-1",
            starts_at: expect.any(String),
            ends_at: expect.any(String),
            budget: {
              id: expect.any(String),
              type: "spend",
              limit: 1000,
              currency_code: "USD",
              raw_limit: {
                precision: 20,
                value: "1000",
              },
              raw_used: {
                precision: 20,
                value: "0",
              },
              used: 0,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
            },
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          })
        })

        it("should get the requested campaign with filtered fields and relations", async () => {
          const createdCampaign = await promotionModuleService.createCampaigns(
            campaignData
          )

          const response = await api.get(
            `/admin/campaigns/${createdCampaign.id}?fields=name`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.campaign).toEqual({
            id: expect.any(String),
            name: "campaign 1",
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

        it("should create 3 campaigns in parallel and have the context passed as argument when calling createCampaigns with different transactionId", async () => {
          await api.post(
            `/admin/promotions`,
            { ...promotionData, code: "PARALLEL" },
            adminHeaders
          )

          const spyCreateCampaigns = jest.spyOn(
            promotionModuleService.constructor.prototype,
            "createCampaigns"
          )

          const a = async () => {
            return await api.post(
              `/admin/campaigns`,
              {
                name: "camp_1",
                campaign_identifier: "camp_1",
                starts_at: new Date("01/01/2024").toISOString(),
                ends_at: new Date("01/02/2024").toISOString(),
                budget: {
                  limit: 1000,
                  type: "usage",
                },
              },
              adminHeaders
            )
          }

          const b = async () => {
            return await api.post(
              `/admin/campaigns`,
              {
                name: "camp_2",
                campaign_identifier: "camp_2",
                starts_at: new Date("01/02/2024").toISOString(),
                ends_at: new Date("01/03/2029").toISOString(),
                budget: {
                  limit: 500,
                  type: "usage",
                },
              },
              adminHeaders
            )
          }

          const c = async () => {
            return await api.post(
              `/admin/campaigns`,
              {
                name: "camp_3",
                campaign_identifier: "camp_3",
                starts_at: new Date("01/03/2024").toISOString(),
                ends_at: new Date("01/04/2029").toISOString(),
                budget: {
                  limit: 250,
                  type: "usage",
                },
              },
              {
                headers: {
                  ...adminHeaders.headers,
                  "x-request-id": "my-custom-request-id",
                },
              }
            )
          }

          await Promise.all([a(), b(), c()])

          expect(spyCreateCampaigns).toHaveBeenCalledTimes(3)
          expect(spyCreateCampaigns.mock.calls[0][1].__type).toBe(
            "MedusaContext"
          )

          const distinctTransactionId = [
            ...new Set(
              spyCreateCampaigns.mock.calls.map((call) => call[1].transactionId)
            ),
          ]
          expect(distinctTransactionId).toHaveLength(3)

          const distinctRequestId = [
            ...new Set(
              spyCreateCampaigns.mock.calls.map((call) => call[1].requestId)
            ),
          ]

          expect(distinctRequestId).toHaveLength(3)
          expect(distinctRequestId).toContain("my-custom-request-id")
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
          const createdPromotion = (
            await api.post(`/admin/promotions`, promotionData, adminHeaders)
          ).data.promotion

          const createdCampaign = (
            await api.post(
              `/admin/campaigns`,
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
          ).data.campaign

          await promotionModuleService.addPromotionsToCampaign({
            id: createdCampaign.id,
            promotion_ids: [createdPromotion.id],
          })

          const response = await api.post(
            `/admin/campaigns/${createdCampaign.id}?fields=*promotions`,
            {
              name: "test-2",
              campaign_identifier: "test-2",
              budget: {
                limit: 2000,
              },
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
              }),
              promotions: [
                expect.objectContaining({
                  id: createdPromotion.id,
                }),
              ],
            })
          )
        })
      })

      describe("DELETE /admin/campaigns/:id", () => {
        it("should delete campaign successfully", async () => {
          const [createdCampaign] =
            await promotionModuleService.createCampaigns([
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
