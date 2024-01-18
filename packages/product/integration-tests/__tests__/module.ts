import { MedusaModule } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { knex } from "knex"
import { initialize } from "../../src"
import { EventBusService } from "../__fixtures__/event-bus"
import * as CustomRepositories from "../__fixtures__/module"
import {
  buildProductAndRelationsData,
  createProductAndTags,
} from "../__fixtures__/product"
import { productsData } from "../__fixtures__/product/data"
import { DB_URL, TestDatabase } from "../utils"
import { kebabCase } from "@medusajs/utils"

const sharedPgConnection = knex<any, any>({
  client: "pg",
  searchPath: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
  connection: {
    connectionString: DB_URL,
  },
})

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase()
  return await TestDatabase.forkManager()
}

const afterEach_ = async () => {
  await TestDatabase.clearDatabase()
  MedusaModule.clearInstances()
}

describe("Product module", function () {
  const eventBus = new EventBusService()

  describe("Using built-in data access layer", function () {
    let module: IProductModuleService

    beforeEach(async () => {
      const testManager = await beforeEach_()
      await createProductAndTags(testManager, productsData)

      module = await initialize(
        {
          database: {
            clientUrl: DB_URL,
            schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
          },
        },
        {
          eventBusModuleService: eventBus,
        }
      )
    })

    afterEach(afterEach_)

    it("should initialize", async () => {
      expect(module).toBeDefined()
    })

    it("should have a connection that is not the shared connection", async () => {
      expect(
        (module as any).baseRepository_.manager_.getConnection().client
      ).not.toEqual(sharedPgConnection)
    })

    it("should return a list of product", async () => {
      const products = await module.list()
      expect(products).toHaveLength(3)
    })
  })

  describe("Using custom data access layer", function () {
    let module

    beforeEach(async () => {
      const testManager = await beforeEach_()

      await createProductAndTags(testManager, productsData)

      module = await initialize(
        {
          database: {
            clientUrl: DB_URL,
            schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
          },
          repositories: CustomRepositories,
        },
        {
          eventBusModuleService: eventBus,
        }
      )
    })

    afterEach(afterEach_)

    it("should initialize", async () => {
      expect(module).toBeDefined()
    })

    it("should have a connection that is not the shared connection", async () => {
      expect(
        (module as any).baseRepository_.manager_.getConnection().client
      ).not.toEqual(sharedPgConnection)
    })

    it("should return a list of product", async () => {
      const products = await module.list()

      expect(module.productService_.productRepository_.find).toHaveBeenCalled()
      expect(products).toHaveLength(0)
    })
  })

  describe("Using custom data access layer and manager", function () {
    let module

    beforeEach(async () => {
      const testManager = await beforeEach_()
      await createProductAndTags(testManager, productsData)

      MedusaModule.clearInstances()

      module = await initialize(
        {
          manager: testManager,
          repositories: CustomRepositories,
        },
        {
          eventBusModuleService: eventBus,
        }
      )
    })

    afterEach(afterEach_)

    it("should initialize and return a list of product", async () => {
      expect(module).toBeDefined()
    })

    it("should have a connection that is not the shared connection", async () => {
      expect(
        (module as any).baseRepository_.manager_.getConnection().client
      ).not.toEqual(sharedPgConnection)
    })

    it("should return a list of product", async () => {
      const products = await module.list()

      expect(module.productService_.productRepository_.find).toHaveBeenCalled()
      expect(products).toHaveLength(0)
    })
  })

  describe("Using an existing connection", function () {
    let module: IProductModuleService

    beforeEach(async () => {
      const testManager = await beforeEach_()
      await createProductAndTags(testManager, productsData)

      MedusaModule.clearInstances()

      module = await initialize(
        {
          database: {
            connection: sharedPgConnection,
          },
        },
        {
          eventBusModuleService: eventBus,
        }
      )
    })

    afterEach(afterEach_)

    it("should initialize and return a list of product", async () => {
      expect(module).toBeDefined()
    })

    it("should have a connection that is the shared connection", async () => {
      expect(
        JSON.stringify(
          (module as any).baseRepository_.manager_.getConnection().client
        )
      ).toEqual(JSON.stringify(sharedPgConnection))
    })
  })

  describe("create", function () {
    let module: IProductModuleService
    let images = ["image-1"]

    beforeEach(async () => {
      await beforeEach_()

      MedusaModule.clearInstances()

      module = await initialize(
        {
          database: {
            clientUrl: DB_URL,
            schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
          },
        },
        {
          eventBusModuleService: eventBus,
        }
      )
    })

    afterEach(afterEach_)

    it("should create a product", async () => {
      const data = buildProductAndRelationsData({
        images,
        thumbnail: images[0],
      })

      const products = await module.create([data])
      const [product] = await module.list(
        { id: products[0].id },
        {
          relations: [
            "options",
            "variants",
            "variants.options",
            "variants.options.value",
            "tags",
            "type",
            "categories",
            "images",
          ],
        }
      )

      expect(product.images).toHaveLength(1)
      expect(product.options).toHaveLength(1)
      expect(product.tags).toHaveLength(1)
      expect(product.categories).toHaveLength(0)
      expect(product.variants).toHaveLength(1)

      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          handle: kebabCase(data.title),
          subtitle: expect.any(String),
          description: expect.any(String),
          is_giftcard: false,
          status: "published",
          thumbnail: "image-1",
          type_id: expect.any(String),
          type: expect.objectContaining({
            id: expect.any(String),
            value: expect.any(String),
            metadata: null,
          }),
          discountable: true,
          options: [
            expect.objectContaining({
              id: expect.any(String),
              title: expect.any(String),
            }),
          ],
          variants: [
            expect.objectContaining({
              id: expect.any(String),
              title: expect.any(String),
              sku: expect.any(String),
              inventory_quantity: "100",
              variant_rank: "0",
            }),
          ],
          tags: [
            expect.objectContaining({
              id: expect.any(String),
              value: "tag-1",
            }),
          ],
          images: [
            expect.objectContaining({
              id: expect.any(String),
              url: "image-1",
            }),
          ],
          categories: [],
        })
      )
    })
  })

  describe("softDelete", function () {
    let module: IProductModuleService
    let images = ["image-1"]

    beforeEach(async () => {
      await beforeEach_()

      MedusaModule.clearInstances()

      module = await initialize(
        {
          database: {
            clientUrl: DB_URL,
            schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
          },
        },
        {
          eventBusModuleService: eventBus,
        }
      )
    })

    afterEach(afterEach_)

    it("should soft delete a product and its cascaded relations", async () => {
      const data = buildProductAndRelationsData({
        images,
        thumbnail: images[0],
      })

      const products = await module.create([data])

      await module.softDelete([products[0].id])
      const deletedProducts = await module.list(
        { id: products[0].id },
        {
          relations: [
            "variants",
            "variants.options",
            "options",
            "options.values",
          ],
          withDeleted: true,
        }
      )

      expect(deletedProducts).toHaveLength(1)
      expect(deletedProducts[0].deleted_at).not.toBeNull()

      for (const option of deletedProducts[0].options) {
        expect(option.deleted_at).not.toBeNull()
      }

      const productOptionsValues = deletedProducts[0].options
        .map((o) => o.values)
        .flat()

      for (const optionValue of productOptionsValues) {
        expect(optionValue.deleted_at).not.toBeNull()
      }

      for (const variant of deletedProducts[0].variants) {
        expect(variant.deleted_at).not.toBeNull()
      }

      const variantsOptions = deletedProducts[0].options
        .map((o) => o.values)
        .flat()

      for (const option of variantsOptions) {
        expect(option.deleted_at).not.toBeNull()
      }
    })
  })

  describe("restore", function () {
    let module: IProductModuleService
    let images = ["image-1"]

    beforeEach(async () => {
      await beforeEach_()

      MedusaModule.clearInstances()

      module = await initialize(
        {
          database: {
            clientUrl: DB_URL,
            schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
          },
        },
        {
          eventBusModuleService: eventBus,
        }
      )
    })

    afterEach(afterEach_)

    it("should restore a soft deleted product and its cascaded relations", async () => {
      const data = buildProductAndRelationsData({
        images,
        thumbnail: images[0],
      })

      const products = await module.create([data])

      await module.softDelete([products[0].id])
      await module.restore([products[0].id])

      const deletedProducts = await module.list(
        { id: products[0].id },
        {
          relations: [
            "variants",
            "variants.options",
            "variants.options",
            "options",
            "options.values",
          ],
          withDeleted: true,
        }
      )

      expect(deletedProducts).toHaveLength(1)
      expect(deletedProducts[0].deleted_at).toBeNull()

      for (const option of deletedProducts[0].options) {
        expect(option.deleted_at).toBeNull()
      }

      const productOptionsValues = deletedProducts[0].options
        .map((o) => o.values)
        .flat()

      for (const optionValue of productOptionsValues) {
        expect(optionValue.deleted_at).toBeNull()
      }

      for (const variant of deletedProducts[0].variants) {
        expect(variant.deleted_at).toBeNull()
      }

      const variantsOptions = deletedProducts[0].options
        .map((o) => o.values)
        .flat()

      for (const option of variantsOptions) {
        expect(option.deleted_at).toBeNull()
      }
    })
  })
})
