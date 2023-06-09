import { MedusaModule } from "@medusajs/modules-sdk"
import { Product } from "@models"
import { initialize } from "../../src"
import * as CustomRepositories from "../__fixtures__/module"
import { ProductRepository } from "../__fixtures__/module"
import { createProductAndTags } from "../__fixtures__/product"
import { productsData } from "../__fixtures__/product/data"
import { DB_URL, TestDatabase } from "../utils"

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
          clientUrl: DB_URL,
          schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
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
          clientUrl: DB_URL,
          schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
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

      MedusaModule.clearInstances()

      module = await initialize({
        manager: testManager,
        repositories: CustomRepositories,
      })
    })

    afterEach(afterEach_)

    it("should initialize and return a list of product", async () => {
      expect(module).toBeDefined()
    })

    it("should return a list of product", async () => {
      const products = await module.list()

      expect(ProductRepository.prototype.find).toHaveBeenCalled()
      expect(products).toHaveLength(0)
    })
  })
})
