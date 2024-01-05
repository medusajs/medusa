import { IPromotionModuleService } from "@medusajs/types"
import { PromotionType } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { initialize } from "../../../../src"
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

    it("should create a promotion with order application method with rules successfully", async () => {
      const [createdPromotion] = await service.create([
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

      const [promotion] = await service.list(
        {
          id: [createdPromotion.id],
        },
        {
          relations: [
            "application_method",
            "application_method.target_rules.values",
          ],
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
            target_rules: [
              expect.objectContaining({
                attribute: "product_id",
                operator: "eq",
                values: expect.arrayContaining([
                  expect.objectContaining({
                    value: "prod_tshirt",
                  }),
                ]),
              }),
            ],
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
              target_type: "item",
              value: "100",
            },
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "application_method.allocation should be either 'across OR each' when application_method.target_type is either 'shipping OR item'"
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
              target_type: "shipping",
              value: "100",
            },
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "application_method.max_quantity is required when application_method.allocation is 'each'"
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

      expect(error.message).toContain('Promotion with id "undefined" not found')
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
            target_type: "item",
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
            target_type: "item",
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
        `application_method.target_type should be one of order, shipping, item`
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

  describe("delete", () => {
    beforeEach(async () => {
      await createPromotions(repositoryManager)
    })

    const id = "promotion-id-1"

    it("should delete the promotions given an id successfully", async () => {
      await service.delete([id])

      const promotions = await service.list({
        id: [id],
      })

      expect(promotions).toHaveLength(0)
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
            target_type: "item",
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
            target_type: "item",
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
            target_type: "item",
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
            target_type: "item",
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
