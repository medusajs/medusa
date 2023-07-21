import { IProductModuleService } from "@medusajs/types"
import { Product, ProductCollection } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductTypes } from "@medusajs/types"

import { initialize } from "../../../../src"
import { DB_URL, TestDatabase } from "../../../utils"
import { createCollections } from "../../../__fixtures__/product"

describe("ProductModuleService product collections", () => {
  let service: IProductModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let productOne: Product
  let productTwo: Product
  let productCollectionOne: ProductCollection
  let productCollectionTwo: ProductCollection
  let productCollections: ProductCollection[]

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

    const productCollectionsData = [{
      id: "test-1",
      title: "collection 1",
      products: [productOne],
    },{
      id: "test-2",
      title: "collection",
      products: [productTwo],
    }]

    productCollections = await createCollections(
      testManager,
      productCollectionsData
    )

    productCollectionOne = productCollections[0]
    productCollectionTwo = productCollections[1]

    await testManager.persistAndFlush([productCollectionOne, productCollectionTwo])
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("listCollections", () => {
    it("should return collections queried by ID", async () => {
      const results = await service.listCollections({
        id: productCollectionOne.id,
      })

      expect(results).toEqual([
        expect.objectContaining({
          id: productCollectionOne.id,
        }),
      ])
    })

    it("should return collections based on the options and filter parameter", async () => {
      let results = await service.listCollections(
        {
          id: productCollectionOne.id,
        },
        {
          take: 1,
        }
      )

      expect(results).toEqual([
        expect.objectContaining({
          id: productCollectionOne.id,
        }),
      ])

      results = await service.listCollections({}, { take: 1, skip: 1 })

      expect(results).toEqual([
        expect.objectContaining({
          id: productCollectionTwo.id,
        }),
      ])
    })

    it("should return only requested fields and relations for collections", async () => {
      const results = await service.listCollections(
        {
          id: productCollectionOne.id,
        },
        {
          select: ["id", "title", "products.title"],
          relations: ["products"],
        }
      )

      expect(results).toEqual([
        expect.objectContaining({
          id: "test-1",
          title: "collection 1",
          products: [
            expect.objectContaining({
              id: "product-1",
              title: "product 1",
            })
          ],
        }),
      ])
    })
  })

  describe("listAndCountCollections", () => {
    it("should return collections and count queried by ID", async () => {
      const results = await service.listAndCountCollections({
        id: productCollectionOne.id,
      })

      expect(results[1]).toEqual(1)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: productCollectionOne.id,
        }),
      ])
    })

    it("should return collections and count based on the options and filter parameter", async () => {
      let results = await service.listAndCountCollections(
        {
          id: productCollectionOne.id,
        },
        {
          take: 1,
        }
      )

      expect(results[1]).toEqual(1)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: productCollectionOne.id,
        }),
      ])

      results = await service.listAndCountCollections({}, { take: 1 })

      expect(results[1]).toEqual(2)

      results = await service.listAndCountCollections({}, { take: 1, skip: 1 })

      expect(results[1]).toEqual(2)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: productCollectionTwo.id,
        }),
      ])
    })

    it("should return only requested fields and relations for collections", async () => {
      const results = await service.listAndCountCollections(
        {
          id: productCollectionOne.id,
        },
        {
          select: ["id", "title", "products.title"],
          relations: ["products"],
        }
      )

      expect(results[1]).toEqual(1)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: "test-1",
          title: "collection 1",
          products: [expect.objectContaining({
            id: "product-1",
            title: "product 1",
          })],
        }),
      ])
    })
  })

  describe("retrieveCollection", () => {
    it("should return the requested collection", async () => {
      const result = await service.retrieveCollection(productCollectionOne.id)

      expect(result).toEqual(
        expect.objectContaining({
          id: "test-1",
          title: "collection 1",
        }),
      )
    })

    it("should return requested attributes when requested through config", async () => {
      const result = await service.retrieveCollection(
        productCollectionOne.id,
        {
          select: ["id", "title", "products.title"],
          relations: ["products"],
        }
      )

      expect(result).toEqual(
        expect.objectContaining({
          id: "test-1",
          title: "collection 1",
          products: [expect.objectContaining({
            id: "product-1",
            title: "product 1",
          })],
        }),
      )
    })

    it("should throw an error when a collection with ID does not exist", async () => {
      let error

      try {
        await service.retrieveCollection("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual("ProductCollection with id: does-not-exist was not found")
    })
  })
})

