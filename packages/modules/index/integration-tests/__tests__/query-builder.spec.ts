import {
  configLoader,
  container,
  logger,
  MedusaAppLoader,
} from "@medusajs/framework"
import { MedusaAppOutput, MedusaModule } from "@medusajs/framework/modules-sdk"
import { IndexTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils"
import { EntityManager } from "@mikro-orm/postgresql"
import { IndexData, IndexRelation } from "@models"
import { asValue } from "awilix"
import { initDb, TestDatabaseUtils } from "@medusajs/test-utils"
import path from "path"
import { EventBusServiceMock } from "../__fixtures__"
import { dbName } from "../__fixtures__/medusa-config"

const eventBusMock = new EventBusServiceMock()
const queryMock = jest.fn().mockReturnValue({
  graph: jest.fn(),
})

const dbUtils = TestDatabaseUtils.dbTestUtilFactory()

jest.setTimeout(300000)

let isFirstTime = true
let medusaAppLoader!: MedusaAppLoader

const beforeAll_ = async () => {
  try {
    await configLoader(
      path.join(__dirname, "./../__fixtures__"),
      "medusa-config"
    )

    console.log(`Creating database ${dbName}`)
    await dbUtils.create(dbName)
    dbUtils.pgConnection_ = await initDb()

    container.register({
      [ContainerRegistrationKeys.LOGGER]: asValue(logger),
      [ContainerRegistrationKeys.QUERY]: asValue(null),
      [ContainerRegistrationKeys.PG_CONNECTION]: asValue(dbUtils.pgConnection_),
    })

    medusaAppLoader = new MedusaAppLoader(container as any)

    // Migrations
    await medusaAppLoader.runModulesMigrations()
    const linkPlanner = await medusaAppLoader.getLinksExecutionPlanner()
    const plan = await linkPlanner.createPlan()
    await linkPlanner.executePlan(plan)

    // Clear partially loaded instances
    MedusaModule.clearInstances()

    // Bootstrap modules
    const globalApp = await medusaAppLoader.load()

    const index = container.resolve(Modules.INDEX)

    // Mock event bus  the index module
    ;(index as any).eventBusModuleService_ = eventBusMock

    await globalApp.onApplicationStart()
    ;(index as any).storageProvider_.query_ = queryMock

    return globalApp
  } catch (error) {
    console.error("Error initializing", error?.message)
    throw error
  }
}

const beforeEach_ = async () => {
  jest.clearAllMocks()

  if (isFirstTime) {
    isFirstTime = false
    return
  }

  try {
    await medusaAppLoader.runModulesLoader()
  } catch (error) {
    console.error("Error runner modules loaders", error?.message)
    throw error
  }
}

const afterEach_ = async () => {
  try {
    await dbUtils.teardown({ schema: "public" })
  } catch (error) {
    console.error("Error tearing down database:", error?.message)
    throw error
  }
}

describe("IndexModuleService query", function () {
  let medusaApp: MedusaAppOutput
  let module: IndexTypes.IIndexService
  let onApplicationPrepareShutdown!: () => Promise<void>
  let onApplicationShutdown!: () => Promise<void>

  beforeAll(async () => {
    medusaApp = await beforeAll_()
    onApplicationPrepareShutdown = medusaApp.onApplicationPrepareShutdown
    onApplicationShutdown = medusaApp.onApplicationShutdown
  })

  afterAll(async () => {
    await onApplicationPrepareShutdown()
    await onApplicationShutdown()
    await dbUtils.shutdown(dbName)
  })

  beforeEach(async () => {
    await beforeEach_()

    module = medusaApp.sharedContainer!.resolve(ModuleRegistrationName.INDEX)

    const manager = (
      (medusaApp.sharedContainer!.resolve(ModuleRegistrationName.INDEX) as any)
        .container_.manager as EntityManager
    ).fork()

    const indexRepository = manager.getRepository(IndexData)

    await manager.persistAndFlush(
      [
        {
          id: "prod_1",
          name: "Product",
          data: {
            id: "prod_1",
          },
        },
        {
          id: "prod_2",
          name: "Product",
          data: {
            id: "prod_2",
            title: "Product 2 title",
            deep: {
              a: 1,
              obj: {
                b: 15,
              },
            },
          },
        },
        {
          id: "var_1",
          name: "ProductVariant",
          data: {
            id: "var_1",
            sku: "aaa test aaa",
          },
        },
        {
          id: "var_2",
          name: "ProductVariant",
          data: {
            id: "var_2",
            sku: "sku 123",
          },
        },
        {
          id: "link_id_1",
          name: "LinkProductVariantPriceSet",
          data: {
            id: "link_id_1",
            variant_id: "var_1",
            price_set_id: "price_set_1",
          },
        },
        {
          id: "link_id_2",
          name: "LinkProductVariantPriceSet",
          data: {
            id: "link_id_2",
            variant_id: "var_2",
            price_set_id: "price_set_2",
          },
        },
        {
          id: "price_set_1",
          name: "PriceSet",
          data: {
            id: "price_set_1",
          },
        },
        {
          id: "price_set_2",
          name: "PriceSet",
          data: {
            id: "price_set_2",
          },
        },
        {
          id: "money_amount_1",
          name: "Price",
          data: {
            id: "money_amount_1",
            amount: 100,
          },
        },
        {
          id: "money_amount_2",
          name: "Price",
          data: {
            id: "money_amount_2",
            amount: 10,
          },
        },
      ].map((data) => indexRepository.create(data))
    )

    const indexRelationRepository = manager.getRepository(IndexRelation)

    await manager.persistAndFlush(
      [
        {
          parent_id: "prod_1",
          parent_name: "Product",
          child_id: "var_1",
          child_name: "ProductVariant",
          pivot: "Product-ProductVariant",
        },
        {
          parent_id: "prod_1",
          parent_name: "Product",
          child_id: "var_2",
          child_name: "ProductVariant",
          pivot: "Product-ProductVariant",
        },
        {
          parent_id: "var_1",
          parent_name: "ProductVariant",
          child_id: "link_id_1",
          child_name: "LinkProductVariantPriceSet",
          pivot: "ProductVariant-LinkProductVariantPriceSet",
        },
        {
          parent_id: "var_2",
          parent_name: "ProductVariant",
          child_id: "link_id_2",
          child_name: "LinkProductVariantPriceSet",
          pivot: "ProductVariant-LinkProductVariantPriceSet",
        },
        {
          parent_id: "link_id_1",
          parent_name: "LinkProductVariantPriceSet",
          child_id: "price_set_1",
          child_name: "PriceSet",
          pivot: "LinkProductVariantPriceSet-PriceSet",
        },
        {
          parent_id: "link_id_2",
          parent_name: "LinkProductVariantPriceSet",
          child_id: "price_set_2",
          child_name: "PriceSet",
          pivot: "LinkProductVariantPriceSet-PriceSet",
        },
        {
          parent_id: "price_set_1",
          parent_name: "PriceSet",
          child_id: "money_amount_1",
          child_name: "Price",
          pivot: "PriceSet-Price",
        },
        {
          parent_id: "price_set_2",
          parent_name: "PriceSet",
          child_id: "money_amount_2",
          child_name: "Price",
          pivot: "PriceSet-Price",
        },
      ].map((data) => indexRelationRepository.create(data))
    )
  })

  afterEach(afterEach_)

  it("should query all products ordered by sku DESC", async () => {
    const { data } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      pagination: {
        order: {
          product: {
            variants: {
              sku: "DESC",
            },
          },
        },
      },
    })

    expect(data).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
      {
        id: "prod_1",
        variants: [
          {
            id: "var_2",
            sku: "sku 123",
            prices: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },

          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
        ],
      },
    ])
  })

  it("should query products filtering by variant sku", async () => {
    const { data } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      filters: {
        product: {
          variants: {
            sku: { $like: "aaa%" },
          },
        },
      },
    })

    expect(data).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
        ],
      },
    ])
  })

  it("should query products filtering by price and returning the complete entity", async () => {
    const { data } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      filters: {
        product: {
          variants: {
            prices: {
              amount: { $gt: 50 },
            },
          },
        },
      },
      keepFilteredEntities: true,
    })

    expect(data).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
          {
            id: "var_2",
            sku: "sku 123",
            prices: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },
        ],
      },
    ])
  })

  it("should query all products", async () => {
    const { data } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
    })

    expect(data).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
          {
            id: "var_2",
            sku: "sku 123",
            prices: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },
        ],
      },
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
    ])
  })

  it("should paginate products", async () => {
    const { data } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      pagination: {
        take: 1,
        skip: 1,
      },
    })

    expect(data).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
    ])
  })

  it("should handle null values on where clause", async () => {
    const { data } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      filters: {
        product: {
          variants: {
            sku: null,
          },
        },
      },
    })

    expect(data).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
    ])
  })

  it("should query products filtering by deep nested levels", async () => {
    const { data } = await module.query({
      fields: ["product.*"],
      filters: {
        product: {
          deep: {
            obj: {
              b: 15,
            },
          },
        },
      },
    })

    expect(data).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
      },
    ])
  })
})
