import { IPromotionModuleService } from "@medusajs/types"
import {
  ApplicationMethodType,
  CampaignBudgetType,
  PromotionType,
} from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { initialize } from "../../../../src"
import { createCampaigns } from "../../../__fixtures__/campaigns"
import { createPromotions } from "../../../__fixtures__/promotion"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("Promotion Service", () => {
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

  describe("create", () => {
    it("should throw an error when required params are not passed", async () => {
      const error = await service
        .create([
          {
            type: PromotionType.STANDARD,
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for Promotion.code is required, 'undefined' found"
      )
    })

    it("should create a basic promotion successfully", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "PROMOTION_TEST",
          type: PromotionType.STANDARD,
        },
      ])

      const [promotion] = await service.list({
        id: [createdPromotion.id],
      })

      expect(promotion).toEqual(
        expect.objectContaining({
          code: "PROMOTION_TEST",
          is_automatic: false,
          type: "standard",
        })
      )
    })

    it("should create a promotion with order application method successfully", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "PROMOTION_TEST",
          type: PromotionType.STANDARD,
          application_method: {
            type: "fixed",
            target_type: "order",
            value: "100",
          },
        },
      ])

      const [promotion] = await service.list(
        {
          id: [createdPromotion.id],
        },
        {
          relations: ["application_method"],
        }
      )

      expect(promotion).toEqual(
        expect.objectContaining({
          code: "PROMOTION_TEST",
          is_automatic: false,
          type: "standard",
          application_method: expect.objectContaining({
            type: "fixed",
            target_type: "order",
            value: 100,
          }),
        })
      )
    })

    it("should throw an error when both campaign and campaign_id are provided", async () => {
      const startsAt = new Date("01/01/2023")
      const endsAt = new Date("01/01/2023")

      const error = await service
        .create({
          code: "PROMOTION_TEST",
          type: PromotionType.STANDARD,
          campaign_id: "campaign-id-1",
          campaign: {
            name: "test",
            campaign_identifier: "test-promotion-test",
            starts_at: startsAt,
            ends_at: endsAt,
            budget: {
              type: CampaignBudgetType.SPEND,
              used: 100,
              limit: 100,
            },
          },
        })
        .catch((e) => e)

      expect(error.message).toContain(
        "Provide either the 'campaign' or 'campaign_id' parameter; both cannot be used simultaneously."
      )
    })

    it("should create a basic promotion with campaign successfully", async () => {
      const startsAt = new Date("01/01/2023")
      const endsAt = new Date("01/01/2023")

      await createCampaigns(repositoryManager)

      const createdPromotion = await service.create({
        code: "PROMOTION_TEST",
        type: PromotionType.STANDARD,
        campaign: {
          name: "test",
          campaign_identifier: "test-promotion-test",
          starts_at: startsAt,
          ends_at: endsAt,
          budget: {
            type: CampaignBudgetType.SPEND,
            used: 100,
            limit: 100,
          },
        },
      })

      const [promotion] = await service.list(
        { id: [createdPromotion.id] },
        { relations: ["campaign.budget"] }
      )

      expect(promotion).toEqual(
        expect.objectContaining({
          code: "PROMOTION_TEST",
          is_automatic: false,
          type: "standard",
          campaign: expect.objectContaining({
            name: "test",
            campaign_identifier: "test-promotion-test",
            starts_at: startsAt,
            ends_at: endsAt,
            budget: expect.objectContaining({
              type: CampaignBudgetType.SPEND,
              used: 100,
              limit: 100,
            }),
          }),
        })
      )
    })

    it("should create a basic promotion with an existing campaign successfully", async () => {
      await createCampaigns(repositoryManager)

      const createdPromotion = await service.create({
        code: "PROMOTION_TEST",
        type: PromotionType.STANDARD,
        campaign_id: "campaign-id-1",
      })

      const [promotion] = await service.list(
        { id: [createdPromotion.id] },
        { relations: ["campaign.budget"] }
      )

      expect(promotion).toEqual(
        expect.objectContaining({
          code: "PROMOTION_TEST",
          is_automatic: false,
          type: "standard",
          campaign: expect.objectContaining({
            id: "campaign-id-1",
            budget: expect.objectContaining({
              type: CampaignBudgetType.SPEND,
              limit: 1000,
              used: 0,
            }),
          }),
        })
      )
    })

    it("should throw error when creating an item application method without allocation", async () => {
      const error = await service
        .create([
          {
            code: "PROMOTION_TEST",
            type: PromotionType.STANDARD,
            application_method: {
              type: "fixed",
              target_type: "items",
              value: "100",
            },
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "application_method.allocation should be either 'across OR each' when application_method.target_type is either 'shipping_methods OR items'"
      )
    })

    it("should throw error when creating an item application, each allocation, without max quanity", async () => {
      const error = await service
        .create([
          {
            code: "PROMOTION_TEST",
            type: PromotionType.STANDARD,
            application_method: {
              type: "fixed",
              allocation: "each",
              target_type: "shipping_methods",
              value: "100",
            },
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "application_method.max_quantity is required when application_method.allocation is 'each'"
      )
    })

    it("should throw error when creating an order application method with rules", async () => {
      const error = await service
        .create([
          {
            code: "PROMOTION_TEST",
            type: PromotionType.STANDARD,
            application_method: {
              type: "fixed",
              target_type: "order",
              value: "100",
              target_rules: [
                {
                  attribute: "product_id",
                  operator: "eq",
                  values: ["prod_tshirt"],
                },
              ],
            },
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Target rules for application method with target type (order) is not allowed"
      )
    })

    it("should create a promotion with rules successfully", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "PROMOTION_TEST",
          type: PromotionType.STANDARD,
          rules: [
            {
              attribute: "customer_group_id",
              operator: "in",
              values: ["VIP", "top100"],
            },
          ],
        },
      ])

      const [promotion] = await service.list(
        {
          id: [createdPromotion.id],
        },
        {
          relations: ["rules", "rules.values"],
        }
      )

      expect(promotion).toEqual(
        expect.objectContaining({
          code: "PROMOTION_TEST",
          is_automatic: false,
          type: "standard",
          rules: [
            expect.objectContaining({
              attribute: "customer_group_id",
              operator: "in",
              values: expect.arrayContaining([
                expect.objectContaining({
                  value: "VIP",
                }),
                expect.objectContaining({
                  value: "top100",
                }),
              ]),
            }),
          ],
        })
      )
    })

    it("should create a promotion with rules with single value successfully", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "PROMOTION_TEST",
          type: PromotionType.STANDARD,
          rules: [
            {
              attribute: "customer_group_id",
              operator: "eq",
              values: "VIP",
            },
          ],
        },
      ])

      const [promotion] = await service.list(
        {
          id: [createdPromotion.id],
        },
        {
          relations: ["rules", "rules.values"],
        }
      )

      expect(promotion).toEqual(
        expect.objectContaining({
          code: "PROMOTION_TEST",
          is_automatic: false,
          type: "standard",
          rules: [
            expect.objectContaining({
              attribute: "customer_group_id",
              operator: "eq",
              values: expect.arrayContaining([
                expect.objectContaining({
                  value: "VIP",
                }),
              ]),
            }),
          ],
        })
      )
    })

    it("should throw an error when rule attribute is invalid", async () => {
      const error = await service
        .create([
          {
            code: "PROMOTION_TEST",
            type: PromotionType.STANDARD,
            rules: [
              {
                attribute: "",
                operator: "eq",
                values: "VIP",
              } as any,
            ],
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain("rules[].attribute is a required field")
    })

    it("should throw an error when rule operator is invalid", async () => {
      let error = await service
        .create([
          {
            code: "PROMOTION_TEST",
            type: PromotionType.STANDARD,
            rules: [
              {
                attribute: "customer_group",
                operator: "",
                values: "VIP",
              } as any,
            ],
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain("rules[].operator is a required field")

      error = await service
        .create([
          {
            code: "PROMOTION_TEST",
            type: PromotionType.STANDARD,
            rules: [
              {
                attribute: "customer_group",
                operator: "doesnotexist",
                values: "VIP",
              } as any,
            ],
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "rules[].operator (doesnotexist) is invalid. It should be one of gte, lte, gt, lt, eq, ne, in"
      )
    })
  })

  describe("update", () => {
    it("should throw an error when required params are not passed", async () => {
      const error = await service
        .update([
          {
            type: PromotionType.STANDARD,
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain('Promotion with id "" not found')
    })

    it("should update the attributes of a promotion successfully", async () => {
      await createPromotions(repositoryManager)

      const [updatedPromotion] = await service.update([
        {
          id: "promotion-id-1",
          is_automatic: true,
          code: "TEST",
          type: PromotionType.BUYGET,
        },
      ])

      expect(updatedPromotion).toEqual(
        expect.objectContaining({
          is_automatic: true,
          code: "TEST",
          type: PromotionType.BUYGET,
        })
      )
    })

    it("should update the attributes of a application method successfully", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "TEST",
          type: PromotionType.STANDARD,
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "across",
            value: "100",
          },
        },
      ])
      const applicationMethod = createdPromotion.application_method

      const [updatedPromotion] = await service.update([
        {
          id: createdPromotion.id,
          application_method: {
            id: applicationMethod?.id as string,
            value: "200",
          },
        },
      ])

      expect(updatedPromotion).toEqual(
        expect.objectContaining({
          application_method: expect.objectContaining({
            value: 200,
          }),
        })
      )
    })

    it("should change max_quantity to 0 when target_type is changed to order", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "TEST",
          type: PromotionType.STANDARD,
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            value: "100",
            max_quantity: 500,
          },
        },
      ])
      const applicationMethod = createdPromotion.application_method

      const [updatedPromotion] = await service.update([
        {
          id: createdPromotion.id,
          application_method: {
            id: applicationMethod?.id as string,
            target_type: "order",
            allocation: "across",
          },
        },
      ])

      expect(updatedPromotion).toEqual(
        expect.objectContaining({
          application_method: expect.objectContaining({
            target_type: "order",
            allocation: "across",
            max_quantity: 0,
          }),
        })
      )
    })

    it("should validate the attributes of a application method successfully", async () => {
      const [createdPromotion] = await service.create([
        {
          code: "TEST",
          type: PromotionType.STANDARD,
          application_method: {
            type: "fixed",
            target_type: "order",
            allocation: "across",
            value: "100",
          },
        },
      ])
      const applicationMethod = createdPromotion.application_method

      let error = await service
        .update([
          {
            id: createdPromotion.id,
            application_method: {
              id: applicationMethod?.id as string,
              target_type: "should-error",
            } as any,
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        `application_method.target_type should be one of order, shipping_methods, items`
      )

      error = await service
        .update([
          {
            id: createdPromotion.id,
            application_method: {
              id: applicationMethod?.id as string,
              allocation: "should-error",
            } as any,
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        `application_method.allocation should be one of each, across`
      )

      error = await service
        .update([
          {
            id: createdPromotion.id,
            application_method: {
              id: applicationMethod?.id as string,
              type: "should-error",
            } as any,
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        `application_method.type should be one of fixed, percentage`
      )
    })

    it("should update campaign of the promotion", async () => {
      await createCampaigns(repositoryManager)
      const [createdPromotion] = await createPromotions(repositoryManager, [
        {
          is_automatic: true,
          code: "TEST",
          type: PromotionType.BUYGET,
          campaign_id: "campaign-id-1",
        },
      ])

      const [updatedPromotion] = await service.update([
        {
          id: createdPromotion.id,
          campaign_id: "campaign-id-2",
        },
      ])

      expect(updatedPromotion).toEqual(
        expect.objectContaining({
          campaign: expect.objectContaining({
            id: "campaign-id-2",
          }),
        })
      )
    })
  })

  describe("retrieve", () => {
    beforeEach(async () => {
      await createPromotions(repositoryManager)
    })

    const id = "promotion-id-1"

    it("should return promotion for the given id", async () => {
      const promotion = await service.retrieve(id)

      expect(promotion).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when promotion with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "Promotion with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"promotionId" must be defined')
    })

    it("should return promotion based on config select param", async () => {
      const promotion = await service.retrieve(id, {
        select: ["id"],
      })

      const serialized = JSON.parse(JSON.stringify(promotion))

      expect(serialized).toEqual({
        id,
      })
    })
  })

  describe("listAndCount", () => {
    beforeEach(async () => {
      await createPromotions(repositoryManager, [
        {
          id: "promotion-id-1",
          code: "PROMOTION_1",
          type: PromotionType.STANDARD,
          application_method: {
            type: ApplicationMethodType.FIXED,
            value: "200",
            target_type: "items",
          },
        },
        {
          id: "promotion-id-2",
          code: "PROMOTION_2",
          type: PromotionType.STANDARD,
        },
      ])
    })

    it("should return all promotions and count", async () => {
      const [promotions, count] = await service.listAndCount()

      expect(count).toEqual(2)
      expect(promotions).toEqual([
        {
          id: "promotion-id-1",
          code: "PROMOTION_1",
          campaign: null,
          is_automatic: false,
          type: "standard",
          application_method: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          deleted_at: null,
        },
        {
          id: "promotion-id-2",
          code: "PROMOTION_2",
          campaign: null,
          is_automatic: false,
          type: "standard",
          application_method: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          deleted_at: null,
        },
      ])
    })

    it("should return all promotions based on config select and relations param", async () => {
      const [promotions, count] = await service.listAndCount(
        {
          id: ["promotion-id-1"],
        },
        {
          relations: ["application_method"],
          select: ["code", "application_method.type"],
        }
      )

      expect(count).toEqual(1)
      expect(promotions).toEqual([
        {
          id: "promotion-id-1",
          code: "PROMOTION_1",
          application_method: {
            id: expect.any(String),
            promotion: expect.any(Object),
            type: "fixed",
          },
        },
      ])
    })
  })

  describe("delete", () => {
    it("should soft delete the promotions given an id successfully", async () => {
      const createdPromotion = await service.create({
        code: "TEST",
        type: "standard",
      })

      await service.delete([createdPromotion.id])

      const promotions = await service.list(
        {
          id: [createdPromotion.id],
        },
        { withDeleted: true }
      )

      expect(promotions).toHaveLength(0)
    })
  })

  describe("softDelete", () => {
    it("should soft delete the promotions given an id successfully", async () => {
      const createdPromotion = await service.create({
        code: "TEST",
        type: "standard",
      })

      await service.softDelete([createdPromotion.id])

      const promotions = await service.list({
        id: [createdPromotion.id],
      })

      expect(promotions).toHaveLength(0)
    })
  })

  describe("restore", () => {
    it("should restore the promotions given an id successfully", async () => {
      const createdPromotion = await service.create({
        code: "TEST",
        type: "standard",
      })

      await service.softDelete([createdPromotion.id])

      let promotions = await service.list({ id: [createdPromotion.id] })

      expect(promotions).toHaveLength(0)
      await service.restore([createdPromotion.id])

      promotions = await service.list({ id: [createdPromotion.id] })
      expect(promotions).toHaveLength(1)
    })
  })

  describe("addPromotionRules", () => {
    let promotion

    beforeEach(async () => {
      ;[promotion] = await service.create([
        {
          code: "TEST",
          type: PromotionType.STANDARD,
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            value: "100",
            max_quantity: 500,
          },
        },
      ])
    })

    it("should throw an error when promotion with id does not exist", async () => {
      let error

      try {
        await service.addPromotionRules("does-not-exist", [])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "Promotion with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.addPromotionRules(undefined as unknown as string, [])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"promotionId" must be defined')
    })

    it("should successfully create rules for a promotion", async () => {
      promotion = await service.addPromotionRules(promotion.id, [
        {
          attribute: "customer_group_id",
          operator: "in",
          values: ["VIP", "top100"],
        },
      ])

      expect(promotion).toEqual(
        expect.objectContaining({
          id: promotion.id,
          rules: [
            expect.objectContaining({
              attribute: "customer_group_id",
              operator: "in",
              values: [
                expect.objectContaining({ value: "VIP" }),
                expect.objectContaining({ value: "top100" }),
              ],
            }),
          ],
        })
      )
    })
  })

  describe("addPromotionTargetRules", () => {
    let promotion

    beforeEach(async () => {
      ;[promotion] = await service.create([
        {
          code: "TEST",
          type: PromotionType.STANDARD,
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            value: "100",
            max_quantity: 500,
          },
        },
      ])
    })

    it("should throw an error when promotion with id does not exist", async () => {
      let error

      try {
        await service.addPromotionTargetRules("does-not-exist", [])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "Promotion with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.addPromotionTargetRules(
          undefined as unknown as string,
          []
        )
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"promotionId" must be defined')
    })

    it("should successfully create target rules for a promotion", async () => {
      promotion = await service.addPromotionTargetRules(promotion.id, [
        {
          attribute: "customer_group_id",
          operator: "in",
          values: ["VIP", "top100"],
        },
      ])

      expect(promotion).toEqual(
        expect.objectContaining({
          id: promotion.id,
          application_method: expect.objectContaining({
            target_rules: [
              expect.objectContaining({
                attribute: "customer_group_id",
                operator: "in",
                values: [
                  expect.objectContaining({ value: "VIP" }),
                  expect.objectContaining({ value: "top100" }),
                ],
              }),
            ],
          }),
        })
      )
    })
  })

  describe("removePromotionRules", () => {
    let promotion

    beforeEach(async () => {
      ;[promotion] = await service.create([
        {
          code: "TEST",
          type: PromotionType.STANDARD,
          rules: [
            {
              attribute: "customer_group_id",
              operator: "in",
              values: ["VIP", "top100"],
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            value: "100",
            max_quantity: 500,
          },
        },
      ])
    })

    it("should throw an error when promotion with id does not exist", async () => {
      let error

      try {
        await service.removePromotionRules("does-not-exist", [])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "Promotion with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.removePromotionRules(undefined as unknown as string, [])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"promotionId" must be defined')
    })

    it("should successfully create rules for a promotion", async () => {
      const [ruleId] = promotion.rules.map((rule) => rule.id)

      promotion = await service.removePromotionRules(promotion.id, [
        { id: ruleId },
      ])

      expect(promotion).toEqual(
        expect.objectContaining({
          id: promotion.id,
          rules: [],
        })
      )
    })
  })

  describe("removePromotionTargetRules", () => {
    let promotion

    beforeEach(async () => {
      ;[promotion] = await service.create([
        {
          code: "TEST",
          type: PromotionType.STANDARD,
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "each",
            value: "100",
            max_quantity: 500,
            target_rules: [
              {
                attribute: "customer_group_id",
                operator: "in",
                values: ["VIP", "top100"],
              },
            ],
          },
        },
      ])
    })

    it("should throw an error when promotion with id does not exist", async () => {
      let error

      try {
        await service.removePromotionTargetRules("does-not-exist", [])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "Promotion with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.removePromotionTargetRules(
          undefined as unknown as string,
          []
        )
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"promotionId" must be defined')
    })

    it("should successfully create rules for a promotion", async () => {
      const [ruleId] = promotion.application_method.target_rules.map(
        (rule) => rule.id
      )

      promotion = await service.removePromotionTargetRules(promotion.id, [
        { id: ruleId },
      ])

      expect(promotion).toEqual(
        expect.objectContaining({
          id: promotion.id,
          application_method: expect.objectContaining({
            target_rules: [],
          }),
        })
      )
    })
  })
})
