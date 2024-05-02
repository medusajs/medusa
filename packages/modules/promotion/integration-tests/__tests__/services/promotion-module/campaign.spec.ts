import { Modules } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { createCampaigns } from "../../../__fixtures__/campaigns"
import { createPromotions } from "../../../__fixtures__/promotion"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.PROMOTION,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IPromotionModuleService>) => {
    describe("Promotion Module Service: Campaigns", () => {
      describe("listAndCountCampaigns", () => {
        beforeEach(async () => {
          await createCampaigns(MikroOrmWrapper.forkManager())
        })

        it("should return all campaigns and its count", async () => {
          const [campaigns, count] = await service.listAndCountCampaigns()

          expect(count).toEqual(2)
          expect(campaigns).toEqual([
            {
              id: "campaign-id-1",
              name: "campaign 1",
              description: "test description",
              currency: "USD",
              campaign_identifier: "test-1",
              starts_at: expect.any(Date),
              ends_at: expect.any(Date),
              budget: expect.any(Object),
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
              deleted_at: null,
            },
            {
              id: "campaign-id-2",
              name: "campaign 1",
              description: "test description",
              currency: "USD",
              campaign_identifier: "test-2",
              starts_at: expect.any(Date),
              ends_at: expect.any(Date),
              budget: expect.any(Object),
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
              deleted_at: null,
            },
          ])
        })

        it("should return all campaigns based on config select and relations param", async () => {
          const [campaigns, count] = await service.listAndCountCampaigns(
            {
              id: ["campaign-id-1"],
            },
            {
              relations: ["budget"],
              select: ["name", "budget.limit"],
            }
          )

          expect(count).toEqual(1)
          expect(campaigns).toEqual([
            {
              id: "campaign-id-1",
              name: "campaign 1",
              budget: expect.objectContaining({
                id: expect.any(String),
                limit: 1000,
              }),
            },
          ])
        })
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
              budget: {
                limit: 1000,
                type: "usage",
                used: 10,
              },
            },
          ])

          const campaign = await service.retrieveCampaign(createdPromotion.id, {
            relations: ["budget"],
          })

          expect(campaign).toEqual(
            expect.objectContaining({
              name: "test",
              campaign_identifier: "test",
              starts_at: startsAt,
              ends_at: endsAt,
              budget: expect.objectContaining({
                limit: 1000,
                type: "usage",
                used: 10,
              }),
            })
          )
        })

        it("should create a basic campaign with promotions successfully", async () => {
          await createPromotions(MikroOrmWrapper.forkManager())

          const startsAt = new Date("01/01/2024")
          const endsAt = new Date("01/01/2025")
          const [createdCampaign] = await service.createCampaigns([
            {
              name: "test",
              campaign_identifier: "test",
              starts_at: startsAt,
              ends_at: endsAt,
              promotions: [{ id: "promotion-id-1" }, { id: "promotion-id-2" }],
            },
          ])

          const campaign = await service.retrieveCampaign(createdCampaign.id, {
            relations: ["promotions"],
          })

          expect(campaign).toEqual(
            expect.objectContaining({
              name: "test",
              campaign_identifier: "test",
              starts_at: startsAt,
              ends_at: endsAt,
              promotions: [
                expect.objectContaining({
                  id: "promotion-id-1",
                }),
                expect.objectContaining({
                  id: "promotion-id-2",
                }),
              ],
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
          await createCampaigns(MikroOrmWrapper.forkManager())

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
          await createCampaigns(MikroOrmWrapper.forkManager())

          const [updatedCampaign] = await service.updateCampaigns([
            {
              id: "campaign-id-1",
              budget: {
                limit: 100,
                used: 100,
              },
            },
          ])

          expect(updatedCampaign).toEqual(
            expect.objectContaining({
              budget: expect.objectContaining({
                limit: 100,
                used: 100,
              }),
            })
          )
        })

        it("should update promotions of a campaign successfully", async () => {
          await createCampaigns(MikroOrmWrapper.forkManager())
          await createPromotions(MikroOrmWrapper.forkManager())

          const [updatedCampaign] = await service.updateCampaigns([
            {
              id: "campaign-id-1",
              description: "test description 1",
              currency: "EUR",
              campaign_identifier: "new",
              starts_at: new Date("01/01/2024"),
              ends_at: new Date("01/01/2025"),
              promotions: [{ id: "promotion-id-1" }, { id: "promotion-id-2" }],
            },
          ])

          expect(updatedCampaign).toEqual(
            expect.objectContaining({
              description: "test description 1",
              currency: "EUR",
              campaign_identifier: "new",
              starts_at: new Date("01/01/2024"),
              ends_at: new Date("01/01/2025"),
              promotions: [
                expect.objectContaining({
                  id: "promotion-id-1",
                }),
                expect.objectContaining({
                  id: "promotion-id-2",
                }),
              ],
            })
          )
        })

        it("should remove promotions of the campaign successfully", async () => {
          await createCampaigns(MikroOrmWrapper.forkManager())
          await createPromotions(MikroOrmWrapper.forkManager())

          await service.updateCampaigns({
            id: "campaign-id-1",
            promotions: [{ id: "promotion-id-1" }, { id: "promotion-id-2" }],
          })

          const updatedCampaign = await service.updateCampaigns({
            id: "campaign-id-1",
            promotions: [{ id: "promotion-id-1" }],
          })

          expect(updatedCampaign).toEqual(
            expect.objectContaining({
              promotions: [
                expect.objectContaining({
                  id: "promotion-id-1",
                }),
              ],
            })
          )
        })
      })

      describe("retrieveCampaign", () => {
        beforeEach(async () => {
          await createCampaigns(MikroOrmWrapper.forkManager())
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

          expect(error.message).toEqual("campaign - id must be defined")
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
        it("should delete the campaigns given an id successfully", async () => {
          const [createdCampaign] = await service.createCampaigns([
            {
              name: "test",
              campaign_identifier: "test",
              starts_at: new Date("01/01/2024"),
              ends_at: new Date("01/01/2025"),
            },
          ])

          await service.deleteCampaigns([createdCampaign.id])

          const campaigns = await service.listCampaigns(
            {
              id: [createdCampaign.id],
            },
            { withDeleted: true }
          )

          expect(campaigns).toHaveLength(0)
        })
      })

      describe("softDeleteCampaigns", () => {
        it("should soft delete the campaigns given an id successfully", async () => {
          const [createdCampaign] = await service.createCampaigns([
            {
              name: "test",
              campaign_identifier: "test",
              starts_at: new Date("01/01/2024"),
              ends_at: new Date("01/01/2025"),
            },
          ])

          await service.softDeleteCampaigns([createdCampaign.id])

          const campaigns = await service.listCampaigns({
            id: [createdCampaign.id],
          })

          expect(campaigns).toHaveLength(0)
        })
      })

      describe("restoreCampaigns", () => {
        it("should restore the campaigns given an id successfully", async () => {
          const [createdCampaign] = await service.createCampaigns([
            {
              name: "test",
              campaign_identifier: "test",
              starts_at: new Date("01/01/2024"),
              ends_at: new Date("01/01/2025"),
            },
          ])

          await service.softDeleteCampaigns([createdCampaign.id])

          let campaigns = await service.listCampaigns({
            id: [createdCampaign.id],
          })

          expect(campaigns).toHaveLength(0)
          await service.restoreCampaigns([createdCampaign.id])

          campaigns = await service.listCampaigns({ id: [createdCampaign.id] })
          expect(campaigns).toHaveLength(1)
        })
      })
    })
  },
})
