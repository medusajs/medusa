import { IPromotionModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
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

      describe("revertUsage", () => {
        it("should revert usage for type spend", async () => {
          const createdPromotion = await createDefaultPromotion(service, {})
          const createdPromotion2 = await createDefaultPromotion(service, {
            code: "PROMO_2",
            campaign_id: createdPromotion.campaign?.id,
          })
          const createdPromotion3 = await createDefaultPromotion(service, {
            code: "PROMO_3",
            campaign_id: createdPromotion.campaign?.id,
          })

          await service.registerUsage([
            { amount: 200, code: createdPromotion.code! },
            { amount: 100, code: createdPromotion.code! },
          ])

          await service.registerUsage([
            { amount: 100, code: createdPromotion2.code! },
            { amount: 200, code: createdPromotion2.code! },
          ])

          await service.registerUsage([
            { amount: 50, code: createdPromotion3.code! },
            { amount: 250, code: createdPromotion3.code! },
          ])

          await service.revertUsage([
            { amount: 200, code: createdPromotion.code! },
            { amount: 100, code: createdPromotion.code! },
          ])

          await service.revertUsage([
            { amount: 50, code: createdPromotion3.code! },
            { amount: 250, code: createdPromotion3.code! },
          ])

          const campaign = await service.retrieveCampaign(
            createdPromotion.campaign?.id!,
            { relations: ["budget"] }
          )

          expect(campaign.budget).toEqual(
            expect.objectContaining({
              type: "spend",
              limit: 1000,
              used: 300,
            })
          )
        })

        it("should revert usage for type usage", async () => {
          const campaignId = "campaign-id-2"
          const createdPromotion = await createDefaultPromotion(service, {
            code: "PROMO_1",
            campaign_id: campaignId,
          })
          const createdPromotion2 = await createDefaultPromotion(service, {
            code: "PROMO_2",
            campaign_id: campaignId,
          })
          const createdPromotion3 = await createDefaultPromotion(service, {
            code: "PROMO_3",
            campaign_id: campaignId,
          })

          await service.registerUsage([
            { amount: 200, code: createdPromotion.code! },
            { amount: 500, code: createdPromotion.code! },
          ])

          await service.registerUsage([
            { amount: 200, code: createdPromotion2.code! },
            { amount: 500, code: createdPromotion3.code! },
          ])

          await service.revertUsage([
            { amount: 200, code: createdPromotion.code! },
            { amount: 500, code: createdPromotion.code! },
          ])

          await service.revertUsage([
            { amount: 200, code: createdPromotion2.code! },
            { amount: 500, code: createdPromotion3.code! },
          ])

          const campaign = await service.retrieveCampaign(campaignId, {
            relations: ["budget"],
          })

          expect(campaign.budget).toEqual(
            expect.objectContaining({
              type: "usage",
              limit: 1000,
              used: 0,
            })
          )
        })

        it("should not throw an error when compute action with code does not exist", async () => {
          const response = await service
            .revertUsage([{ amount: 200, code: "DOESNOTEXIST" }])
            .catch((e) => e)

          expect(response).toEqual(undefined)
        })

        it("should not let a concurrent registerUsage's increment be lost by a concurrent revertUsage", async () => {
          const createdPromotion = await createDefaultPromotion(service, {})

          // Pad registerUsage's transaction with a bunch of other promotions on
          // the same campaign, so it holds its row locks (including the target
          // promotion's) for measurably longer - widening the window for a
          // concurrent revertUsage's read+write to land badly if it isn't
          // properly serialized against registerUsage.
          const padding = await Promise.all(
            Array.from({ length: 15 }, (_, i) =>
              createDefaultPromotion(service, {
                code: `PADDING_${i}`,
                campaign_id: createdPromotion.campaign?.id,
              })
            )
          )

          // Baseline: 900 already spent against the 1000 limit.
          await service.registerUsage(
            [{ amount: 900, code: createdPromotion.code! }],
            { customer_email: null, customer_id: null }
          )

          // Concurrently: revert the 900 (as a workflow compensation would,
          // e.g. after a later checkout step fails), while a second, unrelated
          // checkout registers +100 (bundled with the padding promotions, to
          // slow its transaction down). Regardless of interleaving, the
          // mathematically correct result is 900 - 900 + 100 = 100, and the
          // +100 must be allowed (900 + 100 <= 1000). Giving registerUsage a
          // head start puts it past lock-acquisition (and into the slower
          // padded refresh/compute phase, still holding the row locks) by the
          // time revertUsage's read+write fires.
          const registerPromise = service
            .registerUsage(
              [
                { amount: 100, code: createdPromotion.code! },
                ...padding.map((p) => ({ amount: 0, code: p.code! })),
              ],
              { customer_email: null, customer_id: null }
            )
            .then(
              () => "ok",
              (e) => e.message
            )

          await new Promise((resolve) => setTimeout(resolve, 30))

          const revertPromise = service
            .revertUsage([{ amount: 900, code: createdPromotion.code! }], {
              customer_email: null,
              customer_id: null,
            })
            .then(
              () => "ok",
              (e) => e.message
            )

          const outcomes = await Promise.all([revertPromise, registerPromise])

          expect(outcomes).toEqual(["ok", "ok"])

          const campaign = await service.retrieveCampaign(
            createdPromotion.campaign?.id!,
            { relations: ["budget"] }
          )

          expect(campaign.budget!.used).toEqual(100)
        })
      })
    })
  },
})
