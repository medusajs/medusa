import { MedusaApp, Modules } from "@medusajs/modules-sdk"
import { EventBusTypes, ISearchModuleService } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { Catalog, CatalogRelation } from "@models"
import { knex } from "knex"
import { joinerConfig } from "../../src/__tests__/__fixtures__/joiner-config"
import modulesConfig from "../../src/__tests__/__fixtures__/modules-config"
import { EventBusService, schema } from "../__fixtures__"
import { DB_URL, TestDatabase } from "../utils"
import { run } from "../../src/scripts/seed"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import * as console from "console"

jest.setTimeout(300000)

const sharedPgConnection = knex<any, any>({
  client: "pg",
  connection: {
    connectionString: DB_URL,
  },
})

const searchEngineModuleOptions = {
  defaultAdapterOptions: {
    database: {
      clientUrl: DB_URL,
    },
  },
  schema,
}

const eventBus = new EventBusService()
const remoteQueryMock = jest.fn()

const injectedDependencies = {
  [ContainerRegistrationKeys.PG_CONNECTION]: sharedPgConnection,
  eventBusModuleService: eventBus,
  remoteQuery: remoteQueryMock,
}

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase()
  jest.clearAllMocks()
  return await TestDatabase.forkManager()
}

const afterEach_ = async () => {
  await TestDatabase.clearDatabase()
}

describe("SearchEngineModuleService", function () {
  const productId = "prod_1"
  const variantId = "var_1"
  const priceSetId = "price_set_1"
  const moneyAmountId = "money_amount_1"
  const linkId = "link_id_1"

  describe("on created or attached events", function () {
    let module: ISearchModuleService
    let manager

    beforeEach(async () => {
      manager = await beforeEach_()

      const { modules } = await MedusaApp({
        modulesConfig: {
          ...modulesConfig,
          [Modules.SEARCH]: {
            options: searchEngineModuleOptions,
          },
        },
        servicesConfig: joinerConfig,
        injectedDependencies,
      })

      module = modules.searchService as unknown as ISearchModuleService

      let a = 0
      remoteQueryMock.mockImplementation((query) => {
        if (query.product) {
          return {
            id: a++ > 0 ? "aaaa" : productId,
          }
        } else if (query.variant) {
          return {
            id: variantId,
            sku: "aaa test aaa",
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
          eventName: "product.created",
          data: {
            id: "PRODUCTASDASDAS",
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
    })

    it("should create the corresponding catalog entries and catalog relation entries", async function () {
      expect(remoteQueryMock).toHaveBeenCalledTimes(6)

      /**
       * Validate all catalog entries and catalog relation entries
       */

      const catalogEntries: Catalog[] = await manager.find(Catalog, {})

      const productCatalogEntries = catalogEntries.filter((entry) => {
        return entry.name === "Product"
      })

      expect(productCatalogEntries).toHaveLength(2)
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

      const productVariantCatalogRelationEntries =
        catalogRelationEntries.filter((entry) => {
          return (
            entry.parent_id === productId &&
            entry.parent_name === "Product" &&
            entry.child_id === variantId &&
            entry.child_name === "ProductVariant"
          )
        })

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

      /**
       * Validate querying
       */

      const [result, count] = await module.queryAndCount(
        {
          select: {
            product: {
              variants: {
                money_amounts: true,
              },
            },
          },
          where: {
            //"product.variants.sku": { $like: "aaa%" },
          },
        },
        {
          skip: 1,
          //keepFilteredEntities: true,
        }
      )

      expect(count).toEqual(2)
      expect(result).toEqual([
        {
          id: "prod_1",
          variants: [
            {
              id: "var_1",
              sku: "aaa test aaa",
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

  describe("on updated events", function () {
    let module: ISearchModuleService
    let manager

    beforeEach(async () => {
      manager = await beforeEach_()

      const { modules } = await MedusaApp({
        modulesConfig: {
          ...modulesConfig,
          [Modules.SEARCH]: {
            options: searchEngineModuleOptions,
          },
        },
        servicesConfig: joinerConfig,
        injectedDependencies,
      })

      module = modules.searchService as unknown as ISearchModuleService

      let a = 0
      remoteQueryMock.mockImplementation((query) => {
        if (query.product) {
          return {
            id: a++ > 0 ? "aaaa" : productId,
            title: "updated Title",
          }
        } else if (query.variant) {
          return {
            id: variantId,
            sku: "updated sku",
            product: [
              {
                id: productId,
              },
            ],
          }
        }

        return {}
      })

      const catalogRepository = manager.getRepository(Catalog)
      await manager.persistAndFlush(
        [
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
        ].map((data) => catalogRepository.create(data))
      )

      manager.clear()

      const eventDataToEmit: EventBusTypes.EmitData[] = [
        {
          eventName: "product.updated",
          data: {
            id: productId,
          },
        },
        {
          eventName: "variant.updated",
          data: {
            id: variantId,
            product: {
              id: productId,
            },
          },
        },
      ]

      await eventBus.emit(eventDataToEmit)
    })

    afterEach(afterEach_)

    it("should update the corresponding catalog entries", async () => {
      expect(remoteQueryMock).toHaveBeenCalledTimes(2)

      const updatedCatalogEntries = await manager.find(Catalog, {})

      expect(updatedCatalogEntries).toHaveLength(2)

      const productEntry = updatedCatalogEntries.find((entry) => {
        return entry.name === "Product" && entry.id === productId
      })

      expect(productEntry?.data?.title).toEqual("updated Title")

      const variantEntry = updatedCatalogEntries.find((entry) => {
        return entry.name === "ProductVariant" && entry.id === variantId
      })

      expect(variantEntry?.data?.sku).toEqual("updated sku")
    })
  })

  describe("on deleted events", function () {
    let module: ISearchModuleService
    let manager

    beforeEach(async () => {
      manager = await beforeEach_()

      const { modules } = await MedusaApp({
        modulesConfig: {
          ...modulesConfig,
          [Modules.SEARCH]: {
            options: searchEngineModuleOptions,
          },
        },
        servicesConfig: joinerConfig,
        injectedDependencies,
      })

      module = modules.searchService as unknown as ISearchModuleService

      let a = 0
      remoteQueryMock.mockImplementation((query) => {
        if (query.product) {
          return {
            id: a++ > 0 ? "aaaa" : productId,
          }
        } else if (query.variant) {
          return {
            id: variantId,
            sku: "aaa test aaa",
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

      const catalogRepository = manager.getRepository(Catalog)
      await manager.persistAndFlush(
        [
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
          {
            id: linkId,
            name: "LinkProductVariantPriceSet",
            data: {
              id: linkId,
              variant_id: variantId,
              price_set_id: priceSetId,
            },
          },
          {
            id: priceSetId,
            name: "PriceSet",
            data: {
              id: priceSetId,
              link_product_variant_price_set: {
                id: linkId,
              },
            },
          },
          {
            id: moneyAmountId,
            name: "MoneyAmount",
            data: {
              id: moneyAmountId,
              price_set: {
                id: priceSetId,
              },
            },
          },
        ].map((data) => catalogRepository.create(data))
      )

      const catalogRelationRepository = manager.getRepository(CatalogRelation)
      await manager.persistAndFlush(
        [
          {
            parent_id: productId,
            parent_name: "Product",
            child_id: variantId,
            child_name: "ProductVariant",
          },
          {
            parent_id: variantId,
            parent_name: "ProductVariant",
            child_id: linkId,
            child_name: "LinkProductVariantPriceSet",
          },
          {
            parent_id: linkId,
            parent_name: "LinkProductVariantPriceSet",
            child_id: priceSetId,
            child_name: "PriceSet",
          },
          {
            parent_id: priceSetId,
            parent_name: "PriceSet",
            child_id: moneyAmountId,
            child_name: "MoneyAmount",
          },
        ].map((data) => catalogRelationRepository.create(data))
      )

      manager.clear()

      const eventDataToEmit: EventBusTypes.EmitData[] = [
        {
          eventName: "product.deleted",
          data: {
            id: productId,
          },
        },
        {
          eventName: "variant.deleted",
          data: {
            id: variantId,
            product: {
              id: productId,
            },
          },
        },
      ]

      await eventBus.emit(eventDataToEmit)
    })

    afterEach(afterEach_)

    it("should consume all deleted events and delete the catalog entries", async () => {
      expect(remoteQueryMock).toHaveBeenCalledTimes(2)

      const catalogEntries = await manager.find(Catalog, {})
      const catalogRelationEntries = await manager.find(CatalogRelation, {})

      expect(catalogEntries).toHaveLength(3)
      expect(catalogRelationEntries).toHaveLength(2)

      const linkCatalogEntry = catalogEntries.find((entry) => {
        return (
          entry.name === "LinkProductVariantPriceSet" && entry.id === linkId
        )
      })!

      const priceSetCatalogEntry = catalogEntries.find((entry) => {
        return entry.name === "PriceSet" && entry.id === priceSetId
      })!

      const moneyAmountCatalogEntry = catalogEntries.find((entry) => {
        return entry.name === "MoneyAmount" && entry.id === moneyAmountId
      })!

      const linkPriceSetCatalogRelationEntry = catalogRelationEntries.find(
        (entry) => {
          return (
            entry.parent_id === linkId &&
            entry.parent_name === "LinkProductVariantPriceSet" &&
            entry.child_id === priceSetId &&
            entry.child_name === "PriceSet"
          )
        }
      )!

      expect(linkPriceSetCatalogRelationEntry.parent).toEqual(linkCatalogEntry)
      expect(linkPriceSetCatalogRelationEntry.child).toEqual(
        priceSetCatalogEntry
      )

      const priceSetMoneyAmountCatalogRelationEntry =
        catalogRelationEntries.find((entry) => {
          return (
            entry.parent_id === priceSetId &&
            entry.parent_name === "PriceSet" &&
            entry.child_id === moneyAmountId &&
            entry.child_name === "MoneyAmount"
          )
        })!

      expect(priceSetMoneyAmountCatalogRelationEntry.parent).toEqual(
        priceSetCatalogEntry
      )
      expect(priceSetMoneyAmountCatalogRelationEntry.child).toEqual(
        moneyAmountCatalogEntry
      )
    })
  })

  describe("query", function () {
    let module: ISearchModuleService
    let manager: SqlEntityManager

    beforeEach(async () => {
      manager = await beforeEach_()

      const { modules } = await MedusaApp({
        modulesConfig: {
          ...modulesConfig,
          [Modules.SEARCH]: {
            options: searchEngineModuleOptions,
          },
        },
        servicesConfig: joinerConfig,
        injectedDependencies,
      })

      module = modules.searchService as unknown as ISearchModuleService

      await run({
        path: "./src/scripts/seed-data/index.ts",
        options: searchEngineModuleOptions,
      })

      console.log("waiting 90s for all indexes and partition to be done.")
      await new Promise((resolve) => setTimeout(resolve, 90000))
    })

    afterEach(afterEach_)

    it("should query the data filtered by money amount amount", async function () {
      const moneyAmountToSearchFor = (await manager.findOne(Catalog, {
        name: "MoneyAmount",
      })) as Catalog

      const [, count] = await module.queryAndCount(
        {
          select: {
            product: {
              variants: {
                money_amounts: true,
              },
            },
          },
          where: {
            "product.variants.money_amounts.amount":
              moneyAmountToSearchFor.data.amount,
          },
        },
        {
          skip: 0,
        }
      )

      expect(count).toBeGreaterThan(0)
    })
  })
})
