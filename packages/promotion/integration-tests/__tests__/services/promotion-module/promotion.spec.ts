import { IPromotionModuleService } from "@medusajs/types"
import { PromotionType } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { initialize } from "../../../../src"
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
            value: 100,
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
            value: 100,
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
              value: 100,
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
              value: 100,
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
})
