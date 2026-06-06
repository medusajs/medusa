import {
  configLoader,
  container,
  logger,
  MedusaAppLoader,
  Migrator,
} from "@zjedene-medusa/framework"
import { asValue } from "@zjedene-medusa/framework/awilix"
import { EntityManager } from "@zjedene-medusa/framework/mikro-orm/postgresql"
import { MedusaAppOutput, MedusaModule } from "@zjedene-medusa/framework/modules-sdk"
import { EventBusTypes, IndexTypes } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  toMikroORMEntity,
} from "@zjedene-medusa/framework/utils"
import { initDb, TestDatabaseUtils } from "@zjedene-medusa/test-utils"
import { IndexData, IndexRelation } from "@models"
import * as path from "path"
import { setTimeout } from "timers/promises"
import { EventBusServiceMock } from "../__fixtures__"
import { dbName } from "../__fixtures__/medusa-config"

const eventBusMock = new EventBusServiceMock()
const queryMock = {
  graph: jest.fn(),
}

const dbUtils = TestDatabaseUtils.dbTestUtilFactory()

jest.setTimeout(300000)

const productId = "prod_1"
const productId2 = "prod_2"
const variantId = "var_1"
const variantId2 = "var_2"
const priceSetId = "price_set_1"
const priceId = "money_amount_1"
const linkId = "link_id_1"

const sendEvents = async (eventDataToEmit) => {
  let productCounter = 0
  let variantCounter = 0

  queryMock.graph = jest.fn().mockImplementation((query) => {
    const entity = query.entity
    if (entity === "product") {
      return {
        data: {
          id: productCounter++ > 0 ? productId2 : productId,
          title: "Test Product " + productCounter,
        },
      }
    } else if (entity === "product_variant") {
      const counter = variantCounter++
      return {
        data: {
          id: counter > 0 ? variantId2 : variantId,
          sku: "aaa test aaa",
          product: {
            id: counter > 0 ? productId2 : productId,
          },
        },
      }
    } else if (entity === "price_set") {
      return {
        data: {
          id: priceSetId,
        },
      }
    } else if (entity === "price") {
      return {
        data: {
          id: priceId,
          amount: 100,
          price_set: [
            {
              id: priceSetId,
            },
          ],
        },
      }
    } else if (entity === "product_variant_price_set") {
      return {
        data: {
          id: linkId,
          variant_id: variantId,
          price_set_id: priceSetId,
          variant: [
            {
              id: variantId,
            },
          ],
        },
      }
    }

    return {}
  })

  await eventBusMock.emit(eventDataToEmit)
}

let isFirstTime = true
let medusaAppLoader!: MedusaAppLoader
let index!: IndexTypes.IIndexService

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
    const migrator = new Migrator({ container })
    await migrator.ensureMigrationsTable()

    await medusaAppLoader.runModulesMigrations()
    const linkPlanner = await medusaAppLoader.getLinksExecutionPlanner()
    const plan = await linkPlanner.createPlan()
    await linkPlanner.executePlan(plan)

    // Clear partially loaded instances
    MedusaModule.clearInstances()

    // Bootstrap modules
    const globalApp = await medusaAppLoader.load()

    index = container.resolve(Modules.INDEX)

    // Mock event bus  the index module
    ;(index as any).eventBusModuleService_ = eventBusMock

    await globalApp.onApplicationStart()
    await setTimeout(3000)
    ;(index as any).storageProvider_.query_ = queryMock

    return globalApp
  } catch (error) {
    console.error("Error initializing", error?.message)
    throw error
  }
}

const beforeEach_ = async (eventDataToEmit) => {
  jest.clearAllMocks()

  if (isFirstTime) {
    isFirstTime = false
    await sendEvents(eventDataToEmit)

    return
  }

  try {
    await medusaAppLoader.runModulesLoader()

    await sendEvents(eventDataToEmit)
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

describe("IndexModuleService", function () {
  let medusaApp: MedusaAppOutput
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

  afterEach(afterEach_)

  describe("on created or attached events", function () {
    let manager

    const eventDataToEmit: EventBusTypes.Event[] = [
      {
        name: "product.created",
        data: {
          id: productId,
        },
      },
      {
        name: "product.created",
        data: {
          id: "PRODUCTASDASDAS",
        },
      },
      {
        name: "variant.created",
        data: {
          id: variantId,
          product: {
            id: productId,
          },
        },
      },
      {
        name: "pricing.price-set.created",
        data: {
          id: priceSetId,
        },
      },
      {
        name: "price.created",
        data: {
          id: priceId,
          price_set: {
            id: priceSetId,
          },
        },
      },
      {
        name: "LinkProductVariantPriceSet.attached",
        data: {
          id: linkId,
          variant_id: variantId,
          price_set_id: priceSetId,
        },
      },
    ]

    beforeEach(async () => {
      await beforeEach_(eventDataToEmit)

      manager = (medusaApp.sharedContainer!.resolve(Modules.INDEX) as any)
        .container_.manager as EntityManager
    })

    afterEach(afterEach_)

    it("should create the corresponding index entries and index relation entries", async function () {
      /**
       * Validate all index entries and index relation entries
       */

      const indexEntries: IndexData[] = await manager.find(
        toMikroORMEntity(IndexData),
        {}
      )

      const productIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "Product"
      })

      expect(productIndexEntries).toHaveLength(2)

      const variantIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "ProductVariant"
      })

      expect(variantIndexEntries).toHaveLength(1)

      const priceSetIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "PriceSet"
      })

      expect(priceSetIndexEntries).toHaveLength(1)

      const priceIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "Price"
      })

      expect(priceIndexEntries).toHaveLength(1)

      const linkIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "LinkProductVariantPriceSet"
      })

      expect(linkIndexEntries).toHaveLength(1)

      const indexRelationEntries: IndexRelation[] = await manager.find(
        IndexRelation,
        {}
      )

      expect(indexRelationEntries).toHaveLength(4)

      const productVariantIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === productId &&
            entry.parent_name === "Product" &&
            entry.child_id === variantId &&
            entry.child_name === "ProductVariant"
          )
        }
      )

      expect(productVariantIndexRelationEntries).toHaveLength(1)

      const variantLinkIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === variantId &&
            entry.parent_name === "ProductVariant" &&
            entry.child_id === linkId &&
            entry.child_name === "LinkProductVariantPriceSet"
          )
        }
      )

      expect(variantLinkIndexRelationEntries).toHaveLength(1)

      const linkPriceSetIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === linkId &&
            entry.parent_name === "LinkProductVariantPriceSet" &&
            entry.child_id === priceSetId &&
            entry.child_name === "PriceSet"
          )
        }
      )

      expect(linkPriceSetIndexRelationEntries).toHaveLength(1)

      const priceSetPriceIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === priceSetId &&
            entry.parent_name === "PriceSet" &&
            entry.child_id === priceId &&
            entry.child_name === "Price"
          )
        }
      )

      expect(priceSetPriceIndexRelationEntries).toHaveLength(1)
    })
  })

  describe("on unordered created or attached events", function () {
    let manager

    const eventDataToEmit: EventBusTypes.Event[] = [
      {
        name: "variant.created",
        data: {
          id: variantId,
          product: {
            id: productId,
          },
        },
      },
      {
        name: "product.created",
        data: {
          id: productId,
        },
      },
      {
        name: "product.created",
        data: {
          id: productId2,
        },
      },
      {
        name: "variant.created",
        data: {
          id: variantId2,
          product: {
            id: productId2,
          },
        },
      },
      {
        name: "pricing.price-set.created",
        data: {
          id: priceSetId,
        },
      },
      {
        name: "price.created",
        data: {
          id: priceId,
          price_set: {
            id: priceSetId,
          },
        },
      },
      {
        name: "LinkProductVariantPriceSet.attached",
        data: {
          id: linkId,
          variant_id: variantId,
          price_set_id: priceSetId,
        },
      },
    ]

    beforeEach(async () => {
      await beforeEach_(eventDataToEmit)

      manager = (medusaApp.sharedContainer!.resolve(Modules.INDEX) as any)
        .container_.manager as EntityManager
    })

    afterEach(afterEach_)

    it("should create the corresponding index entries and index relation entries", async function () {
      /**
       * Validate all index entries and index relation entries
       */

      const indexEntries: IndexData[] = await manager.find(
        toMikroORMEntity(IndexData),
        {}
      )

      const productIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "Product"
      })

      expect(productIndexEntries).toHaveLength(2)
      expect(productIndexEntries).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: productId,
            data: expect.objectContaining({
              id: productId,
              title: expect.stringContaining("Test Product"),
            }),
          }),
          expect.objectContaining({
            id: productId2,
            data: expect.objectContaining({
              id: productId2,
              title: expect.stringContaining("Test Product"),
            }),
          }),
        ])
      )

      const variantIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "ProductVariant"
      })

      expect(variantIndexEntries).toHaveLength(2)
      expect(variantIndexEntries).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: variantId,
            data: expect.objectContaining({
              id: variantId,
            }),
          }),
          expect.objectContaining({
            id: variantId2,
            data: expect.objectContaining({
              id: variantId2,
            }),
          }),
        ])
      )

      const priceSetIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "PriceSet"
      })

      expect(priceSetIndexEntries).toHaveLength(1)
      expect(priceSetIndexEntries[0].id).toEqual(priceSetId)

      const priceIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "Price"
      })

      expect(priceIndexEntries).toHaveLength(1)
      expect(priceIndexEntries[0].id).toEqual(priceId)

      const linkIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "LinkProductVariantPriceSet"
      })

      expect(linkIndexEntries).toHaveLength(1)
      expect(linkIndexEntries[0].id).toEqual(linkId)

      const indexRelationEntries: IndexRelation[] = await manager.find(
        IndexRelation,
        {}
      )

      expect(indexRelationEntries).toHaveLength(5)

      const productVariantIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === productId &&
            entry.parent_name === "Product" &&
            entry.child_id === variantId &&
            entry.child_name === "ProductVariant"
          )
        }
      )

      expect(productVariantIndexRelationEntries).toHaveLength(1)

      const variantLinkIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === variantId &&
            entry.parent_name === "ProductVariant" &&
            entry.child_id === linkId &&
            entry.child_name === "LinkProductVariantPriceSet"
          )
        }
      )

      expect(variantLinkIndexRelationEntries).toHaveLength(1)

      const linkPriceSetIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === linkId &&
            entry.parent_name === "LinkProductVariantPriceSet" &&
            entry.child_id === priceSetId &&
            entry.child_name === "PriceSet"
          )
        }
      )

      expect(linkPriceSetIndexRelationEntries).toHaveLength(1)

      const priceSetPriceIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === priceSetId &&
            entry.parent_name === "PriceSet" &&
            entry.child_id === priceId &&
            entry.child_name === "Price"
          )
        }
      )

      expect(priceSetPriceIndexRelationEntries).toHaveLength(1)
    })
  })

  describe("on updated events", function () {
    let manager

    const updateData = async (manager) => {
      const indexRepository = manager.getRepository(IndexData)
      await indexRepository.upsertMany([
        {
          id: productId,
          name: "Product",
          data: {
            id: productId,
          },
        },
        {
          id: variantId,
          name: "ProductVariant",
          data: {
            id: variantId,
            sku: "aaa test aaa",
            product: {
              id: productId,
            },
          },
        },
      ])
    }

    const eventDataToEmit: EventBusTypes.Event[] = [
      {
        name: "product.updated",
        data: {
          id: productId,
        },
      },
      {
        name: "variant.updated",
        data: {
          id: variantId,
          product: {
            id: productId,
          },
        },
      },
    ]

    beforeEach(async () => {
      await beforeEach_(eventDataToEmit)

      manager = (medusaApp.sharedContainer!.resolve(Modules.INDEX) as any)
        .container_.manager as EntityManager

      await updateData(manager)

      queryMock.graph = jest.fn().mockImplementation((query) => {
        const entity = query.entity
        if (entity === "product") {
          return {
            data: {
              id: productId,
              title: "updated Title",
            },
          }
        } else if (entity === "product_variant") {
          return {
            data: {
              id: variantId,
              sku: "updated sku",
              product: [
                {
                  id: productId,
                },
              ],
            },
          }
        }

        return {}
      })

      await eventBusMock.emit(eventDataToEmit)
    })

    afterEach(afterEach_)

    it("should update the corresponding index entries", async () => {
      const updatedIndexEntries = await manager.find(
        toMikroORMEntity(IndexData),
        {}
      )

      expect(updatedIndexEntries).toHaveLength(2)

      const productEntry = updatedIndexEntries.find((entry) => {
        return entry.name === "Product" && entry.id === productId
      })

      expect(productEntry?.data?.title).toEqual("updated Title")

      const variantEntry = updatedIndexEntries.find((entry) => {
        return entry.name === "ProductVariant" && entry.id === variantId
      })

      expect(variantEntry?.data?.sku).toEqual("updated sku")
    })
  })

  describe("on deleted events", function () {
    let manager

    const eventDataToEmit: EventBusTypes.Event[] = [
      {
        name: "product.created",
        data: {
          id: productId,
        },
      },
      {
        name: "variant.created",
        data: {
          id: variantId,
          product: {
            id: productId,
          },
        },
      },
      {
        name: "pricing.price-set.created",
        data: {
          id: priceSetId,
        },
      },
      {
        name: "price.created",
        data: {
          id: priceId,
          price_set: {
            id: priceSetId,
          },
        },
      },
      {
        name: "LinkProductVariantPriceSet.attached",
        data: {
          id: linkId,
          variant_id: variantId,
          price_set_id: priceSetId,
        },
      },
    ]

    const deleteEventDataToEmit: EventBusTypes.Event[] = [
      {
        name: "product.deleted",
        data: {
          id: productId,
        },
      },
      {
        name: "variant.deleted",
        data: {
          id: variantId,
        },
      },
    ]

    beforeEach(async () => {
      await beforeEach_(eventDataToEmit)

      manager = (medusaApp.sharedContainer!.resolve(Modules.INDEX) as any)
        .container_.manager as EntityManager

      queryMock.graph = jest.fn().mockImplementation((query) => {
        const entity = query.entity
        if (entity === "product") {
          return {
            data: {
              id: productId,
            },
          }
        } else if (entity === "product_variant") {
          return {
            data: {
              id: variantId,
              product: [
                {
                  id: productId,
                },
              ],
            },
          }
        }

        return {}
      })

      await eventBusMock.emit(deleteEventDataToEmit)
    })

    it("should consume all deleted events and delete the index entries", async () => {
      const indexEntries = await manager.find(toMikroORMEntity(IndexData), {})
      const indexRelationEntries = await manager.find(
        toMikroORMEntity(IndexRelation)
      )

      expect(indexEntries).toHaveLength(3)
      expect(indexRelationEntries).toHaveLength(2)
    })
  })
})
