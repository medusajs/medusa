import { TestDatabase } from "../../../utils"
import { setupModuleService } from "../../../utils"
import { ProductModuleService } from "@services"
import { Product, ProductVariant } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductTypes } from "@medusajs/types"

describe("ProductModuleService product variants", () => {
  let service: ProductModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let variantOne: ProductVariant
  let variantTwo: ProductVariant
  let productOne: Product
  let productTwo: Product

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()
    service = setupModuleService({ repositoryManager })
    testManager = await TestDatabase.forkManager()

    productOne = testManager.create(Product, {
      id: "product-1",
      title: "product 1",
      status: ProductTypes.ProductStatus.PUBLISHED,
    })

    productTwo = testManager.create(Product, {
      id: "product-2",
      title: "product 2",
      status: ProductTypes.ProductStatus.PUBLISHED,
    })

    variantOne = testManager.create(ProductVariant, {
      id: "test-1",
      title: "variant 1",
      inventory_quantity: 10,
      product: productOne,
    })

    variantTwo = testManager.create(ProductVariant, {
      id: "test-2",
      title: "variant",
      inventory_quantity: 10,
      product: productTwo,
    })

    await testManager.persistAndFlush([variantOne, variantTwo])
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("listAndCountVariants", () => {
    it("selecting by properties, scopes out the results", async () => {
      const results = await service.listAndCountVariants({
        id: variantOne.id,
      })

      expect(results[1]).toEqual(1)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: variantOne.id,
          title: "variant 1",
          inventory_quantity: "10",
        }),
      ])
    })

    // TODO: investigate why pagination is incorrect
    it.skip("passing a limit, scopes the result to the limit", async () => {
      const results = await service.listAndCountVariants(
        {},
        {
          take: 1,
        }
      )

      expect(results[1]).toEqual(1)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: variantOne.id,
          title: "variant 1",
          inventory_quantity: "10",
        }),
      ])
    })

    it("passing populate, scopes the results of the response", async () => {
      const results = await service.listAndCountVariants(
        {
          id: variantOne.id,
        },
        {
          select: ["id", "title", "product.title"] as any,
          relations: ["product"],
        }
      )

      expect(results[1]).toEqual(1)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: "test-1",
          title: "variant 1",
          product_id: "product-1",
          product: expect.objectContaining({
            id: "product-1",
            title: "product 1",
          }),
        }),
      ])
    })
  })

  describe("retrieveVariant", () => {
    it("should return variant if variant with variant ID exists", async () => {
      const result = await service.retrieveVariant(variantOne.id)

      expect(result).toEqual(
        expect.objectContaining({
          id: "test-1",
          title: "variant 1",
        }),
      )
    })

    it("should return expected attributes when requested through config", async () => {
      const result = await service.retrieveVariant(
        variantOne.id,
        {
          select: ["id", "title", "product.title"] as any,
          relations: ["product"],
        }
      )

      expect(result).toEqual(
        expect.objectContaining({
          id: "test-1",
          title: "variant 1",
          product_id: "product-1",
          product: expect.objectContaining({
            id: "product-1",
            title: "product 1",
          }),
        }),
      )
    })

    it("should throw an error ", async () => {
      let error

      try {
        await service.retrieveVariant("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual("ProductVariant with id: does-not-exist was not found")
    })
  })
})

