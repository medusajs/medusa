import { IProductModuleService } from "@medusajs/types"
import { Product, ProductCategory } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductTypes } from "@medusajs/types"

import { initialize } from "../../../../src"
import { DB_URL, TestDatabase } from "../../../utils"
import { createProductCategories } from "../../../__fixtures__/product-category"

describe("ProductModuleService product categories", () => {
  let service: IProductModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let productOne: Product
  let productTwo: Product
  let productCategoryOne: ProductCategory
  let productCategoryTwo: ProductCategory
  let productCategories: ProductCategory[]

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
      },
    })

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

    const productCategoriesData = [{
      id: "test-1",
      name: "category 1",
      products: [productOne],
    },{
      id: "test-2",
      name: "category",
      products: [productTwo],
    }]

    productCategories = await createProductCategories(
      testManager,
      productCategoriesData
    )

    productCategoryOne = productCategories[0]
    productCategoryTwo = productCategories[1]

    await testManager.persistAndFlush([productCategoryOne, productCategoryTwo])
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("listCategories", () => {
    it("should return categories queried by ID", async () => {
      const results = await service.listCategories({
        id: productCategoryOne.id,
      })

      expect(results).toEqual([
        expect.objectContaining({
          id: productCategoryOne.id,
        }),
      ])
    })

    it("should return categories based on the options and filter parameter", async () => {
      let results = await service.listCategories(
        {
          id: productCategoryOne.id,
        },
        {
          take: 1,
        }
      )

      expect(results).toEqual([
        expect.objectContaining({
          id: productCategoryOne.id,
        }),
      ])

      results = await service.listCategories({}, { take: 1, skip: 1 })

      expect(results).toEqual([
        expect.objectContaining({
          id: productCategoryTwo.id,
        }),
      ])
    })

    it("should return only requested fields and relations for categories", async () => {
      const results = await service.listCategories(
        {
          id: productCategoryOne.id,
        },
        {
          select: ["id", "name", "products.title"],
          relations: ["products"],
        }
      )

      expect(results).toEqual([
        expect.objectContaining({
          id: "test-1",
          name: "category 1",
          products: [expect.objectContaining({
            id: "product-1",
            title: "product 1",
          })],
        }),
      ])
    })
  })

  describe("listAndCountCategories", () => {
    it("should return categories and count queried by ID", async () => {
      const results = await service.listAndCountCategories({
        id: productCategoryOne.id,
      })

      expect(results[1]).toEqual(1)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: productCategoryOne.id,
        }),
      ])
    })

    it("should return categories and count based on the options and filter parameter", async () => {
      let results = await service.listAndCountCategories(
        {
          id: productCategoryOne.id,
        },
        {
          take: 1,
        }
      )

      expect(results[1]).toEqual(1)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: productCategoryOne.id,
        }),
      ])

      results = await service.listAndCountCategories({}, { take: 1 })

      expect(results[1]).toEqual(2)

      results = await service.listAndCountCategories({}, { take: 1, skip: 1 })

      expect(results[1]).toEqual(2)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: productCategoryTwo.id,
        }),
      ])
    })

    it("should return only requested fields and relations for categories", async () => {
      const results = await service.listAndCountCategories(
        {
          id: productCategoryOne.id,
        },
        {
          select: ["id", "name", "products.title"],
          relations: ["products"],
        }
      )

      expect(results[1]).toEqual(1)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: "test-1",
          name: "category 1",
          products: [expect.objectContaining({
            id: "product-1",
            title: "product 1",
          })],
        }),
      ])
    })
  })

  describe("retrieveCategory", () => {
    it("should return the requested category", async () => {
      const result = await service.retrieveCategory(productCategoryOne.id)

      expect(result).toEqual(
        expect.objectContaining({
          id: "test-1",
          name: "category 1",
        }),
      )
    })

    it("should return requested attributes when requested through config", async () => {
      const result = await service.retrieveCategory(
        productCategoryOne.id,
        {
          select: ["id", "name", "products.title"],
          relations: ["products"],
        }
      )

      expect(result).toEqual(
        expect.objectContaining({
          id: "test-1",
          name: "category 1",
          products: [expect.objectContaining({
            id: "product-1",
            title: "product 1",
          })],
        }),
      )
    })

    it("should throw an error when a category with ID does not exist", async () => {
      let error

      try {
        await service.retrieveCategory("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual("ProductCategory with id: does-not-exist was not found")
    })
  })
})

