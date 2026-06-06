import { IPromotionModuleService } from "@zjedene-medusa/framework/types"
import { CampaignBudgetType, Modules } from "@zjedene-medusa/framework/utils"
import { moduleIntegrationTestRunner, SuiteOptions } from "@zjedene-medusa/test-utils"
import { createCampaigns } from "../../../__fixtures__/campaigns"
import { createDefaultPromotion } from "../../../__fixtures__/promotion"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.PROMOTION,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IPromotionModuleService>) => {
    describe("Promotion Service: campaign usage", () => {
      beforeEach(async () => {
        await createCampaigns(MikroOrmWrapper.forkManager())
      })

      describe("registerUsage", () => {
        it("should register usage for type spend", async () => {
          const createdPromotion = await createDefaultPromotion(service, {})

          await service.registerUsage(
            [
              {
                amount: 200,
                code: createdPromotion.code!,
              },
              {
                amount: 500,
                code: createdPromotion.code!,
              },
            ],
            { customer_email: null, customer_id: null }
          )

          const campaign = await service.retrieveCampaign("campaign-id-1", {
            relations: ["budget"],
          })

          expect(campaign.budget).toEqual(
            expect.objectContaining({
              type: "spend",
              limit: 1000,
              used: 700,
            })
          )
        })

        it("should register usage for type usage", async () => {
          const createdPromotion = await createDefaultPromotion(service, {
            campaign_id: "campaign-id-2",
          })

          await service.registerUsage(
            [
              {
                amount: 200,
                code: createdPromotion.code!,
              },
              {
                amount: 500,
                code: createdPromotion.code!,
              },
            ],
            { customer_email: null, customer_id: null }
          )

          const campaign = await service.retrieveCampaign("campaign-id-2", {
            relations: ["budget"],
          })

          expect(campaign.budget).toEqual(
            expect.objectContaining({
              type: "usage",
              limit: 1000,
              used: 1,
            })
          )
        })

        it("should not throw an error when compute action with code does not exist", async () => {
          const response = await service
            .registerUsage(
              [
                {
                  amount: 200,
                  code: "DOESNOTEXIST",
                },
              ],
              { customer_email: null, customer_id: null }
            )
            .catch((e) => e)

          expect(response).toEqual(undefined)
        })

        it("should throw if limit is exceeded for type usage", async () => {
          const createdPromotion = await createDefaultPromotion(service, {
            campaign_id: "campaign-id-2",
          })

          await service.updateCampaigns({
            id: "campaign-id-2",
            budget: { used: 1000, limit: 1000 },
          })

          const error = await service
            .registerUsage(
              [
                {
                  amount: 200,
                  code: createdPromotion.code!,
                },
                {
                  amount: 500,
                  code: createdPromotion.code!,
                },
              ],
              { customer_email: null, customer_id: null }
            )
            .catch((e) => e)

          expect(error).toEqual(
            expect.objectContaining({
              type: "not_allowed",
              message: "Promotion usage exceeds the budget limit.",
            })
          )

          const [campaign] = await service.listCampaigns(
            {
              id: ["campaign-id-2"],
            },
            {
              relations: ["budget"],
            }
          )

          expect(campaign).toEqual(
            expect.objectContaining({
              budget: expect.objectContaining({
                limit: 1000,
                used: 1000,
              }),
            })
          )
        })

        it("should throw if limit is exceeded for type spend", async () => {
          const createdPromotion = await createDefaultPromotion(service, {})

          await service.updateCampaigns({
            id: "campaign-id-1",
            budget: { used: 900, limit: 1000 },
          })

          const error = await service
            .registerUsage(
              [
                {
                  amount: 50,
                  code: createdPromotion.code!,
                },
                {
                  amount: 100,
                  code: createdPromotion.code!,
                },
              ],
              { customer_email: null, customer_id: null }
            )
            .catch((e) => e)

          expect(error).toEqual(
            expect.objectContaining({
              type: "not_allowed",
              message: "Promotion usage exceeds the budget limit.",
            })
          )

          const campaign = await service.retrieveCampaign("campaign-id-1", {
            relations: ["budget"],
          })

          expect(campaign).toEqual(
            expect.objectContaining({
              budget: expect.objectContaining({
                used: 900,
                limit: 1000,
              }),
            })
          )
        })

        it("should throw if limit is exceeded for type spend (one amount exceeds the limit)", async () => {
          const createdPromotion = await createDefaultPromotion(service, {})

          await service.updateCampaigns({
            id: "campaign-id-1",
            budget: { used: 900, limit: 1000 },
          })

          const error = await service
            .registerUsage(
              [
                {
                  amount: 75,
                  code: createdPromotion.code!,
                },
                {
                  amount: 75,
                  code: createdPromotion.code!,
                },
              ],
              { customer_email: null, customer_id: null }
            )
            .catch((e) => e)

          expect(error).toEqual(
            expect.objectContaining({
              type: "not_allowed",
              message: "Promotion usage exceeds the budget limit.",
            })
          )

          const [campaign] = await service.listCampaigns(
            {
              id: ["campaign-id-1"],
            },
            {
              relations: ["budget"],
            }
          )

          expect(campaign).toEqual(
            expect.objectContaining({
              budget: expect.objectContaining({
                limit: 1000,
                used: 900,
              }),
            })
          )
        })

        it("should not throw if the spent amount exactly matches the limit", async () => {
          const createdPromotion = await createDefaultPromotion(service, {})

          await service.updateCampaigns({
            id: "campaign-id-1",
            budget: { used: 900, limit: 1000 },
          })

          await service.registerUsage(
            [
              {
                amount: 50,
                code: createdPromotion.code!,
              },
              {
                amount: 50,
                code: createdPromotion.code!,
              },
            ],
            { customer_email: null, customer_id: null }
          )

          const campaign = await service.retrieveCampaign("campaign-id-1", {
            relations: ["budget"],
          })

          expect(campaign).toEqual(
            expect.objectContaining({
              budget: expect.objectContaining({
                limit: 1000,
                used: 1000,
              }),
            })
          )
        })

        it("should requister usage for attribute budget successfully and revert it successfully", async () => {
          const [createdCampaign] = await service.createCampaigns([
            {
              name: "test",
              campaign_identifier: "test",
              budget: {
                type: CampaignBudgetType.USE_BY_ATTRIBUTE,
                attribute: "customer_id",
                limit: 5,
              },
            },
          ])

          const createdPromotion = await createDefaultPromotion(service, {
            campaign_id: createdCampaign.id,
          })

          await service.registerUsage(
            [{ amount: 1, code: createdPromotion.code! }],
            {
              customer_id: "customer-id-1",
              customer_email: "customer1@email.com",
            }
          )

          await service.registerUsage(
            [{ amount: 1, code: createdPromotion.code! }],
            {
              customer_id: "customer-id-2",
              customer_email: "customer2@email.com",
            }
          )

          await service.registerUsage(
            [{ amount: 1, code: createdPromotion.code! }],
            {
              customer_id: "customer-id-1",
              customer_email: "customer1@email.com",
            }
          )

          let campaign = await service.retrieveCampaign(createdCampaign.id, {
            relations: ["budget", "budget.usages"],
          })

          expect(campaign).toEqual(
            expect.objectContaining({
              budget: expect.objectContaining({
                used: 3, // used 3 times overall
                usages: expect.arrayContaining([
                  expect.objectContaining({
                    attribute_value: "customer-id-1",
                    used: 2,
                  }),
                  expect.objectContaining({
                    attribute_value: "customer-id-2",
                    used: 1,
                  }),
                ]),
              }),
            })
          )

          await service.revertUsage(
            [{ amount: 1, code: createdPromotion.code! }],
            {
              customer_id: "customer-id-1",
              customer_email: "customer1@email.com",
            }
          )

          campaign = await service.retrieveCampaign(createdCampaign.id, {
            relations: ["budget", "budget.usages"],
          })

          expect(campaign).toEqual(
            expect.objectContaining({
              budget: expect.objectContaining({
                used: 2,
                usages: expect.arrayContaining([
                  expect.objectContaining({
                    attribute_value: "customer-id-1",
                    used: 1,
                  }),
                  expect.objectContaining({
                    attribute_value: "customer-id-2",
                    used: 1,
                  }),
                ]),
              }),
            })
          )

          await service.revertUsage(
            [{ amount: 1, code: createdPromotion.code! }],
            {
              customer_id: "customer-id-2",
              customer_email: "customer2@email.com",
            }
          )

          campaign = await service.retrieveCampaign(createdCampaign.id, {
            relations: ["budget", "budget.usages"],
          })

          expect(campaign.budget!.usages!).toHaveLength(1)

          expect(campaign).toEqual(
            expect.objectContaining({
              budget: expect.objectContaining({
                used: 1,
                usages: expect.arrayContaining([
                  expect.objectContaining({
                    attribute_value: "customer-id-1",
                    used: 1,
                  }),
                ]),
              }),
            })
          )
        })
      })
    })
  },
})
