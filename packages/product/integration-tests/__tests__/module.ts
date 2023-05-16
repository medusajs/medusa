import { initialize } from "../../src"
import { databaseOptions, TestDatabase } from "../utils"
import { createProductAndTags } from "../__fixtures__/product"
import { Product } from "@models"
import * as CustomRepositories from "../__fixtures__/module"
import { ProductRepository } from "../__fixtures__/module"
import { productsData } from "../__fixtures__/product/data"

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase()
  return await TestDatabase.forkManager()
}

const afterEach_ = async () => {
  await TestDatabase.clearDatabase()
}

describe("Product module", function () {
  describe("Using built-in data access layer", function () {
    let module
    let products: Product[]

    beforeEach(async () => {
      const testManager = await beforeEach_()

      products = await createProductAndTags(testManager, productsData)

      module = await initialize({
        database: {
          clientUrl: `postgres://postgres@localhost:5432/${
            databaseOptions!.clientUrl
          }`,
          driverOptions: {
            connection: { ssl: false },
          },
        },
      })
    })

    afterEach(afterEach_)

    it("should initialize", async () => {
      expect(module).toBeDefined()
    })

    it("should return a list of product", async () => {
      const products = await module.list()
      expect(products).toHaveLength(2)
    })
  })

  describe("Using custom data access layer", function () {
    let module
    let products: Product[]

    beforeEach(async () => {
      const testManager = await beforeEach_()

      products = await createProductAndTags(testManager, productsData)

      module = await initialize({
        database: {
          clientUrl: `postgres://postgres@localhost:5432/${
            databaseOptions!.clientUrl
          }`,
          driverOptions: {
            connection: { ssl: false },
          },
        },
        repositories: CustomRepositories,
      })
    })

    afterEach(afterEach_)

    it("should initialize", async () => {
      expect(module).toBeDefined()
    })

    it("should return a list of product", async () => {
      const products = await module.list()

      expect(ProductRepository.prototype.find).toHaveBeenCalled()
      expect(products).toHaveLength(0)
    })
  })

  describe("Using custom data access layer and connection", function () {
    let module
    let products: Product[]

    beforeEach(async () => {
      const testManager = await beforeEach_()

      products = await createProductAndTags(testManager, productsData)

      module = await initialize({
        manager: testManager,
        repositories: CustomRepositories,
      })
    })

    afterEach(afterEach_)

    it("should initialize", async () => {
      expect(module).toBeDefined()
    })

    it("should return a list of product", async () => {
      const products = await module.list()

      expect(ProductRepository.prototype.find).toHaveBeenCalled()
      expect(products).toHaveLength(0)
    })
  })
})
