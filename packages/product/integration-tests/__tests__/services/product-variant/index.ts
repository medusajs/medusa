import { TestDatabase } from "../../../utils"
import { ProductVariantService } from "@services"
import { ProductVariant } from "@models"

describe("ProductVariant Service", () => {
  let service

  beforeEach(async () => {
    await TestDatabase.setupDatabase()

    service = new ProductVariantService({ manager: TestDatabase.getManager() })
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    beforeEach(async () => {
      const manager = TestDatabase.getManager()

      // TODO: cleanup database on every cycle
      const variantOne = manager.create(ProductVariant, {
        ...new ProductVariant(),
        title: "testing",
        inventory_quantity: 10,
      })

      manager.persistAndFlush([variantOne])
    })

    // TODO
    it.only("by default, all model columns are returned", async () => {
      const results = await service.list()

      expect(results).toEqual([])
    })

    // TODO
    it("passing in selectors, will only query selected columns", async () => {
      const results = await service.list()

      expect(results).toEqual([])
    })

    // TODO
    it("passing in relations, will query selected relations", async () => {
      const results = await service.list()

      expect(results).toEqual([])
    })
  })
})
