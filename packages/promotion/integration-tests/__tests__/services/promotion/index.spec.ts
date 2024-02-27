import { createMedusaContainer, PromotionType } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PromotionService } from "@services"
import { createPromotions } from "../../../__fixtures__/promotion"
import { MikroOrmWrapper } from "../../../utils"
import { asValue } from "awilix"
import ContainerLoader from "../../../../src/loaders/container"

jest.setTimeout(30000)

describe("Promotion Service", () => {
  let service: PromotionService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()
    testManager = await MikroOrmWrapper.forkManager()

    const container = createMedusaContainer()
    container.register("manager", asValue(repositoryManager))

    await ContainerLoader({ container })

    service = container.resolve("promotionService")

    await createPromotions(testManager)
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
      await service.create([
        {
          code: "PROMOTION_TEST",
          type: PromotionType.STANDARD,
        },
      ])

      const [promotion] = await service.list({
        code: ["PROMOTION_TEST"],
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
