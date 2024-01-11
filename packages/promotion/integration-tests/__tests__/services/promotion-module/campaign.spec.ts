import { IPromotionModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { initialize } from "../../../../src"
import { createCampaigns } from "../../../__fixtures__/campaigns"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("Promotion Module Service: Campaigns", () => {
  let service: IPromotionModuleService
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = MikroOrmWrapper.forkManager()

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

  describe("createCampaigns", () => {
    it("should throw an error when required params are not passed", async () => {
      const error = await service
        .createCampaigns([
          {
            name: "test",
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for Campaign.campaign_identifier is required, 'undefined' found"
      )
    })

    it("should create a basic campaign successfully", async () => {
      const startsAt = new Date("01/01/2024")
      const endsAt = new Date("01/01/2025")
      const [createdCampaign] = await service.createCampaigns([
        {
          name: "test",
          campaign_identifier: "test",
          starts_at: startsAt,
          ends_at: endsAt,
        },
      ])

      const campaign = await service.retrieveCampaign(createdCampaign.id)

      expect(campaign).toEqual(
        expect.objectContaining({
          name: "test",
          campaign_identifier: "test",
          starts_at: startsAt,
          ends_at: endsAt,
        })
      )
    })

    it("should create a campaign with campaign budget successfully", async () => {
      const startsAt = new Date("01/01/2024")
      const endsAt = new Date("01/01/2025")

      const [createdPromotion] = await service.createCampaigns([
        {
          name: "test",
          campaign_identifier: "test",
          starts_at: startsAt,
          ends_at: endsAt,
          campaign_budget: {
            limit: 1000,
            type: "usage",
            used: 10,
          },
        },
      ])

      const campaign = await service.retrieveCampaign(createdPromotion.id, {
        relations: ["campaign_budget"],
      })

      expect(campaign).toEqual(
        expect.objectContaining({
          name: "test",
          campaign_identifier: "test",
          starts_at: startsAt,
          ends_at: endsAt,
          campaign_budget: expect.objectContaining({
            limit: 1000,
            type: "usage",
            used: 10,
          }),
        })
      )
    })
  })

  describe("updateCampaigns", () => {
    it("should throw an error when required params are not passed", async () => {
      const error = await service
        .updateCampaigns([
          {
            name: "test",
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain('Campaign with id "" not found')
    })

    it("should update the attributes of a campaign successfully", async () => {
      await createCampaigns(repositoryManager)

      const [updatedCampaign] = await service.updateCampaigns([
        {
          id: "campaign-id-1",
          description: "test description 1",
          currency: "EUR",
          campaign_identifier: "new",
          starts_at: new Date("01/01/2024"),
          ends_at: new Date("01/01/2025"),
        },
      ])

      expect(updatedCampaign).toEqual(
        expect.objectContaining({
          description: "test description 1",
          currency: "EUR",
          campaign_identifier: "new",
          starts_at: new Date("01/01/2024"),
          ends_at: new Date("01/01/2025"),
        })
      )
    })

    it("should update the attributes of a campaign budget successfully", async () => {
      await createCampaigns(repositoryManager)

      const [updatedCampaign] = await service.updateCampaigns([
        {
          id: "campaign-id-1",
          campaign_budget: {
            limit: 100,
            used: 100,
          },
        },
      ])

      expect(updatedCampaign).toEqual(
        expect.objectContaining({
          campaign_budget: expect.objectContaining({
            limit: 100,
            used: 100,
          }),
        })
      )
    })
  })

  describe("retrieveCampaign", () => {
    beforeEach(async () => {
      await createCampaigns(repositoryManager)
    })

    const id = "campaign-id-1"

    it("should return campaign for the given id", async () => {
      const campaign = await service.retrieveCampaign(id)

      expect(campaign).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when campaign with id does not exist", async () => {
      let error

      try {
        await service.retrieveCampaign("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "Campaign with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.retrieveCampaign(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"campaignId" must be defined')
    })

    it("should return campaign based on config select param", async () => {
      const campaign = await service.retrieveCampaign(id, {
        select: ["id"],
      })

      const serialized = JSON.parse(JSON.stringify(campaign))

      expect(serialized).toEqual({
        id,
      })
    })
  })

  describe("deleteCampaigns", () => {
    beforeEach(async () => {
      await createCampaigns(repositoryManager)
    })

    const id = "campaign-id-1"

    it("should delete the campaigns given an id successfully", async () => {
      await service.deleteCampaigns([id])

      const campaigns = await service.list({
        id: [id],
      })

      expect(campaigns).toHaveLength(0)
    })
  })
})
