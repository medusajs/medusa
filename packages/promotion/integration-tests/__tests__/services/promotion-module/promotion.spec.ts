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
  })
})
