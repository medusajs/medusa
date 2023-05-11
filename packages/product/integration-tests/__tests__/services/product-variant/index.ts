import { TestDatabase } from "../../../utils"
import { ProductVariantService } from "@services"
import { ProductVariantRepository } from "@repositories"
import { ProductVariant } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"

describe("ProductVariant Service", () => {
  let service: ProductVariantService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let variantOne: ProductVariant
  let variantTwo: ProductVariant

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    const productVariantRepository = new ProductVariantRepository({
      manager: repositoryManager,
    })

    service = new ProductVariantService({ productVariantRepository })
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      variantOne = testManager.create(ProductVariant, {
        ...new ProductVariant(),
        id: "test-1",
        title: "variant 1",
        inventory_quantity: 10,
      })

      variantTwo = testManager.create(ProductVariant, {
        ...new ProductVariant(),
        id: "test-2",
        title: "variant",
        inventory_quantity: 10,
      })

      await testManager.persistAndFlush([variantOne])
    })

    // TODO
    it("selecting by properties, scopes out the results", async () => {
      const results = await service.list({
        where: {
          id: variantOne.id,
        },
      })

      expect(results).toEqual([
        expect.objectContaining({
          id: variantOne.id,
          title: "variant 1",
          // TODO: why is this a string?
          inventory_quantity: "10",
        }),
      ])
    })

    it("passing a limit, scopes the result to the limit", async () => {
      const results = await service.list({
        findOptions: {
          limit: 1,
        },
      })

      expect(results).toEqual([
        expect.objectContaining({
          id: variantOne.id,
        }),
      ])
    })

    it("passing populate, scopes the results of the response", async () => {
      const results = await service.list({
        where: {
          id: "test-1",
        },
        findOptions: {
          fields: ["id", "title"],
        },
      })

      expect(results).toEqual([
        {
          id: "test-1",
          title: "variant 1",
        },
      ])
    })
  })
})
