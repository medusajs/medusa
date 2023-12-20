import { IPromotionModuleService } from "@medusajs/types"
import { PromotionType } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { initialize } from "../../../../src"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("Promotion Service", () => {
  let service: IPromotionModuleService
  let testManager: SqlEntityManager
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

    it("should create a promotion successfully", async () => {
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
  })
})
