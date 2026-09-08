import { IPromotionModuleService } from "@medusajs/framework/types"
import { CampaignBudgetType, Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner, SuiteOptions } from "@medusajs/test-utils"
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

        it("should not allow concurrent registrations to exceed a spend budget", async () => {
          const createdPromotion = await createDefaultPromotion(service, {})

          await service.updateCampaigns({
            id: "campaign-id-1",
            budget: { used: 900, limit: 1000 },
          })

          // Two concurrent +100 registrations: each sees used=900 and passes the
          // 1000 limit in isolation, but together they would spend 1100.
          const outcomes = await Promise.all([
            service
              .registerUsage(
                [{ amount: 100, code: createdPromotion.code! }],
                { customer_email: null, customer_id: null }
              )
              .then(() => "ok", () => "threw"),
            service
              .registerUsage(
                [{ amount: 100, code: createdPromotion.code! }],
                { customer_email: null, customer_id: null }
              )
              .then(() => "ok", () => "threw"),
          ])

          // Budget had room for a single +100; the other registration must be rejected.
          expect(outcomes.filter((o) => o === "threw")).toHaveLength(1)

          const campaign = await service.retrieveCampaign("campaign-id-1", {
            relations: ["budget"],
          })
          expect(campaign.budget!.used).toBeLessThanOrEqual(1000)
        })

        it("should not allow concurrent per-attribute registrations to exceed the limit", async () => {
          const [createdCampaign] = await service.createCampaigns([
            {
              name: "attr-concurrency",
              campaign_identifier: "attr-concurrency",
              budget: {
                type: CampaignBudgetType.USE_BY_ATTRIBUTE,
                attribute: "customer_id",
                limit: 2,
              },
            },
          ])

          const createdPromotion = await createDefaultPromotion(service, {
            campaign_id: createdCampaign.id,
          })

          // Prime the per-customer usage row (used=1) so the concurrent calls take
          // the UPDATE branch; the INSERT branch is already serialized by a unique
          // index on (attribute_value, budget_id).
          await service.registerUsage(
            [{ amount: 1, code: createdPromotion.code! }],
            { customer_id: "customer-id-1", customer_email: "c1@email.com" }
          )

          // Two concurrent uses for the same customer: each reads used=1 and passes
          // the limit of 2 in isolation, but together they would reach 3.
          const outcomes = await Promise.all([
            service
              .registerUsage(
                [{ amount: 1, code: createdPromotion.code! }],
                { customer_id: "customer-id-1", customer_email: "c1@email.com" }
              )
              .then(() => "ok", () => "threw"),
            service
              .registerUsage(
                [{ amount: 1, code: createdPromotion.code! }],
                { customer_id: "customer-id-1", customer_email: "c1@email.com" }
              )
              .then(() => "ok", () => "threw"),
          ])

          expect(outcomes.filter((o) => o === "threw")).toHaveLength(1)

          const campaign = await service.retrieveCampaign(createdCampaign.id, {
            relations: ["budget", "budget.usages"],
          })
          const usage = campaign.budget!.usages!.find(
            (u) => u.attribute_value === "customer-id-1"
          )
          expect(usage!.used).toBeLessThanOrEqual(2)
        })

        it("should not deadlock when concurrent registrations lock overlapping promotions in different orders", async () => {
          // Two promotions with a numeric usage limit (so both `promotion` rows
          // are locked) applied by two concurrent registrations in opposite
          // order. Locking the rows in a stable id order (orderBy("id")) is what
          // keeps this deadlock-free: without it each transaction could hold one
          // row and wait on the other. Limits are ample so neither guard rejects,
          // so the only way a call fails here is a deadlock.
          const promotionA = await createDefaultPromotion(service, {
            code: "PROMO_A",
            limit: 100,
            campaign_id: "campaign-id-1",
          })
          const promotionB = await createDefaultPromotion(service, {
            code: "PROMO_B",
            limit: 100,
            campaign_id: "campaign-id-1",
          })

          const outcomes = await Promise.all([
            service
              .registerUsage(
                [
                  { amount: 1, code: promotionA.code! },
                  { amount: 1, code: promotionB.code! },
                ],
                { customer_email: null, customer_id: null }
              )
              .then(() => "ok", (e) => e.message),
            service
              .registerUsage(
                [
                  { amount: 1, code: promotionB.code! },
                  { amount: 1, code: promotionA.code! },
                ],
                { customer_email: null, customer_id: null }
              )
              .then(() => "ok", (e) => e.message),
          ])

          expect(outcomes).toEqual(["ok", "ok"])
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
