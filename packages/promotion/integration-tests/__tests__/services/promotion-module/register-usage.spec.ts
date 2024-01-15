import { IPromotionModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { initialize } from "../../../../src"
import { createCampaigns } from "../../../__fixtures__/campaigns"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("Promotion Service: campaign usage", () => {
  let service: IPromotionModuleService
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = MikroOrmWrapper.forkManager()

    await createCampaigns(repositoryManager)

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PROMOTION_DB_SCHEMA,
      },
    })
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
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

    it("should throw an error when compute action with code does not exist", async () => {
      const error = await service
        .registerUsage([
          {
            action: "addShippingMethodAdjustment",
            shipping_method_id: "shipping_method_express",
            amount: 200,
            code: "DOESNOTEXIST",
          },
        ])
        .catch((e) => e)

      expect(error.message).toEqual(
        "Promotion with code DOESNOTEXIST not found"
      )
    })

    it("should throw error when exceeded limit for type usage", async () => {
      const createdPromotion = await service.create({
        code: "TEST_PROMO_USAGE",
        type: "standard",
        campaign_id: "campaign-id-2",
      })

      await service.updateCampaigns({
        id: "campaign-id-2",
        budget: { used: 1000, limit: 1000 },
      })

      const error = await service
        .registerUsage([
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
        .catch((e) => e)

      expect(error.message).toContain(
        "Promotion with code TEST_PROMO_USAGE exceeded its campaign budget"
      )
    })

    it("should sthrow error when exceeded limit for type spend", async () => {
      const createdPromotion = await service.create({
        code: "TEST_PROMO_SPEND",
        type: "standard",
        campaign_id: "campaign-id-1",
      })

      await service.updateCampaigns({
        id: "campaign-id-1",
        budget: { used: 900, limit: 1000 },
      })

      const error = await service
        .registerUsage([
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
        .catch((e) => e)

      expect(error.message).toContain(
        "Promotion with code TEST_PROMO_SPEND exceeded its campaign budget"
      )
    })
  })
})
