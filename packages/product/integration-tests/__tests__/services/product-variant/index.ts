import { TestDatabase } from "../../../utils"
import { ProductVariantService } from "@services"
import { ProductVariantRepository } from "@repositories"
import { ProductVariant } from "@models"

describe("ProductVariant Service", () => {
  let service
  let variantOne
  let variantTwo

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    const productVariantRepository = new ProductVariantRepository({ manager: TestDatabase.getManager() })
    service = new ProductVariantService({ productVariantRepository })
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    beforeEach(async () => {
      const manager = TestDatabase.getManager()

      variantOne = manager.create(ProductVariant, {
        ...new ProductVariant(),
        title: "variant 1",
        inventory_quantity: 10,
      })

      variantTwo = manager.create(ProductVariant, {
        ...new ProductVariant(),
        title: "variant",
        inventory_quantity: 10,
      })

      await manager.persistAndFlush([variantOne])
    })

    // TODO
    it("selecting by properties, scopes out the results", async () => {
      const results = await service.list({
        where: {
          id: variantOne.id
        }
      })

      expect(results).toEqual([
        expect.objectContaining({
          id: variantOne.id,
          title: "variant 1",
          // TODO: why is this a string?
          inventory_quantity: "10",
        })
      ])
    })

    // TODO
    it("passing a limit, scopes the result to the limit", async () => {
      const results = await service.list({
        findOptions: {
          limit: 1
        }
      })

      expect(results).toEqual([
        expect.objectContaining({
          id: variantOne.id,
        })
      ])
    })

    // TODO
    it("passing populate, scopes the results of the response", async () => {
      const results = await service.list({
        findOptions: {
          populate: ['id'],
          limit: 1,
        }
      })

      expect(results).toEqual([
        {
          id: variantOne.id,
        }
      ])
    })
  })
})
