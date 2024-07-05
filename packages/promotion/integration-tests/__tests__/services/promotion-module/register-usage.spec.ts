import { Modules } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { createCampaigns } from "../../../__fixtures__/campaigns"

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
          const createdPromotion = await service.create({
            code: "TEST_PROMO_SPEND",
            type: "standard",
            campaign_id: "campaign-id-1",
          })

          await service.registerUsage([
            {
              action: "addShippingMethodAdjustment",
              shipping_method_id: "shipping_method_express",
              amount: 200,
              code: createdPromotion.code!,
            },
            {
              action: "addShippingMethodAdjustment",
              shipping_method_id: "shipping_method_standard",
              amount: 500,
              code: createdPromotion.code!,
            },
          ])

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
          const createdPromotion = await service.create({
            code: "TEST_PROMO_USAGE",
            type: "standard",
            campaign_id: "campaign-id-2",
          })

          await service.registerUsage([
            {
              action: "addShippingMethodAdjustment",
              shipping_method_id: "shipping_method_express",
              amount: 200,
              code: createdPromotion.code!,
            },
            {
              action: "addShippingMethodAdjustment",
              shipping_method_id: "shipping_method_standard",
              amount: 500,
              code: createdPromotion.code!,
            },
          ])

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
            .registerUsage([
              {
                action: "addShippingMethodAdjustment",
                shipping_method_id: "shipping_method_express",
                amount: 200,
                code: "DOESNOTEXIST",
              },
            ])
            .catch((e) => e)

          expect(response).toEqual(undefined)
        })

        it("should not register usage when limit is exceed for type usage", async () => {
          const createdPromotion = await service.create({
            code: "TEST_PROMO_USAGE",
            type: "standard",
            campaign_id: "campaign-id-2",
          })

          await service.updateCampaigns({
            id: "campaign-id-2",
            budget: { used: 1000, limit: 1000 },
          })

          await service.registerUsage([
            {
              action: "addShippingMethodAdjustment",
              shipping_method_id: "shipping_method_express",
              amount: 200,
              code: createdPromotion.code!,
            },
            {
              action: "addShippingMethodAdjustment",
              shipping_method_id: "shipping_method_standard",
              amount: 500,
              code: createdPromotion.code!,
            },
          ])

          const campaign = await service.retrieveCampaign("campaign-id-2", {
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

        it("should not register usage above limit when exceeded for type spend", async () => {
          const createdPromotion = await service.create({
            code: "TEST_PROMO_SPEND",
            type: "standard",
            campaign_id: "campaign-id-1",
          })

          await service.updateCampaigns({
            id: "campaign-id-1",
            budget: { used: 900, limit: 1000 },
          })

          await service.registerUsage([
            {
              action: "addShippingMethodAdjustment",
              shipping_method_id: "shipping_method_express",
              amount: 100,
              code: createdPromotion.code!,
            },
            {
              action: "addShippingMethodAdjustment",
              shipping_method_id: "shipping_method_standard",
              amount: 100,
              code: createdPromotion.code!,
            },
          ])

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
      })
    })
  },
})
