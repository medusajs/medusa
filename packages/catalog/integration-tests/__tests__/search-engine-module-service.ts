import { MedusaApp, Modules } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Catalog, CatalogRelation } from "@models"
import { CatalogModuleService } from "@services"
import { knex } from "knex"
import { joinerConfig } from "../../src/__tests__/__fixtures__/joiner-config"
import modulesConfig from "../../src/__tests__/__fixtures__/modules-config"
import { initialize } from "../../src/initialize"
import { EventBusService, schema } from "../__fixtures__"
import { DB_URL, TestDatabase } from "../utils"
import { EventBusTypes } from "@medusajs/types"

const sharedPgConnection = knex<any, any>({
  client: "pg",
  searchPath: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
  connection: {
    connectionString: DB_URL,
  },
})

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase()
  jest.clearAllMocks()
  return await TestDatabase.forkManager()
}

const afterEach_ = async () => {
  await TestDatabase.clearDatabase()
}

describe("SearchEngineModuleService", function () {
  const eventBus = new EventBusService()
  const remoteQueryMock = jest.fn()

  let manager: SqlEntityManager
  let module: CatalogModuleService

  const searchEngineModuleOptions = {
    defaultAdapterOptions: {
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
      },
    },
    schema,
  }

  const injectedDependencies = {
    [ContainerRegistrationKeys.PG_CONNECTION]: sharedPgConnection,
    eventBusModuleService: eventBus,
    remoteQuery: remoteQueryMock,
  }

  beforeAll(async () => {
    await MedusaApp({
      modulesConfig: {
        ...modulesConfig,
        [Modules.CATALOG]: {
          options: searchEngineModuleOptions,
        },
      },
      servicesConfig: joinerConfig,
      injectedDependencies,
    })
  })

  beforeEach(async () => {
    manager = await beforeEach_()

    module = await initialize(searchEngineModuleOptions, {
      eventBusModuleService: eventBus,
      remoteQuery: remoteQueryMock,
    })

    // TODO
    await module.onApplicationStart?.()
  })

  afterEach(afterEach_)

  it("should consume all event create the catalog and catalog relation entries and finally query the data", async () => {
    const productId = "prod_1"
    const variantId = "var_1"
    const priceSetId = "price_set_1"
    const moneyAmountId = "money_amount_1"
    const linkId = "link_id_1"

    remoteQueryMock.mockImplementation((query) => {
      if (query.product) {
        return {
          id: productId,
        }
      } else if (query.variant) {
        return {
          id: variantId,
          product: [
            {
              id: productId,
            },
          ],
        }
      } else if (query.price_set) {
        return {
          id: priceSetId,
        }
      } else if (query.money_amount) {
        return {
          id: moneyAmountId,
          amount: 100,
          price_set: [
            {
              id: priceSetId,
            },
          ],
        }
      } else if (query.product_variant_price_set) {
        return {
          id: linkId,
          variant_id: variantId,
          price_set_id: priceSetId,
          variant: [
            {
              id: variantId,
            },
          ],
        }
      }

      return {}
    })

    const eventDataToEmit: EventBusTypes.EmitData[] = [
      {
        eventName: "product.created",
        data: {
          id: productId,
        },
      },
      {
        eventName: "variant.created",
        data: {
          id: variantId,
          product: {
            id: productId,
          },
        },
      },
      {
        eventName: "PriceSet.created",
        data: {
          id: priceSetId,
        },
      },
      {
        eventName: "price.created",
        data: {
          id: moneyAmountId,
          price_set: {
            id: priceSetId,
          },
        },
      },
      {
        eventName: "LinkProductVariantPriceSet.attached",
        data: {
          id: linkId,
          variant_id: variantId,
          price_set_id: priceSetId,
        },
      },
    ]

    await eventBus.emit(eventDataToEmit)

    expect(remoteQueryMock).toHaveBeenCalledTimes(5)

    const catalogEntries: Catalog[] = await manager.find(Catalog, {})

    const productCatalogEntries = catalogEntries.filter((entry) => {
      return entry.name === "Product"
    })

    expect(productCatalogEntries).toHaveLength(1)
    expect(productCatalogEntries[0].id).toEqual(productId)

    const variantCatalogEntries = catalogEntries.filter((entry) => {
      return entry.name === "ProductVariant"
    })

    expect(variantCatalogEntries).toHaveLength(1)
    expect(variantCatalogEntries[0].id).toEqual(variantId)

    const priceSetCatalogEntries = catalogEntries.filter((entry) => {
      return entry.name === "PriceSet"
    })

    expect(priceSetCatalogEntries).toHaveLength(1)
    expect(priceSetCatalogEntries[0].id).toEqual(priceSetId)

    const moneyAmountCatalogEntries = catalogEntries.filter((entry) => {
      return entry.name === "MoneyAmount"
    })

    expect(moneyAmountCatalogEntries).toHaveLength(1)
    expect(moneyAmountCatalogEntries[0].id).toEqual(moneyAmountId)

    const linkCatalogEntries = catalogEntries.filter((entry) => {
      return entry.name === "LinkProductVariantPriceSet"
    })

    expect(linkCatalogEntries).toHaveLength(1)
    expect(linkCatalogEntries[0].id).toEqual(linkId)

    const catalogRelationEntries: CatalogRelation[] = await manager.find(
      CatalogRelation,
      {}
    )

    expect(catalogRelationEntries).toHaveLength(4)

    const productVariantCatalogRelationEntries = catalogRelationEntries.filter(
      (entry) => {
        return (
          entry.parent_id === productId &&
          entry.parent_name === "Product" &&
          entry.child_id === variantId &&
          entry.child_name === "ProductVariant"
        )
      }
    )

    expect(productVariantCatalogRelationEntries).toHaveLength(1)

    const variantLinkCatalogRelationEntries = catalogRelationEntries.filter(
      (entry) => {
        return (
          entry.parent_id === variantId &&
          entry.parent_name === "ProductVariant" &&
          entry.child_id === linkId &&
          entry.child_name === "LinkProductVariantPriceSet"
        )
      }
    )

    expect(variantLinkCatalogRelationEntries).toHaveLength(1)

    const linkPriceSetCatalogRelationEntries = catalogRelationEntries.filter(
      (entry) => {
        return (
          entry.parent_id === linkId &&
          entry.parent_name === "LinkProductVariantPriceSet" &&
          entry.child_id === priceSetId &&
          entry.child_name === "PriceSet"
        )
      }
    )

    expect(linkPriceSetCatalogRelationEntries).toHaveLength(1)

    const priceSetMoneyAmountCatalogRelationEntries =
      catalogRelationEntries.filter((entry) => {
        return (
          entry.parent_id === priceSetId &&
          entry.parent_name === "PriceSet" &&
          entry.child_id === moneyAmountId &&
          entry.child_name === "MoneyAmount"
        )
      })

    expect(priceSetMoneyAmountCatalogRelationEntries).toHaveLength(1)

    const result = await module.query({
      select: {
        product: {
          variants: {
            money_amounts: true,
          },
        },
      },
    })

    expect(result).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            money_amounts: [
              {
                amount: 100,
                id: "money_amount_1",
              },
            ],
          },
        ],
      },
    ])
  })
})
